"use client";

import { useState } from "react";

type MediaType = "image" | "video";

interface GenerateResult {
  url?: string;
  error?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, mediaType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ error: data.error ?? "Unbekannter Fehler" });
      } else {
        setResult({ url: data.url });
      }
    } catch {
      setResult({ error: "Netzwerkfehler – bitte erneut versuchen." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start px-4 py-16">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Media Generator
          </h1>
          <p className="mt-2 text-zinc-400 text-sm">
            Erstelle Bilder und Videos mit KI – einfach Prompt eingeben und
            generieren.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl">
          {/* Prompt */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="prompt"
              className="text-sm font-medium text-zinc-300"
            >
              Prompt
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Beschreibe das Bild oder Video, das du erstellen möchtest …"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Media type dropdown */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="mediaType"
              className="text-sm font-medium text-zinc-300"
            >
              Medientyp
            </label>
            <select
              id="mediaType"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition appearance-none cursor-pointer"
            >
              <option value="image">🖼️ Bild</option>
              <option value="video">🎬 Video</option>
            </select>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="mt-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Generiere …
              </span>
            ) : (
              "✨ Generieren"
            )}
          </button>
        </div>

        {/* Result area */}
        {result && (
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-xl overflow-hidden">
            {result.error ? (
              <div className="p-6 text-red-400 text-sm">
                ⚠️ {result.error}
              </div>
            ) : result.url ? (
              <div className="flex flex-col gap-3 p-4">
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">
                  Ergebnis
                </p>
                {mediaType === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.url}
                    alt="Generiertes Bild"
                    className="w-full rounded-xl object-contain max-h-[512px]"
                  />
                ) : (
                  <video
                    src={result.url}
                    controls
                    className="w-full rounded-xl max-h-[512px]"
                  />
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
