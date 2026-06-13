#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_DIR="$ROOT/../backend/proto"
OUT_DIR="$ROOT/src/lib/grpc/gen"
PLUGIN="$ROOT/node_modules/protoc-gen-grpc-web/bin/protoc-gen-grpc-web"
JS_PLUGIN="$ROOT/node_modules/protoc-gen-js/bin/protoc-gen-js"

mkdir -p "$OUT_DIR"

if [ ! -f "$PLUGIN" ] && [ ! -f "${PLUGIN}.exe" ]; then
  node "$ROOT/node_modules/protoc-gen-grpc-web/post-install.js"
fi

if [ ! -f "$JS_PLUGIN" ] && [ ! -f "${JS_PLUGIN}.exe" ]; then
  node "$ROOT/node_modules/protoc-gen-js/post-install.js"
fi

if [ -f "${PLUGIN}.exe" ]; then
  PLUGIN="${PLUGIN}.exe"
fi

if [ -f "${JS_PLUGIN}.exe" ]; then
  JS_PLUGIN="${JS_PLUGIN}.exe"
fi

(cd "$ROOT/../backend" && uv run python -m grpc_tools.protoc \
  -I proto \
  --plugin="protoc-gen-grpc-web=$PLUGIN" \
  --plugin="protoc-gen-js=$JS_PLUGIN" \
  --js_out=import_style=commonjs,binary:"$OUT_DIR" \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:"$OUT_DIR" \
  proto/v1/auth.proto proto/v1/category.proto proto/v1/common.proto proto/v1/health.proto proto/v1/inventory.proto)

echo "Generated gRPC-Web stubs in $OUT_DIR"
