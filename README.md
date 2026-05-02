# Luax

Luax is a clean desktop learning app for Roblox Studio and Luau. It teaches from complete beginner to advanced game systems with visual lessons, animated labs, code examples, quizzes, a RemoteEvent flow simulator, animation marker guidance, and an AI mentor panel.

## What it teaches

- Roblox Studio basics: Viewport, Explorer, Properties, Output
- Luau scripting: variables, functions, tables, events, modules
- GUI: ScreenGui, Frames, buttons, LocalScripts, responsive UI ideas
- Script linking: LocalScripts, ServerScripts, ModuleScripts
- RemoteEvents: client requests, server validation, server-owned rewards
- Animation events: markers, hit frames, sounds, VFX, combat timing
- Data systems: leaderstats, DataStores, profiles, saves
- Pro systems: RPG combat, abilities, farming loops, shops, inventory, quests

## Tech stack

- Electron desktop app shell
- JavaScript lesson engine and animated UI
- Python assistant helper with a JavaScript fallback
- Optional C++ native helper starter in `native/`

Roblox games themselves use Luau for gameplay scripting. Luax is the desktop app that teaches Luau and Roblox Studio systems.

## Run locally

Install Node.js first, then run:

```bash
npm install
npm start
```

The app intentionally shows a 60-second animated boot screen before the academy opens. For development previews you can use:

```bash
npm run dev
```

## Build an installer

```bash
npm install
npm run dist:win
```

The Windows installer and portable build will appear in `dist/`.

## GitHub release flow

1. Create a new GitHub repository named `luax`.
2. Upload these files.
3. Push to the `main` branch.
4. GitHub Actions will build a Windows artifact from `.github/workflows/build.yml`.
5. Download the artifact from the Actions run and attach it to a GitHub Release.

## Optional Python assistant

The app tries to call `assistant/luax_assistant.py`. If Python is not installed, Luax still works because it has a built-in JavaScript mentor fallback.

To force a Python path:

```bash
set LUAX_PYTHON=C:\Path\To\python.exe
npm start
```

## Optional C++ module

The C++ starter is in `native/`. Build it separately if you want to experiment with native helpers:

```bash
cmake -S native -B native/build
cmake --build native/build --config Release
```
