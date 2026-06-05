# healthy

A personal health tracking app built with Tauri, React, and Rust. Track weight, blood pressure, and energy level daily, visualise trends, and get LLM observations on your data.

## Prerequisites

### Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Node / pnpm

```bash
# Install Node via nvm, then pnpm
npm install -g pnpm
```

### System dependencies (Linux / Fedora)

Tauri links against the GTK/WebKit stack for both tests and the app binary:

```bash
sudo dnf install webkit2gtk4.1-devel librsvg2-devel dbus-devel pkgconf-pkg-config
```

For other distros see the [Tauri prerequisites guide](https://tauri.app/start/prerequisites/).

## Install

```bash
# Fedora system dependencies (required for tests, dev, and build)
sudo dnf install webkit2gtk4.1-devel librsvg2-devel dbus-devel pkgconf-pkg-config

# Install JS dependencies
pnpm install
```

## Run locally

```bash
make dev
# or directly:
pnpm tauri dev
```

The app opens as a native window. The Rust backend recompiles on save; the React frontend hot-reloads via Vite.

## Test

```bash
make test          # run all tests (Rust + React)
make test-rust     # cargo test in src-tauri/
make test-react    # vitest run
```

The Rust suite covers unit tests (in-memory SQLite) and integration tests via Tauri's mock runtime. The React suite uses Vitest with jsdom.

## Build

```bash
pnpm tauri build
```

Produces a native installer in `src-tauri/target/release/bundle/`:
- **Linux** — `.AppImage` and `.deb`
- **macOS** — `.dmg`
- **Windows** — `.msi`

## Configuration

On first launch open the **Settings** tab and enter:

| Field | Description |
|---|---|
| API URL | Base URL of any OpenAI-compatible endpoint, e.g. `http://pond:9337` or `https://api.openai.com` |
| API Token | Bearer token for the endpoint |
| Model | Model name, e.g. `gpt-4o-mini` or `qwen3-coder-30b.gguf` |

Data is stored in the OS app-data directory:
- **Linux** — `~/.local/share/healthy/`
- **macOS** — `~/Library/Application Support/healthy/`
- **Windows** — `%APPDATA%\healthy\`
