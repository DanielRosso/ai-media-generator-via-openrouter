# 🎬 Next.js OpenRouter Media Generator

Ein modernes Web-App-Projekt auf Basis von **Next.js**, das die **OpenRouter API** nutzt, um KI-gestützte Bild- und Videogenerierung direkt im Browser zu ermöglichen.

---

## ✨ Features

- 🖼️ Bild- und Videogenerierung via OpenRouter API
- ⚡ Gebaut mit Next.js (App Router) & TypeScript
- 🎨 Styling mit Tailwind CSS
- 🔒 API-Key wird serverseitig verwaltet – niemals im Frontend exponiert

---

## 🚀 Lokaler Start

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen einrichten

Erstelle eine Datei namens `.env.local` im Hauptverzeichnis und füge deinen OpenRouter API-Key ein:

```env
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Wichtig:** Die Datei `.env.local` ist in `.gitignore` eingetragen und wird **niemals** in das Repository hochgeladen.

### 3. Entwicklungsserver starten

```bash
npm run dev
```

Die App ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

## 🛠️ Technologie-Stack

| Technologie | Version |
|---|---|
| [Next.js](https://nextjs.org) | 16.x |
| [React](https://react.dev) | 19.x |
| [TypeScript](https://www.typescriptlang.org) | 5.x |
| [Tailwind CSS](https://tailwindcss.com) | 4.x |
| [OpenRouter API](https://openrouter.ai) | – |

---

## 📁 Projektstruktur

```
├── app/
│   ├── api/generate/    # Server-seitige API-Route (OpenRouter)
│   ├── layout.tsx       # Root Layout
│   └── page.tsx         # Hauptseite
├── lib/
│   └── models.ts        # Verfügbare KI-Modelle
├── public/              # Statische Assets
├── .env.local           # 🔒 Lokale Umgebungsvariablen (nicht im Repo!)
└── README.md
```

---

## 📄 Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](./LICENSE) – © 2026.
