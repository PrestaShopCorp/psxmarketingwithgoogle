#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
contract="$root/tests/runtime-network-contract.sh"
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

mkdir -p \
  "$tmpdir/tests" \
  "$tmpdir/classes" \
  "$tmpdir/config" \
  "$tmpdir/controllers" \
  "$tmpdir/sql" \
  "$tmpdir/upgrade" \
  "$tmpdir/views/templates/admin" \
  "$tmpdir/views/js" \
  "$tmpdir/views/css" \
  "$tmpdir/views/img" \
  "$tmpdir/_dev/apps" \
  "$tmpdir/_dev/packages"
cp "$contract" "$tmpdir/tests/runtime-network-contract.sh"
chmod +x "$tmpdir/tests/runtime-network-contract.sh"

if output=$("$tmpdir/tests/runtime-network-contract.sh" 2>&1); then
  printf 'runtime network contract self-test RED: accepted missing scan inputs\n' >&2
  exit 1
fi

if [[ "$output" != *'scan could not be completed'* ]]; then
  printf 'runtime network contract self-test failed: missing inputs were rejected for the wrong reason\n' >&2
  printf '%s\n' "$output" >&2
  exit 1
fi

printf 'runtime network contract self-test passed\n'
