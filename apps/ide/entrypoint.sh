#!/bin/sh
set -e

EXTENSIONS_DIR="${EXTENSIONS_DIR:-/home/coder/extensions}"
USER_DATA_DIR="${USER_DATA_DIR:-/home/coder/user-data}"
PROJECT_DIR="${PROJECT_DIR:-/home/coder/project}"
EXTENSION_SOURCE="${PROJECT_DIR}/apps/ide/extensions/fredmen.gemini-agent-0.1.0"
EXTENSION_TARGET="${EXTENSIONS_DIR}/fredmen.gemini-agent-0.1.0"

mkdir -p "${EXTENSIONS_DIR}" "${USER_DATA_DIR}"

if [ -d "${EXTENSION_SOURCE}" ]; then
  rm -rf "${EXTENSION_TARGET}"
  cp -R "${EXTENSION_SOURCE}" "${EXTENSION_TARGET}"
fi

exec code-server \
  --bind-addr 0.0.0.0:8080 \
  --auth password \
  --disable-telemetry \
  --disable-update-check \
  --extensions-dir "${EXTENSIONS_DIR}" \
  --user-data-dir "${USER_DATA_DIR}" \
  "${PROJECT_DIR}"
