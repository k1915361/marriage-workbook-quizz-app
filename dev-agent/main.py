"""
dev-agent/main.py — Hermes-Style Development Agent
====================================================
A lightweight, agentic development assistant for marriage-workbook-quizz-app.

Inspired by the Hermes Agent pattern (Nous Research): the agent is given a set
of tools it can call in JSON, the responses are fed back into the conversation,
and the loop continues until the model signals it has finished (no more tool calls).

Usage:
    cd dev-agent
    python main.py

Requirements:
    pip install -r requirements.txt
"""

import json
import os
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

PROJECT_ROOT = Path(__file__).parent.parent.resolve()

SYSTEM_PROMPT = f"""You are a Hermes-style autonomous development agent for the project:

  "Marriage Enrichment Quiz App"  (marriage-workbook-quizz-app)
  Root: {PROJECT_ROOT}

Stack: SolidJS · Base UI Solid · Vite · TypeScript
The project implements a quiz based on "The 7 Principles of Creation Marriage
Enrichment Workbook" by Stephen Stacey.

## Your Capabilities
You have access to the following tools. Use them proactively to understand the
codebase before making changes. Always read files before writing them.

## Tool-Use Protocol (Hermes format)
When you need to use a tool, respond with ONLY a JSON block (no prose before it):

```json
{{
  "tool": "<tool_name>",
  "args": {{ ... }}
}}
```

After the tool result is returned to you, continue reasoning. When you are done
and have no more tool calls to make, respond normally in plain prose.

## Rules
- Never delete files without explicit user confirmation.
- Keep changes minimal and surgical.
- Prefer TypeScript-idiomatic patterns consistent with the existing codebase.
- Always explain your reasoning before and after making code changes.
"""

# ---------------------------------------------------------------------------
# Tool Definitions (OpenAI function-calling schema)
# ---------------------------------------------------------------------------

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Read the contents of a file. Path is relative to the project root.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path from project root, e.g. src/App.tsx"}
                },
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Write (or overwrite) a file. Path is relative to project root.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path from project root"},
                    "content": {"type": "string", "description": "Full file content to write"},
                },
                "required": ["path", "content"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "list_dir",
            "description": "List files and directories at a given path (relative to project root).",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Relative path from project root, e.g. src/components"}
                },
                "required": ["path"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "run_command",
            "description": (
                "Run a shell command in the project root. "
                "Use for npm scripts, git commands, or build checks. "
                "NEVER run destructive commands (rm -rf, git reset --hard, etc.)."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "The command to run"},
                },
                "required": ["command"],
            },
        },
    },
]

# ---------------------------------------------------------------------------
# Tool Implementations
# ---------------------------------------------------------------------------

BLOCKED_COMMANDS = {"rm", "del", "rmdir", "format", "mkfs", "dd", "git reset", "git clean"}


def tool_read_file(path: str) -> str:
    target = PROJECT_ROOT / path
    if not target.exists():
        return f"ERROR: File not found: {path}"
    try:
        return target.read_text(encoding="utf-8")
    except Exception as exc:
        return f"ERROR reading file: {exc}"


def tool_write_file(path: str, content: str) -> str:
    target = PROJECT_ROOT / path
    try:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        return f"OK: Wrote {len(content)} bytes to {path}"
    except Exception as exc:
        return f"ERROR writing file: {exc}"


def tool_list_dir(path: str) -> str:
    target = PROJECT_ROOT / path
    if not target.exists():
        return f"ERROR: Path not found: {path}"
    entries = []
    for entry in sorted(target.iterdir()):
        kind = "DIR" if entry.is_dir() else "FILE"
        entries.append(f"[{kind}] {entry.name}")
    return "\n".join(entries) if entries else "(empty directory)"


def tool_run_command(command: str) -> str:
    # Basic safety guard
    cmd_lower = command.lower().strip()
    for blocked in BLOCKED_COMMANDS:
        if cmd_lower.startswith(blocked):
            return f"ERROR: Command '{blocked}' is blocked for safety. Please confirm manually."
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=str(PROJECT_ROOT),
            capture_output=True,
            text=True,
            timeout=30,
        )
        output = result.stdout + result.stderr
        return output.strip() or "(command produced no output)"
    except subprocess.TimeoutExpired:
        return "ERROR: Command timed out after 30 seconds."
    except Exception as exc:
        return f"ERROR: {exc}"


TOOL_MAP = {
    "read_file": lambda args: tool_read_file(args["path"]),
    "write_file": lambda args: tool_write_file(args["path"], args["content"]),
    "list_dir": lambda args: tool_list_dir(args["path"]),
    "run_command": lambda args: tool_run_command(args["command"]),
}

# ---------------------------------------------------------------------------
# Agent Loop
# ---------------------------------------------------------------------------


def dispatch_tool_call(tool_call) -> str:
    """Execute a single tool call and return its string result."""
    name = tool_call.function.name
    try:
        args = json.loads(tool_call.function.arguments)
    except json.JSONDecodeError as exc:
        return f"ERROR: Could not parse tool arguments: {exc}"

    handler = TOOL_MAP.get(name)
    if not handler:
        return f"ERROR: Unknown tool '{name}'"

    print(f"\n  [tool:{name}] {args}", flush=True)
    result = handler(args)
    # Truncate very long results to avoid blowing up the context
    if len(result) > 8000:
        result = result[:8000] + "\n...(truncated)"
    return result


def run_agent_turn(client: OpenAI, model: str, messages: list) -> str:
    """
    Run one full agent turn: call the LLM, process tool calls (if any),
    and repeat until the model returns a plain-text response.
    Returns the final assistant message content.
    """
    while True:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            stream=False,
        )

        choice = response.choices[0]
        msg = choice.message

        # Append assistant message to history
        messages.append(msg)

        # If no tool calls, we're done
        if not msg.tool_calls:
            content = msg.content or ""
            print(f"\nAgent: {content}\n", flush=True)
            return content

        # Process each tool call
        print("\nAgent is using tools...", flush=True)
        for tc in msg.tool_calls:
            result = dispatch_tool_call(tc)
            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": result,
            })


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------


def main():
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key or "your_" in api_key:
        print("ERROR: Please set OPENROUTER_API_KEY in dev-agent/.env")
        print("  Copy .env.example -> .env and fill in your key.")
        sys.exit(1)

    model = os.getenv("MODEL_NAME", "google/gemma-4-31b-it:free")

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
        default_headers={
            "HTTP-Referer": "https://github.com/marriage-workbook-quizz-app",
            "X-Title": "Marriage Quiz Dev Agent",
        },
    )

    print("=" * 50)
    print("  Marriage Quiz — Hermes Development Agent")
    print(f"  Model : {model}")
    print(f"  Root  : {PROJECT_ROOT}")
    print("  Tools : read_file, write_file, list_dir, run_command")
    print("  Type 'exit' to quit.")
    print("=" * 50)
    print()

    messages: list = [{"role": "system", "content": SYSTEM_PROMPT}]

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit", "q"}:
            print("Goodbye!")
            break

        messages.append({"role": "user", "content": user_input})
        run_agent_turn(client, model, messages)


if __name__ == "__main__":
    main()
