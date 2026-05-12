# IDE (VS Code-like) Setup

This repository includes a Code-Server based IDE that provides a VS Code-like experience with a bundled Gemini agent extension.

## What’s Included
- VS Code-like editor, terminal, Git UI, and debugger via Code-Server
- Gemini agent extension with a chat panel and selection-based code action
- Extension management via the Code-Server Extensions view (Open VSX registry)

## Prerequisites
- Docker & Docker Compose
- Gemini API key

## Configuration
Update your `.env` file (see `.env.example`):
- `GEMINI_API_KEY` (required for the backend proxy)
- `IDE_PASSWORD` (required to access the IDE)
- `IDE_GEMINI_PROXY_URL` (optional, default points to the backend service)
- `GEMINI_DEFAULT_MODEL` (optional)

## Run the IDE
From the repo root:
```bash
yarn ide
```

Then open: `http://localhost:8080`

## Gemini Extension Usage
- Command Palette → **Gemini: Open Chat**
- Select code and run **Gemini: Explain Selection** (also available as a code action)

The extension uses the backend proxy at `/api/ide/gemini`, so the API key stays server-side.

## Installing More Extensions
Use the Extensions view in the IDE. Code-Server uses the Open VSX registry by default, so Marketplace-only extensions may not be available.

## Notes
- Note: The Microsoft VS Code Marketplace is not available without licensing. Code-server uses the Open VSX registry, so not all VS Code extensions are available.
- For production, set a strong `IDE_PASSWORD` and run behind HTTPS.
