#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
module=psxmarketingwithgoogle
release_label=2.0.0-tinylux
output=${1:-"$root/dist/$module-v$release_label.zip"}
node_image='node@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0'
composer_image='composer@sha256:b09bccd91a78fe8a9ab4b33d707b862e8fe54fec17782e32683ad2a69c46867d'
archive_image='python@sha256:519591d6871b7bc437060736b9f7456b8731f1499a57e22e6c285135ae657bf7'
pnpm_version=8.15.9
node_corepack_dir=${TMPDIR:-/tmp}/psxmarketing-node20-corepack
node_store_dir=${TMPDIR:-/tmp}/psxmarketing-node20-store
composer_cache_dir=${TMPDIR:-/tmp}/psxmarketing-composer-cache

fail() {
  printf 'package build failed: %s\n' "$1" >&2
  exit 1
}

require_tool() {
  command -v "$1" >/dev/null 2>&1 || fail "required tool is unavailable: $1"
}

validate_image() {
  local label=$1
  local image=$2
  [[ "$image" =~ ^[a-z0-9./_-]+@sha256:[0-9a-f]{64}$ ]] \
    || fail "$label image is not pinned by immutable SHA-256 digest"
  docker image inspect "$image" >/dev/null 2>&1 \
    || fail "$label image is not present locally: $image"
}

for tool in \
  docker git tar sha256sum python3 rg php mktemp dirname basename mkdir id find grep rm cat
do
  require_tool "$tool"
done
[[ "$pnpm_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] \
  || fail 'pnpm version is not an exact semantic version'
validate_image 'Node' "$node_image"
validate_image 'Composer' "$composer_image"
validate_image 'archive writer' "$archive_image"

stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT

if [[ "$output" != /* ]]; then
  output="$root/$output"
fi
output_dir=$(dirname "$output")
output_name=$(basename "$output")
[[ "$output_name" == *.zip ]] || fail 'output path must end in .zip'

cd "$root"
git merge-base --is-ancestor v1.75.6 HEAD \
  || fail 'HEAD does not descend from the supported v1.75.6 release'
release_epoch=$(git show -s --format=%ct HEAD)
[[ "$release_epoch" =~ ^[0-9]+$ ]] || fail 'HEAD commit timestamp is invalid'

mkdir -p \
  "$node_corepack_dir" \
  "$node_store_dir" \
  "$composer_cache_dir" \
  "$output_dir" \
  "$stage/$module"
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
  "$node_image" \
  sh -lc "corepack prepare pnpm@$pnpm_version --activate && corepack pnpm --dir _dev --store-dir /pnpm/store install --frozen-lockfile && corepack pnpm --dir _dev -r build"

docker run --rm \
  --user "$(id -u):$(id -g)" \
  --entrypoint /bin/sh \
  -e COMPOSER_CACHE_DIR=/composer-cache \
  -e COMPOSER_ROOT_VERSION=2.0.0 \
  -v "$stage/$module:/workspace" \
  -v "$composer_cache_dir:/composer-cache" \
  -w /workspace \
  "$composer_image" \
  -lc 'composer install --no-interaction --prefer-dist --optimize-autoloader && vendor/bin/autoindex --no-interaction && composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --classmap-authoritative'

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
  \( -name '.env*' -o -name '*.map' -o -name '*.log' \
     -o -iname '*client_secret*.json' -o -iname '*credential*.json' \
     -o -iname '*oauth*client*.json' -o -iname '*.pem' -o -iname '*.key' \
     -o -iname '*.p12' -o -iname '*.pfx' \) \
  -delete

find "$stage/$module/vendor" -depth -type d \
  \( -iname test -o -iname tests -o -iname doc -o -iname docs \
     -o -iname example -o -iname examples -o -iname bench -o -iname benches \
     -o -iname benchmark -o -iname benchmarks -o -name '.github' \
     -o -name '.circleci' -o -name '.gitlab' -o -name '.travis' \
     -o -name '.buildkite' -o -name '.teamcity' \) \
  -exec rm -rf -- {} +
find "$stage/$module/vendor" -type f \
  \( -iname 'README*' -o -iname 'CHANGELOG*' -o -iname 'CONTRIBUTING*' \
     -o -iname 'phpunit*.xml' -o -iname 'phpunit*.xml.dist' \
     -o -iname 'infection.json' -o -iname 'infection.json.dist' \
     -o -iname 'phpstan*.neon' -o -iname 'phpstan*.neon.dist' \
     -o -iname 'psalm*.xml' -o -iname 'psalm*.xml.dist' \
     -o -iname 'phpcs*.xml' -o -iname 'phpcs*.xml.dist' \
     -o -iname 'phpmd*.xml' -o -iname 'phpmd*.xml.dist' \
     -o -iname 'behat.yml' -o -iname 'behat.yml.dist' \
     -o -iname 'behat.yaml' -o -iname 'behat.yaml.dist' \
     -o -iname 'phpspec.yml' -o -iname 'phpspec.yml.dist' \
     -o -iname 'phpspec.yaml' -o -iname 'phpspec.yaml.dist' \
     -o -iname 'phpbench.json' -o -iname 'phpbench.json.dist' \
     -o -iname 'phpbench.xml' -o -iname 'phpbench.xml.dist' \
     -o -iname 'grumphp.yml' -o -iname 'grumphp.yaml' \
     -o -iname '.travis.yml' -o -iname '.travis.yaml' \
     -o -iname '.gitlab-ci.yml' -o -iname '.gitlab-ci.yaml' \
     -o -iname '.coveralls.yml' -o -iname '.coveralls.yaml' \
     -o -iname '.scrutinizer.yml' -o -iname '.scrutinizer.yaml' \
     -o -iname 'codecov.yml' -o -iname 'codecov.yaml' \
     -o -iname 'appveyor.yml' -o -iname 'appveyor.yaml' \
     -o -iname 'azure-pipelines.yml' -o -iname 'azure-pipelines.yaml' \
     -o -iname 'bitbucket-pipelines.yml' -o -iname 'bitbucket-pipelines.yaml' \
     -o -iname '.php-cs-fixer.php' -o -iname '.php-cs-fixer.dist.php' \
     -o -iname 'rector.php' -o -iname 'pest.php' \
     -o -name '.gitignore' -o -name '.gitattributes' \) \
  -delete

for development_vendor_root in \
  bin doctrine friendsofphp myclabs nikic phar-io php-cs-fixer \
  phpstan phpunit psr sebastian squizlabs theseer
do
  development_vendor_path="$stage/$module/vendor/$development_vendor_root"
  [[ -d "$development_vendor_path" ]] || continue
  non_index_file=$(find "$development_vendor_path" -type f ! -name index.php -print -quit) \
    || fail "cannot inspect development vendor remnant: $development_vendor_root"
  unsafe_entry=$(find "$development_vendor_path" ! -type d ! -type f -print -quit) \
    || fail "cannot inspect development vendor entry types: $development_vendor_root"
  [[ -z "$non_index_file" && -z "$unsafe_entry" ]] \
    || fail "refusing to prune non-placeholder vendor tree: $development_vendor_root"
  rm -rf "$development_vendor_path"
done

rm -f "$stage/$module/composer.json" "$stage/$module/composer.lock"

for required in \
  vendor/autoload.php \
  views/js/app.js \
  views/js/vendor.js \
  views/js/psxmarketingwithgoogle-ui.js \
  views/js/fetchVerificationTag.js \
  views/js/fetchWarningMessage.js \
  controllers/admin/AdminTinyLuxGoogleApiController.php \
  controllers/front/oauth.php \
  controllers/front/cron.php \
  upgrade/upgrade-2.0.0.php
do
  [[ -f "$stage/$module/$required" ]] || fail "staging runtime file is missing: $required"
done

if find "$stage/$module" -type l -print -quit | grep -q .; then
  fail 'staging tree contains a symbolic link'
fi

rm -f "$output" "$output.sha256"
docker run --rm -i \
  --user "$(id -u):$(id -g)" \
  --entrypoint python3 \
  -v "$stage:/input:ro" \
  -v "$output_dir:/output" \
  "$archive_image" \
  - "$module" "/output/$output_name" "$release_epoch" <<'PY'
import os
import pathlib
import sys
import time
import zipfile

module = sys.argv[1]
output = pathlib.Path(sys.argv[2])
epoch = int(sys.argv[3])
input_root = pathlib.Path("/input")
module_root = input_root / module
temporary_output = output.with_name(f".{output.name}.tmp")

timestamp = list(time.gmtime(epoch)[:6])
if timestamp[0] < 1980:
    raise SystemExit("release timestamp predates the ZIP format")
timestamp[5] -= timestamp[5] % 2
zip_timestamp = tuple(timestamp)

paths = [module_root, *sorted(
    module_root.rglob("*"),
    key=lambda path: path.relative_to(input_root).as_posix(),
)]
with zipfile.ZipFile(
    temporary_output,
    mode="w",
    compression=zipfile.ZIP_DEFLATED,
    compresslevel=9,
    strict_timestamps=True,
) as package:
    for path in paths:
        if path.is_symlink():
            raise SystemExit("staging tree contains a symbolic link")
        archive_name = path.relative_to(input_root).as_posix()
        if path.is_dir():
            archive_name += "/"
            mode = 0o040755
            body = b""
        elif path.is_file():
            mode = 0o100644
            body = path.read_bytes()
        else:
            raise SystemExit("staging tree contains a non-regular filesystem entry")

        info = zipfile.ZipInfo(archive_name, date_time=zip_timestamp)
        info.create_system = 3
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = mode << 16
        package.writestr(info, body, compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)

os.replace(temporary_output, output)
PY

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
