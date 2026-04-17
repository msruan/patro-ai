# Patro AI

> An AI conversational chatbot, featuring a special mode aimed at the ADS (Systems Analysis and Development) class at IFPI.

Patro AI is a chat web application built with Next.js that exposes a conversational interface over language models compatible with the OpenAI API. It supports two operating modes: a general chat mode and an "ADS" mode, aimed at inside jokes and information (not always factual) about the Systems Analysis and Development class at IFPI Campus Teresina Central. It is also possible to send images along with messages for analysis by the model.

## Features

- **Conversational chat** with message history kept on the client
- **ADS mode** — contextualized responses with class data, loaded from a JSON file
- **Image support** — send an image along with the prompt for multimodal analysis
- **HTML response** — the model returns styled HTML directly in the message bubble
- **Persistent context** — the ADS context is reloaded from the database every session via Server Action
- **Animated UI** — animated gradient background and loading indicator on responses

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v3, shadcn/ui |
| AI | OpenAI SDK (compatible with any OpenAI-like endpoint) |
| Database | MongoDB via Mongoose |
| Logging | Pino |

## Getting Started

### Prerequisites

- Node.js 20.9+
- pnpm
- MongoDB (local or Atlas)
- An API key for a model compatible with the OpenAI API (e.g., OpenAI, Gemini via OpenAI compat, etc.)

### Installation

```bash
# Install dependencies
pnpm install
```

### Configuration

Copy the example file and fill in the variables:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `MONGO` | MongoDB connection string |
| `OPENAI_API_KEY` | AI provider API key |
| `OPENAI_API_MODEL` | Name of the model to be used (e.g., `gpt-4o`, `gemini-2.0-flash`) |
| `OPENAI_API_URL` | API Base URL (use the URL of the OpenAI-compatible provider) |
| `NEXT_PUBLIC_API_URL` | Base URL of the Next.js application itself (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_ALLOW_ADS_MODE` | `true` to enable ADS mode; `false` by default |
| `NEXT_PUBLIC_PINO_LOG_LEVEL` | Log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`) |

### ADS Mode

The ADS mode loads a `context.json` file in the project root and the instructions from `ads-instruction.txt`. This JSON file must contain the class information that the model will use to answer questions (and invent what it doesn't know).

> [!NOTE]
> ADS mode is only displayed in the UI when `NEXT_PUBLIC_ALLOW_ADS_MODE=true`.

### Running locally

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/       # POST /api/chat — chat completion
│   │   └── image/      # POST /api/image — image + text completion
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home-page.tsx   # Main component with chat logic
│   ├── message-input.tsx
│   ├── message-list.tsx
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── ai-model.ts     # OpenAI client and completion functions
│   ├── database.ts     # MongoDB connection
│   ├── context.ts      # Loading ADS context
│   └── ...
├── services/
│   └── chat.ts         # Fetch for API endpoints
├── actions/            # Server Actions (Next.js)
├── env.ts              # Environment variable validation
└── types.ts            # Shared types
```

## Instructions Files

The model's behavior is configured by two text files in the root:

- **`system-instructions.txt`** — general system instructions, applied in all modes. Defines the tone, the output format (pure HTML, without Markdown), and other base rules.
- **`ads-instruction.txt`** — additional instructions used in ADS mode, injected alongside the JSON class context.