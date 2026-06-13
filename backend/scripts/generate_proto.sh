#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_DIR="$ROOT/proto"
OUT_DIR="$ROOT/app/grpc/gen"

mkdir -p "$OUT_DIR"

mapfile -t PROTO_FILES < <(find "$PROTO_DIR" -name '*.proto' -type f | sort)

if [ "${#PROTO_FILES[@]}" -eq 0 ]; then
  echo "No .proto files found under $PROTO_DIR" >&2
  exit 1
fi

uv run python -m grpc_tools.protoc \
  -I "$PROTO_DIR" \
  --python_out="$OUT_DIR" \
  --grpc_python_out="$OUT_DIR" \
  "${PROTO_FILES[@]}"

touch "$OUT_DIR/__init__.py"
while IFS= read -r dir; do
  touch "$dir/__init__.py"
done < <(find "$OUT_DIR" -type d)

echo "Generated gRPC stubs in $OUT_DIR from ${#PROTO_FILES[@]} proto file(s):"
printf '  %s\n' "${PROTO_FILES[@]#$ROOT/}"
