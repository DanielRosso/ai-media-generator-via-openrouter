<div align="center">
  <h1>🎬 AI Media Orchestrator (Web)</h1>
  <p>A secure, server-side orchestrated Next.js application for unified AI media generation via OpenRouter.</p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

---

## 📌 Executive Summary

The AI model landscape is highly fragmented, with different providers for image and video generation. This project provides a **unified, cohesive web interface** to generate media across different models (like Flux, Luma, Runway) by leveraging the OpenRouter API. 

Built with modern **React 19** and the **Next.js 16 App Router**, it serves as a showcase for **Secure API Proxying** and modern frontend architecture.

## 🏗️ Architecture & Technical Highlights

As a professional software engineer, I focus not just on UI, but on how the application is structured under the hood:

- **🔐 Server-Side API Proxying:** The OpenRouter API key is injected via secure `.env` variables and is solely used within Next.js backend routes (`app/api/`). The client frontend *never* exposes the API key, preventing token leaks and enabling future scalability (like adding Redis rate-limiting).
- **⚡ Modern App Router:** Utilizes the Next.js App Router for an optimal Server/Client Component split, reducing JavaScript payload size and improving TTI (Time to Interactive).
- **🛡️ Type Safety:** End-to-end TypeScript interfaces ensure strict payload validation before any data is sent to the LLM providers, preventing runtime errors.
- **🎨 Responsive UI:** Styled with Tailwind CSS v4, offering a clean, mobile-first, and highly maintainable interface.

## 🚀 Lokaler Start (Getting Started)

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
│   ├── api/generate/    # Backend Proxy (Secure execution)
│   ├── layout.tsx       # Root Layout (Server Component)
│   └── page.tsx         # Hauptseite (Interactive Client UI)
├── lib/
│   └── models.ts        # Type-safe model definitions
└── .env.local           # Local secrets (Ignored in Git)
```

## 📄 Lizenz
Dieses Projekt steht unter der [MIT-Lizenz](./LICENSE).
