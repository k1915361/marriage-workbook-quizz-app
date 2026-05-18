# Marriage Enrichment Quiz App

> A quiz app based on **"The 7 Principles of Creation Marriage Enrichment Workbook"**  
> by Stephen Stacey.

Built with **SolidJS · Base UI Solid · Vite** — zero-budget,
fast, and fully accessible.

---

## Quick Start

```bash
npm install
npm run dev
```

Open <http://localhost:5173> in your browser.

---

## Development Agent

A [Hermes-style](https://github.com/NousResearch/hermes-function-calling) agentic
development assistant is included in `dev-agent/`. It uses **OpenAI-compatible tool
calling** (function calling) so the LLM can read files, list directories, write code,
and run npm commands on your behalf.

### Setup

```bash
cd dev-agent
pip install -r requirements.txt
cp .env.example .env         # then edit .env and add your key
python main.py
```

### Available Tools (agent-facing)

| Tool | Description |
|---|---|
| `read_file` | Read any project file |
| `list_dir` | List directory contents |
| `write_file` | Create or overwrite a file |
| `run_command` | Run npm / git commands (safe commands only) |

### Model Options (via OpenRouter)

| Model | Intelligence | Cost |
|---|---|---|
| `google/gemma-4-31b-it:free` | 39 | **Free** ✓ default |
| `deepseek/deepseek-r1:free` | — | **Free** |
| `deepseek/deepseek-chat-v3-5` | 47 | ~$0.18/M |
| `minimax/minimax-m1` | 50 | ~$0.52/M |
| `nvidia/nemotron-super-3-27b` | 36 | ~$0.41/M |

Change the model by setting `MODEL_NAME` in `dev-agent/.env`.

---

## Architecture

See [architecture.md](./architecture.md) for:
- Tech stack decisions & rationale
- SolidJS best practices
- Known bugs and fixes
- Accessibility notes
- Future roadmap

---

## Architecture Notes

### TypeScript Compiler (`tsgo`)

A native Go-based TypeScript compiler (`@typescript/native-preview`) offers up
to 10× faster type-checking. **Decision: not adopted** — this project is tiny,
and Vite already uses `esbuild` (Go-based) for TS compilation during dev/build.
Standard `tsc` type-checks the project in milliseconds. Revisit if the codebase
grows substantially.
