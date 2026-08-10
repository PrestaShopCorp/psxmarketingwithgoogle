#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
module=psxmarketingwithgoogle
release_label=2.0.0-tinylux
output=${1:-"$root/dist/$module-v$release_label.zip"}
stage=$(mktemp -d)
node_corepack_dir=${TMPDIR:-/tmp}/psxmarketing-node20-corepack
node_store_dir=${TMPDIR:-/tmp}/psxmarketing-node20-store
composer_cache_dir=${TMPDIR:-/tmp}/psxmarketing-composer-cache
trap 'rm -rf "$stage"' EXIT

if [[ "$output" != /* ]]; then
  output="$root/$output"
fi

cd "$root"
git merge-base --is-ancestor v1.75.6 HEAD

mkdir -p "$node_corepack_dir" "$node_store_dir" "$composer_cache_dir" "$(dirname "$output")"
mkdir -p "$stage/$module"
git archive --format=tar HEAD | tar -x -C "$stage/$module"

docker run --rm \
  --user "$(id -u):$(id -g)" \
  -e CI=1 \
  -e COREPACK_HOME=/corepack \
  -e VUE_APP_BUILD_VERSION="v$release_label" \
  -v "$stage/$module:/workspace" \
  -v "$node_corepack_dir:/corepack" \
  -v "$node_store_dir:/pnpm/store" \
  -w /workspace \
  node:20-bookworm-slim \
  sh -lc 'corepack prepare pnpm@8.15.9 --activate && corepack pnpm --dir _dev --store-dir /pnpm/store install --frozen-lockfile && corepack pnpm --dir _dev -r build'

env COMPOSER_CACHE_DIR="$composer_cache_dir" \
  composer install --no-interaction --prefer-dist --optimize-autoloader

for excluded in \
  _dev tests docs scripts dist attachments node_modules .git .github .superpowers e2e-env
do
  rm -rf "$stage/$module/$excluded"
done
rm -f \
  "$stage/$module/Makefile" \
  "$stage/$module/README.md" \
  "$stage/$module/crowdin.yml" \
  "$stage/$module/.editorconfig" \
  "$stage/$module/.gitignore" \
  "$stage/$module/.php-cs-fixer.dist.php" \
  "$stage/$module/composer.phar"
find "$stage/$module" -type f \
  \( -name '.env' -o -name '.env.*' -o -name '*.map' -o -name '*.log' \
     -o -iname 'client_secret*.json' -o -iname 'credentials*.json' \) \
  -delete

env COMPOSER_CACHE_DIR="$composer_cache_dir" \
  composer --working-dir="$stage/$module" install \
    --no-dev --no-interaction --prefer-dist \
    --optimize-autoloader --classmap-authoritative

find "$stage/$module/vendor" -depth -type d \
  \( -iname test -o -iname tests -o -iname doc -o -iname docs \
     -o -iname example -o -iname examples -o -name '.github' \) \
  -exec rm -rf -- {} +
find "$stage/$module/vendor" -type f \
  \( -iname 'README*' -o -iname 'CHANGELOG*' -o -iname 'CONTRIBUTING*' \) \
  -delete

(
  cd "$stage/$module"
  "$root/vendor/bin/autoindex" --no-interaction
)
rm -f "$stage/$module/composer.json" "$stage/$module/composer.lock"

test -f "$stage/$module/vendor/autoload.php"
test -f "$stage/$module/views/js/app.js"
test -f "$stage/$module/views/js/vendor.js"
test -f "$stage/$module/views/js/psxmarketingwithgoogle-ui.js"
test -f "$stage/$module/views/js/fetchVerificationTag.js"
test -f "$stage/$module/views/js/fetchWarningMessage.js"
test -f "$stage/$module/controllers/admin/AdminTinyLuxGoogleApiController.php"
test -f "$stage/$module/controllers/front/oauth.php"
test -f "$stage/$module/controllers/front/cron.php"
test -f "$stage/$module/upgrade/upgrade-2.0.0.php"

if find "$stage/$module" -type l -print -quit | grep -q .; then
  printf 'package build failed: staging tree contains a symbolic link\n' >&2
  exit 1
fi

release_date=$(git show -s --format=%cI HEAD)
rm -f "$output" "$output.sha256"
jar --create --file "$output" --no-manifest --date="$release_date" \
  -C "$stage" "$module"

checksum_target="$output"
if [[ "$output" == "$root/"* ]]; then
  checksum_target=${output#"$root/"}
fi
(
  cd "$root"
  sha256sum "$checksum_target" > "$output.sha256"
)

"$root/tests/package-ready-contract.sh" "$output"
(
  cd "$root"
  sha256sum -c "$output.sha256"
)
printf 'ready package: %s\n' "$output"
cat "$output.sha256"
