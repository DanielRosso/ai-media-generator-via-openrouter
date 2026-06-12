<div align="center">
  <h1>🎬 AI Media Orchestrator (Web)</h1>
  <p>Eine sichere, serverseitig orchestrierte Next.js-Anwendung für die einheitliche KI-Mediengenerierung via OpenRouter.</p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 📌 Projektübersicht

Die KI-Modell-Landschaft ist stark fragmentiert, mit unterschiedlichen Anbietern für Bild- und Videogenerierung. Dieses Projekt bietet eine **einheitliche, zusammenhängende Weboberfläche**, um Medien über verschiedene Modelle (wie Flux, Luma, Runway) hinweg durch die Nutzung der OpenRouter API zu generieren. 

Gebaut mit modernem **React 19** und dem **Next.js 16 App Router**, dient es als Showcase für **Sicheres API-Proxying** und moderne Frontend-Architektur.

## 🏗️ Architektur & Technische Highlights

Als Softwareentwickler konzentriere ich mich nicht nur auf die Benutzeroberfläche, sondern vor allem darauf, wie die Anwendung unter der Haube strukturiert ist:

- **🔐 Serverseitiges API-Proxying:** Der OpenRouter API-Key wird über sichere `.env`-Variablen eingebunden und ausschließlich in den Next.js Backend-Routen (`app/api/`) verwendet. Das Client-Frontend exponiert den API-Key *niemals*. Das verhindert Token-Leaks und ermöglicht zukünftige Skalierbarkeit (wie z.B. Redis Rate-Limiting).
- **⚡ Moderner App Router:** Nutzt den Next.js App Router für eine optimale Aufteilung von Server- und Client-Komponenten, was die JavaScript-Payload-Größe reduziert und die Ladezeiten (TTI) verbessert.
- **🛡️ Typensicherheit:** Durchgehende TypeScript-Interfaces stellen eine strikte Validierung der Daten sicher, bevor diese an die LLM-Provider gesendet werden, und verhindern so Laufzeitfehler.
- **🎨 Responsives UI:** Gestylt mit Tailwind CSS v4, bietet die App eine saubere, Mobile-First und leicht wartbare Oberfläche.

## 🚀 Lokaler Start

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. API Keys konfigurieren

Erstelle eine Datei namens `.env.local` im Root-Verzeichnis. Diese Datei wird absichtlich durch die `.gitignore` ignoriert.

```env
OPENROUTER_API_KEY=dein_api_key_hier
```

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Die App ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

## 📁 Projektstruktur (Auszug)

```text
├── app/
│   ├── api/generate/    # Backend Proxy (Sichere Ausführung)
│   ├── layout.tsx       # Root Layout (Server Component)
│   └── page.tsx         # Hauptseite (Interaktives Client UI)
├── lib/
│   └── models.ts        # Typsichere Modell-Definitionen
└── .env.local           # Lokale Secrets (Ignoriert in Git)
```

## 📄 Lizenz
Dieses Projekt steht unter der [MIT-Lizenz](./LICENSE).
