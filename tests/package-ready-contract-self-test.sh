#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
contract="$root/tests/package-ready-contract.sh"
base_archive=${1:-"$root/dist/psxmarketingwithgoogle-v2.0.0-tinylux.zip"}
tmpdir=$(mktemp -d)
failures=0
trap 'rm -rf "$tmpdir"' EXIT

[[ -f "$base_archive" ]] || {
  printf 'contract self-test failed: base archive is missing: %s\n' "$base_archive" >&2
  exit 1
}

expect_rejection() {
  local label=$1
  shift

  if "$@" >/dev/null 2>&1; then
    printf 'contract self-test RED: accepted %s\n' "$label" >&2
    failures=$((failures + 1))
  else
    printf 'contract self-test rejected: %s\n' "$label"
  fi
}

python3 - "$base_archive" "$tmpdir" <<'PY'
import pathlib
import sys
import zipfile

source = pathlib.Path(sys.argv[1])
destination = pathlib.Path(sys.argv[2])
module = "psxmarketingwithgoogle"
clean_source = destination / "clean-base.zip"
legacy_orphan_roots = {
    "bin", "doctrine", "friendsofphp", "myclabs", "nikic", "phar-io", "php-cs-fixer",
    "phpstan", "phpunit", "psr", "sebastian", "squizlabs", "theseer",
}


with zipfile.ZipFile(source, "r") as incoming, zipfile.ZipFile(clean_source, "w") as outgoing:
    for info in incoming.infolist():
        entry_name = info.orig_filename
        if entry_name in {
            f"{module}/vendor/brick/phonenumber/phpunit.xml",
            f"{module}/vendor/giggsey/locale/infection.json.dist",
            f"{module}/vendor/giggsey/libphonenumber-for-php/.php-cs-fixer.dist.php",
        }:
            continue
        entry_parts = entry_name.split("/")
        if len(entry_parts) > 2 and entry_parts[1] == "vendor" and entry_parts[2] in legacy_orphan_roots:
            continue
        if entry_parts[-1].casefold() in {".gitignore", ".gitattributes"}:
            continue
        outgoing.writestr(info, incoming.read(info))


def rewrite(name, *, replacement=None, added=None):
    target = destination / f"{name}.zip"
    with zipfile.ZipFile(clean_source, "r") as incoming, zipfile.ZipFile(target, "w") as outgoing:
        for info in incoming.infolist():
            body = incoming.read(info)
            if replacement and info.orig_filename == replacement[0]:
                body = replacement[1](body)
            outgoing.writestr(info, body)
        if added:
            entry_name, body = added
            outgoing.writestr(entry_name, body)


rewrite(
    "normalized-collision",
    added=(f"{module}/views/JS/app.js", b"collision"),
)
rewrite(
    "case-variant-root",
    added=(f"PSXMARKETINGWITHGOOGLE/extra.txt", b"second root"),
)
rewrite(
    "wrong-config-identity",
    replacement=(
        f"{module}/config.xml",
        lambda body: body.replace(
            b"<name>psxmarketingwithgoogle</name>",
            b"<name>wrongmodule</name>",
        ),
    ),
)
rewrite(
    "wrong-main-identity",
    replacement=(
        f"{module}/psxmarketingwithgoogle.php",
        lambda body: body.replace(
            b"$this->name = 'psxmarketingwithgoogle';",
            b"$this->name = 'wrongmodule';",
        ),
    ),
)
rewrite(
    "plaintext-token",
    added=(
        f"{module}/views/runtime-state.txt",
        b'{"refresh_token":"1//real-refresh-token-material"}',
    ),
)
rewrite(
    "plaintext-unquoted-token",
    added=(
        f"{module}/views/runtime-state.txt",
        b"cron_token=realCronTokenMaterial_0123456789abcdef",
    ),
)
rewrite(
    "credential-filename",
    added=(
        f"{module}/views/google-oauth-credentials.json",
        b'{"client_secret":"placeholder"}',
    ),
)
rewrite(
    "empty-path-segment",
    added=(f"{module}/views//unsafe.txt", b"unsafe"),
)
rewrite(
    "dot-env-prefix",
    added=(f"{module}/.envrc", b"SECRET=release-material"),
)

vendor_metadata = {
    "vendor-phpunit-xml": "phpunit.xml",
    "vendor-phpunit-xml-dist": "phpunit.xml.dist",
    "vendor-infection-json": "infection.json",
    "vendor-infection-json-dist": "infection.json.dist",
    "vendor-travis": ".travis.yml",
    "vendor-circleci": ".circleci/config.yml",
    "vendor-gitlab-directory": ".gitlab/ci.yml",
    "vendor-gitlab-ci": ".gitlab-ci.yml",
    "vendor-phpstan-neon": "phpstan.neon",
    "vendor-phpstan-neon-dist": "phpstan.neon.dist",
    "vendor-psalm-xml": "psalm.xml",
    "vendor-psalm-xml-dist": "psalm.xml.dist",
    "vendor-php-cs-fixer": ".php-cs-fixer.dist.php",
    "vendor-behat": "behat.yml.dist",
    "vendor-phpspec": "phpspec.yml",
    "vendor-phpbench": "phpbench.json.dist",
    "vendor-benchmarks-directory": "benchmarks/bootstrap.php",
    "vendor-buildkite": ".buildkite/pipeline.yml",
    "vendor-appveyor": "appveyor.yml",
    "vendor-coveralls": ".coveralls.yml",
    "vendor-codecov": "codecov.yml",
}
for fixture_name, metadata_path in vendor_metadata.items():
    rewrite(
        fixture_name,
        added=(f"{module}/vendor/brick/phonenumber/{metadata_path}", b"development metadata"),
    )
rewrite(
    "vendor-orphan-phpunit",
    added=(f"{module}/vendor/phpunit/index.php", b"<?php exit;"),
)
rewrite(
    "vendor-orphan-phpstan",
    added=(f"{module}/vendor/phpstan/index.php", b"<?php exit;"),
)
PY

if ! "$contract" "$tmpdir/clean-base.zip" >/dev/null; then
  printf 'contract self-test failed: rejected the known-good base archive\n' >&2
  exit 1
fi

expect_rejection 'Unicode/case normalized collision' \
  "$contract" "$tmpdir/normalized-collision.zip"
expect_rejection 'case-variant second root' \
  "$contract" "$tmpdir/case-variant-root.zip"
expect_rejection 'wrong config.xml module identity' \
  "$contract" "$tmpdir/wrong-config-identity.zip"
expect_rejection 'wrong main PHP module identity' \
  "$contract" "$tmpdir/wrong-main-identity.zip"
expect_rejection 'plaintext JSON token value' \
  "$contract" "$tmpdir/plaintext-token.zip"
expect_rejection 'plaintext unquoted cron token value' \
  "$contract" "$tmpdir/plaintext-unquoted-token.zip"
expect_rejection 'credential-like filename' \
  "$contract" "$tmpdir/credential-filename.zip"
expect_rejection 'empty ZIP path segment' \
  "$contract" "$tmpdir/empty-path-segment.zip"
expect_rejection '.env-prefixed file' \
  "$contract" "$tmpdir/dot-env-prefix.zip"

while IFS='|' read -r fixture label; do
  expect_rejection "$label" "$contract" "$tmpdir/$fixture.zip"
done <<'EOF'
vendor-phpunit-xml|nested vendor phpunit.xml
vendor-phpunit-xml-dist|nested vendor phpunit.xml.dist
vendor-infection-json|nested vendor infection.json
vendor-infection-json-dist|nested vendor infection.json.dist
vendor-travis|nested vendor .travis.yml
vendor-circleci|nested vendor .circleci config
vendor-gitlab-directory|nested vendor .gitlab config
vendor-gitlab-ci|nested vendor .gitlab-ci.yml
vendor-phpstan-neon|nested vendor phpstan.neon
vendor-phpstan-neon-dist|nested vendor phpstan.neon.dist
vendor-psalm-xml|nested vendor psalm.xml
vendor-psalm-xml-dist|nested vendor psalm.xml.dist
vendor-php-cs-fixer|nested vendor .php-cs-fixer.dist.php
vendor-behat|nested vendor Behat config
vendor-phpspec|nested vendor PHPSpec config
vendor-phpbench|nested vendor PHPBench config
vendor-benchmarks-directory|nested vendor benchmarks directory
vendor-buildkite|nested vendor Buildkite config
vendor-appveyor|nested vendor AppVeyor config
vendor-coveralls|nested vendor Coveralls config
vendor-codecov|nested vendor Codecov config
EOF
expect_rejection 'orphan vendor/phpunit autoindex remnant' \
  "$contract" "$tmpdir/vendor-orphan-phpunit.zip"
expect_rejection 'orphan vendor/phpstan autoindex remnant' \
  "$contract" "$tmpdir/vendor-orphan-phpstan.zip"

mkdir "$tmpdir/broken-rg" "$tmpdir/broken-python"
printf '#!/bin/sh\nexit 2\n' > "$tmpdir/broken-rg/rg"
printf '#!/bin/sh\nexit 2\n' > "$tmpdir/broken-python/python3"
chmod +x "$tmpdir/broken-rg/rg" "$tmpdir/broken-python/python3"

expect_rejection 'rg execution failure' \
  env PATH="$tmpdir/broken-rg:$PATH" "$contract" "$base_archive"
expect_rejection 'ZIP metadata inspector execution failure' \
  env PATH="$tmpdir/broken-python:$PATH" "$contract" "$base_archive"

if ((failures)); then
  printf 'contract self-test failed: %d malicious/error fixture(s) were accepted\n' \
    "$failures" >&2
  exit 1
fi

printf 'package contract self-test passed\n'
