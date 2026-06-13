#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_DIR="$ROOT/proto"
OUT_DIR="$ROOT/app/grpc/gen"

mkdir -p "$OUT_DIR"

uv run python -m grpc_tools.protoc \
  -I "$PROTO_DIR" \
  --python_out="$OUT_DIR" \
  --grpc_python_out="$OUT_DIR" \
  "$PROTO_DIR/v1/auth.proto" \
  "$PROTO_DIR/v1/inventory.proto"

touch "$OUT_DIR/__init__.py"
touch "$OUT_DIR/v1/__init__.py"

echo "Generated gRPC stubs in $OUT_DIR/v1/"
