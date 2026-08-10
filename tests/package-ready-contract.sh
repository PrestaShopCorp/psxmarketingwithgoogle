#!/usr/bin/env bash
set -euo pipefail

archive=${1:?usage: tests/package-ready-contract.sh path/to/archive.zip}
module=psxmarketingwithgoogle
expected_version=1.75.6

fail() {
  printf 'package contract failed: %s\n' "$1" >&2
  exit 1
}

[[ -f "$archive" ]] || fail "archive is missing: $archive"

entries=$(unzip -Z1 "$archive")
[[ -n "$entries" ]] || fail 'archive is empty'
if printf '%s\n' "$entries" | grep -Ev "^${module}/"; then
  fail "every entry must be below ${module}/"
fi

for required in \
  "$module/psxmarketingwithgoogle.php" \
  "$module/config.xml" \
  "$module/vendor/autoload.php" \
  "$module/views/js/app.js" \
  "$module/views/js/psxmarketingwithgoogle-ui.js" \
  "$module/views/js/fetchVerificationTag.js" \
  "$module/views/js/fetchWarningMessage.js"
do
  grep -Fxq "$required" <<<"$entries" || fail "missing runtime file: $required"
done

if grep -E \
  "^${module}/(_dev|tests|docs/superpowers|Makefile|composer\\.(json|lock|phar))(/|$)|(^|/)(\\.git|\\.env($|\\.)|node_modules)(/|$)|\\.map$" \
  <<<"$entries"
then
  fail 'archive contains development-only or sensitive content'
fi

config_version=$(unzip -p "$archive" "$module/config.xml" \
  | sed -n 's:.*<version><!\[CDATA\[\([^]]*\)\]\]></version>.*:\1:p')
[[ "$config_version" == "$expected_version" ]] \
  || fail "config.xml version is $config_version, expected $expected_version"

main_version=$(unzip -p "$archive" "$module/psxmarketingwithgoogle.php" \
  | sed -n "s/.*\$this->version = '\([^']*\)';.*/\1/p")
main_version=${main_version%%$'\n'*}
[[ "$main_version" == "$expected_version" ]] \
  || fail "module class version is $main_version, expected $expected_version"

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
unzip -q "$archive" -d "$tmpdir"
php -r "require '$tmpdir/$module/vendor/autoload.php';" \
  || fail 'Composer production autoloader cannot be loaded'

printf 'package contract passed: %s (%s)\n' "$archive" "$expected_version"
