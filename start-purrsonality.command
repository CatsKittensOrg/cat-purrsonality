#!/bin/zsh

cd "$(dirname "$0")"

export PATH="/Users/dominadominavixen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
PNPM="/Users/dominadominavixen/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/pnpm"

"$PNPM" install
"$PNPM" run build
"$PNPM" exec vite preview --host 127.0.0.1 --port 4190
