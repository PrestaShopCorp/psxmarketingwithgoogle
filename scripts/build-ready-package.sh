#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
module=psxmarketingwithgoogle
version=1.75.6
output=${1:-"$root/dist/$module-v$version-ready.zip"}
stage=$(mktemp -d)
node_corepack_dir=${TMPDIR:-/tmp}/psxmarketing-node20-corepack
node_store_dir=${TMPDIR:-/tmp}/psxmarketing-node20-store
composer_cache_dir=${TMPDIR:-/tmp}/psxmarketing-composer-cache
trap 'rm -rf "$stage"' EXIT

cd "$root"
git merge-base --is-ancestor v1.75.6 HEAD

mkdir -p "$node_corepack_dir" "$node_store_dir" "$composer_cache_dir"
docker run --rm \
  --user "$(id -u):$(id -g)" \
  -e COREPACK_HOME=/corepack \
  -e VUE_APP_BUILD_VERSION=v1.75.6 \
  -v "$root:/workspace" \
  -v "$node_corepack_dir:/corepack" \
  -v "$node_store_dir:/pnpm/store" \
  -w /workspace \
  node:20-bookworm-slim \
  sh -lc 'corepack prepare pnpm@8.15.9 --activate && corepack pnpm --dir _dev --store-dir /pnpm/store install --frozen-lockfile && corepack pnpm --dir _dev -r build'

env COMPOSER_CACHE_DIR="$composer_cache_dir" \
  composer install --no-interaction --prefer-dist --optimize-autoloader

mkdir -p "$stage/$module" "$(dirname "$output")"
rsync -a ./ "$stage/$module/" \
  --exclude '/.git/' \
  --exclude '/.env' \
  --exclude '/.env.*' \
  --exclude '/_dev/' \
  --exclude '/tests/' \
  --exclude '/docs/superpowers/' \
  --exclude '/scripts/' \
  --exclude '/dist/' \
  --exclude '/node_modules/' \
  --exclude '/composer.phar' \
  --exclude '/Makefile' \
  --exclude '*.map' \
  --exclude '/.php-cs-fixer.dist.php' \
  --exclude '/.editorconfig' \
  --exclude '/.github/' \
  --exclude '/.gitignore' \
  --exclude '/crowdin.yml' \
  --exclude '/e2e-env/'

(
  cd "$stage/$module"
  vendor/bin/autoindex
)

env COMPOSER_CACHE_DIR="$composer_cache_dir" \
  composer --working-dir="$stage/$module" install \
    --no-dev --no-interaction --prefer-dist \
    --optimize-autoloader --classmap-authoritative
rm -f "$stage/$module/composer.json" "$stage/$module/composer.lock"

test -f "$stage/$module/vendor/autoload.php"
test -f "$stage/$module/views/js/app.js"
test -f "$stage/$module/views/js/psxmarketingwithgoogle-ui.js"
test -f "$stage/$module/views/js/fetchVerificationTag.js"
test -f "$stage/$module/views/js/fetchWarningMessage.js"

rm -f "$output" "$output.sha256"
(
  cd "$stage"
  python3 -m zipfile -c "$output" "$module"
)
sha256sum "$output" > "$output.sha256"
"$root/tests/package-ready-contract.sh" "$output"
printf 'ready package: %s\n' "$output"
cat "$output.sha256"
