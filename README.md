# Cristio

An autonomous AI agent. Lightweight, extensible, always listening.

Cristio wraps [opencode](https://opencode.ai) as a thin pipe — reads stdin, streams responses, bridges Telegram. Runs on your machine, responds in real-time.

## Architecture

```
stdin / Telegram → adam.js → opencode run -s <session> → stream → stdout / Telegram
```

- **adam.js** (~250 lines) — stdin reads, Telegram IPC, streaming response, silence guard
- **telegram.js** (~57 lines) — forked child, polls Telegram 1s interval, two-way messaging
- **adam.sh** — restart loop (exit code 42 = cycle)

### Streaming

Responses stream through a 1.5s debounce timer — chunks accumulate, flush on idle or end-of-stream. No per-newline message spam.

### Silence Guard

`[SILENT]`, `...`, or `[沉默]` suppresses all output — caught both on input (before processing) and output (before sending). Supports `[silent - reason]` prefix style for internal commentary.

## Setup

```bash
git clone https://github.com/Jeremiah-Crouse/cristio.ru.git
cd cristio.ru
npm install
cp .env.example .env   # add TELEGRAM_TOKEN, OPENCODE_SESSION, etc.
./adam.sh
```

## Domain

[cristio.ru](https://cristio.ru) — Reino Unido. A quiet corner.
