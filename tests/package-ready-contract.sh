#!/usr/bin/env bash
set -euo pipefail

archive=${1:?usage: tests/package-ready-contract.sh path/to/archive.zip}
module=psxmarketingwithgoogle
expected_version=2.0.0

fail() {
  printf 'package contract failed: %s\n' "$1" >&2
  exit 1
}

[[ -f "$archive" ]] || fail "archive is missing: $archive"

entries=$(unzip -Z1 "$archive") || fail 'archive directory cannot be read'
[[ -n "$entries" ]] || fail 'archive is empty'

if printf '%s\n' "$entries" | grep -Eq '(^/|(^|/)\.\.(/|$)|\\)'; then
  fail 'archive contains an unsafe path'
fi
if printf '%s\n' "$entries" | grep -Ev "^${module}/"; then
  fail "archive must have one ${module}/ root"
fi
if [[ -n "$(printf '%s\n' "$entries" | LC_ALL=C sort | uniq -d)" ]]; then
  fail 'archive contains duplicate entries'
fi
if zipinfo -l "$archive" | awk '$1 ~ /^l/ { found = 1 } END { exit found ? 0 : 1 }'; then
  fail 'archive contains a symbolic link'
fi

for required in \
  "$module/psxmarketingwithgoogle.php" \
  "$module/config.xml" \
  "$module/vendor/autoload.php" \
  "$module/views/js/app.js" \
  "$module/views/js/vendor.js" \
  "$module/views/js/psxmarketingwithgoogle-ui.js" \
  "$module/views/js/translations/en.js" \
  "$module/views/js/fetchVerificationTag.js" \
  "$module/views/js/fetchWarningMessage.js" \
  "$module/controllers/admin/AdminTinyLuxGoogleApiController.php" \
  "$module/controllers/front/oauth.php" \
  "$module/controllers/front/cron.php" \
  "$module/classes/Api/LocalGoogleApi.php" \
  "$module/classes/OAuth/GoogleConnectionService.php" \
  "$module/classes/Merchant/MerchantApiClient.php" \
  "$module/classes/ProductSync/SyncProcessor.php" \
  "$module/sql/install.php" \
  "$module/sql/uninstall.php" \
  "$module/upgrade/upgrade-2.0.0.php"
do
  grep -Fxq "$required" <<<"$entries" || fail "missing runtime file: $required"
done

if grep -E \
  "^${module}/(_dev|scripts|dist|attachments|node_modules|\.superpowers|e2e-env)(/|$)|^${module}/(Makefile|composer\.(json|lock|phar)|crowdin\.yml|\.editorconfig|\.php-cs-fixer.*)(/|$)|(^|/)(tests?|docs?|examples?|\.git|\.github)(/|$)|(^|/)(README[^/]*|CHANGELOG[^/]*|CONTRIBUTING[^/]*)(/|$)|(^|/)(\.env($|\.)|[^/]*\.map$|[^/]*\.log$|client_secret[^/]*\.json$|credentials?[^/]*\.json$)" \
  <<<"$entries"
then
  fail 'archive contains source, development, log, or credential material'
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
unzip -q "$archive" -d "$tmpdir" || fail 'archive cannot be extracted'

credential_pattern='client_secret_[0-9]|"client_secret"[[:space:]]*:[[:space:]]*"[^"[:space:]][^"]*"|oauth2\.googleusercontent\.com.{0,256}client_secret|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----'
forbidden_host_pattern='googleshopping-api\.psessentials\.net|api\.cloudsync\.prestashop\.com|cloudsync\.prestashop\.com|api\.addons\.prestashop\.com|billing-api\.distribution(?:-preprod)?\.prestashop\.net|billing\.distribution\.prestashop\.net|storage\.googleapis\.com/psessentials-documentation|assets\.prestashop3\.com|integration-assets\.prestashop3\.com|psxmarketing-cdn|segment\.(com|io)|sentry\.io|sentry-cdn\.com|fonts\.googleapis\.com|fonts\.gstatic\.com'
forbidden_runtime_pattern='PrestaShop account|Billing information|PrestaShop CloudSync|PS Marketing with Google|@prestashopcorp/billing-cdc|prestashop-accounts|ps_accounts|ps_eventbus|@segment/analytics-next|@sentry/(browser|tracing|vue)'

if rg --no-messages -a -l -i "$credential_pattern|$forbidden_host_pattern" "$tmpdir/$module" >/dev/null; then
  fail 'archive contains a credential or forbidden runtime host'
fi

runtime_paths=(
  "$tmpdir/$module/classes"
  "$tmpdir/$module/config"
  "$tmpdir/$module/controllers"
  "$tmpdir/$module/sql"
  "$tmpdir/$module/upgrade"
  "$tmpdir/$module/views"
  "$tmpdir/$module/psxmarketingwithgoogle.php"
)
if rg --no-messages -a -l -i "$forbidden_runtime_pattern" "${runtime_paths[@]}" >/dev/null; then
  fail 'archive contains removed branding, package, or telemetry runtime'
fi

php -r "require '$tmpdir/$module/vendor/autoload.php';" \
  || fail 'Composer production autoloader cannot be loaded'

printf 'package contract passed: %s (%s)\n' "$archive" "$expected_version"
