import { NextRequest } from "next/server";
import { DEFAULT_IMAGE_MODEL, DEFAULT_VIDEO_MODEL } from "@/lib/models";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";

// Extracts an image URL from the OpenRouter chat-completions response.
// OpenRouter may return a plain URL, a Markdown image link ![...](url),
// or a Markdown hyperlink [...](url).
function extractImageUrl(content: string): string | null {
  const trimmed = content.trim();

  // Plain URL
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Markdown image: ![alt](url)
  const mdImage = trimmed.match(/!\[.*?\]\((https?:\/\/[^)]+)\)/);
  if (mdImage) return mdImage[1];

  // Markdown link: [text](url)
  const mdLink = trimmed.match(/\[.*?\]\((https?:\/\/[^)]+)\)/);
  if (mdLink) return mdLink[1];

  // Any bare URL inside the string
  const bare = trimmed.match(/https?:\/\/\S+/);
  if (bare) return bare[0];

  return null;
}

// Waits for a given number of milliseconds.
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  // ── API-Key guard ──────────────────────────────────────────────────────────
  if (!OPENROUTER_API_KEY) {
    return Response.json(
      { error: "OPENROUTER_API_KEY ist nicht konfiguriert." },
      { status: 500 }
    );
  }

  // ── Request validation ─────────────────────────────────────────────────────
  let body: { prompt?: string; mediaType?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ungültiger Request-Body." }, { status: 400 });
  }

  const { prompt, mediaType } = body;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return Response.json(
      { error: "Kein Prompt angegeben." },
      { status: 400 }
    );
  }

  if (mediaType !== "image" && mediaType !== "video") {
    return Response.json(
      { error: "Ungültiger Medientyp. Erlaubt: 'image' oder 'video'." },
      { status: 400 }
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
  };

  // ── Image generation ───────────────────────────────────────────────────────
  if (mediaType === "image") {
    try {
      const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: DEFAULT_IMAGE_MODEL,
          messages: [{ role: "user", content: prompt.trim() }],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error?.message ?? data?.error ?? "Fehler bei der Bildgenerierung.";
        return Response.json({ error: message }, { status: response.status });
      }

      // Some models (e.g. flux.2-pro) return the image as a Base64 Data-URI
      // inside choices[0].message.images[0].image_url.url instead of content.
      const imageFromImages: string | undefined =
        data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      const rawContent: string =
        data?.choices?.[0]?.message?.content ?? "";

      const imageUrl: string | null =
        imageFromImages ?? extractImageUrl(rawContent);

      if (!imageUrl) {
        return Response.json(
          {
            error:
              "Keine Bild-URL in der API-Antwort gefunden. Rohantwort: " +
              rawContent.slice(0, 200),
          },
          { status: 502 }
        );
      }

      return Response.json({ url: imageUrl });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      return Response.json(
        { error: `Netzwerkfehler bei der Bildgenerierung: ${message}` },
        { status: 500 }
      );
    }
  }

  // ── Video generation ───────────────────────────────────────────────────────
  // Step 1: Submit the job
  let jobId: string;
  try {
    const submitResponse = await fetch(`${OPENROUTER_BASE}/videos`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: DEFAULT_VIDEO_MODEL,
        prompt: prompt.trim(),
      }),
    });

    const submitData = await submitResponse.json();

    if (!submitResponse.ok) {
      const message =
        submitData?.error?.message ??
        submitData?.error ??
        "Fehler beim Starten der Videogenerierung.";
      return Response.json({ error: message }, { status: submitResponse.status });
    }

    jobId = submitData?.id ?? submitData?.job_id;

    if (!jobId) {
      return Response.json(
        {
          error:
            "Keine Job-ID in der API-Antwort gefunden. Rohantwort: " +
            JSON.stringify(submitData).slice(0, 200),
        },
        { status: 502 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unbekannter Fehler";
    return Response.json(
      { error: `Netzwerkfehler beim Starten der Videogenerierung: ${message}` },
      { status: 500 }
    );
  }

  // Step 2: Poll until completed (max ~5 minutes, every 5 s)
  const MAX_POLLS = 60;
  const POLL_INTERVAL_MS = 5_000;

  for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
    await sleep(POLL_INTERVAL_MS);

    let statusData: Record<string, unknown>;
    try {
      const statusResponse = await fetch(
        `${OPENROUTER_BASE}/videos/${jobId}`,
        { headers }
      );

      statusData = await statusResponse.json();

      if (!statusResponse.ok) {
        const message =
          (statusData?.error as { message?: string } | undefined)?.message ??
          statusData?.error ??
          "Fehler beim Abfragen des Video-Status.";
        return Response.json({ error: message }, { status: statusResponse.status });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      return Response.json(
        { error: `Netzwerkfehler beim Polling des Video-Status: ${message}` },
        { status: 500 }
      );
    }

    const status = statusData?.status as string | undefined;

    if (status === "completed" || status === "succeeded") {
      const videoUrl =
        (statusData?.video_url as string | undefined) ??
        (statusData?.url as string | undefined) ??
        ((statusData?.output as { url?: string } | undefined)?.url);

      if (!videoUrl) {
        return Response.json(
          {
            error:
              "Video fertig, aber keine URL gefunden. Rohantwort: " +
              JSON.stringify(statusData).slice(0, 200),
          },
          { status: 502 }
        );
      }

      return Response.json({ url: videoUrl });
    }

    if (status === "failed" || status === "error") {
      const reason =
        (statusData?.error as string | undefined) ??
        (statusData?.message as string | undefined) ??
        "Videogenerierung fehlgeschlagen.";
      return Response.json({ error: reason }, { status: 500 });
    }

    // status is "pending" | "processing" | "running" → keep polling
  }

  return Response.json(
    { error: "Timeout: Die Videogenerierung hat zu lange gedauert (> 5 Minuten)." },
    { status: 504 }
  );
}
