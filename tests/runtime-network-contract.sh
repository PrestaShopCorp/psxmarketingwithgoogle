#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
forbidden='googleshopping-api\.psessentials\.net|api\.cloudsync\.prestashop\.com|api\.addons\.prestashop\.com|addons\.prestashop\.com|billing-api\.distribution(?:-preprod)?\.prestashop\.net|billing\.distribution\.prestashop\.net|storage\.googleapis\.com/psessentials-documentation|assets\.prestashop3\.com|integration-assets\.prestashop3\.com|psxmarketing-cdn|segment\.com|ingest\.sentry\.io|billing-cdc|prestashop-accounts|fonts\.googleapis\.com|fonts\.gstatic\.com'
forbidden_built_artifacts='\[GGL\] Understand CMP requirement|ps_eventbus|PrestaShop CloudSync|PrestaShop account|Billing information'
forbidden_runtime_dependencies='@prestashopcorp/billing-cdc|prestashop-accounts|psaccounts|ps_accounts|pseventbus|ps_eventbus|cloudsync|BillingAdapter|USE_BILLING_SANDBOX|psxmarketingwithgoogle\.billing_env|@segment/analytics-next|@sentry/(browser|tracing|vue)'
forbidden_telemetry_consumers='\$segment(?:\.|\b)|SegmentGenericParams|initReplay|(?:utils|lib)/Sentry|Sentry|\$sentry(?:\.|\b)'
forbidden_warning_branding='PS Marketing with Google|PrestaShop Marketing with Google'

mapfile -t production_php_paths < <(
  find "$root" \
    \( -path "$root/.git" -o -path "$root/.superpowers" -o -path "$root/_dev" \
      -o -path "$root/docs" -o -path "$root/tests" -o -path "$root/vendor" \) -prune \
    -o -type f -name '*.php' -print | sort
)

scan_paths=(
  "${production_php_paths[@]}"
  "$root/classes"
  "$root/config"
  "$root/controllers"
  "$root/sql"
  "$root/upgrade"
  "$root/psxmarketingwithgoogle.php"
  "$root/_dev/apps/ui/src/views/help-page.vue"
  "$root/_dev/apps/ui/src/components/help/card-faq.vue"
  "$root/_dev/apps/ui/src/components/enhanced-conversions/alert-sign-gads-tos.vue"
  "$root/views/templates/admin/app.tpl"
  "$root/views/js"
  "$root/views/css"
  "$root/views/img"
)

runtime_source_paths=(
  "${production_php_paths[@]}"
  "$root/classes"
  "$root/config"
  "$root/controllers"
  "$root/sql"
  "$root/upgrade"
  "$root/psxmarketingwithgoogle.php"
  "$root/views/templates"
  "$root/_dev/apps/ui/src"
  "$root/_dev/apps/verification-tag/src"
  "$root/_dev/apps/warning-messages/src"
  "$root/_dev/packages/mktg-with-google-common"
)

mapfile -t workspace_manifests < <(
  find "$root/_dev/apps" "$root/_dev/packages" -type f -name package.json \
    -not -path '*/node_modules/*' -print | sort
)

dependency_paths=(
  "$root/_dev/package.json"
  "$root/_dev/pnpm-lock.yaml"
  "${workspace_manifests[@]}"
)

built_asset_paths=(
  "$root/views/js"
  "$root/views/css"
  "$root/views/img"
)

telemetry_source_paths=(
  "$root/_dev/apps/ui/src"
  "$root/_dev/apps/verification-tag/src"
  "$root/_dev/apps/warning-messages/src"
)

mapfile -t warning_branding_paths < <(
  find "$root/_dev/packages/mktg-with-google-common/translations" \
    -type f -name warnings.json -print | sort
)
warning_branding_paths+=("$root/views/js/fetchWarningMessage.js")

failed=0

scan_forbidden() {
  local failure_message=$1
  local status
  shift

  if rg "$@"; then
    status=0
  else
    status=$?
  fi

  case "$status" in
    0)
      printf '%s\n' "$failure_message" >&2
      failed=1
      ;;
    1)
      ;;
    *)
      printf '%s: scan could not be completed (rg exit %s)\n' \
        "$failure_message" "$status" >&2
      failed=1
      ;;
  esac
}

scan_forbidden \
  'runtime network contract failed' \
  --no-ignore -n -o -i "$forbidden" "${scan_paths[@]}"

scan_forbidden \
  'runtime branding artifact contract failed' \
  --no-ignore -n -o -i "$forbidden_built_artifacts" "${built_asset_paths[@]}"

scan_forbidden \
  'runtime dependency source contract failed' \
  --no-ignore -n -o -i "$forbidden_runtime_dependencies|$forbidden" \
  "${runtime_source_paths[@]}" \
  --glob '!**/*.spec.ts' --glob '!**/*.stories.ts'

scan_forbidden \
  'runtime telemetry source contract failed' \
  --no-ignore -n -o "$forbidden_telemetry_consumers" \
  "${telemetry_source_paths[@]}" \
  --glob '!**/*.spec.ts' --glob '!**/*.stories.ts'

scan_forbidden \
  'runtime dependency manifest/lock contract failed' \
  --no-ignore -n -o -i "$forbidden_runtime_dependencies" "${dependency_paths[@]}"

scan_forbidden \
  'runtime dependency built-asset contract failed' \
  --no-ignore -n -o -i "$forbidden_runtime_dependencies|$forbidden" \
  "${built_asset_paths[@]}"

scan_forbidden \
  'runtime telemetry built-asset contract failed' \
  --no-ignore -n -o "$forbidden_telemetry_consumers" "${built_asset_paths[@]}"

scan_forbidden \
  'runtime warning branding contract failed' \
  --no-ignore -n -o "$forbidden_warning_branding" "${warning_branding_paths[@]}"

eventbus_bootstrap='ps_eventbus|checkModulePsEventbusNeedUpgrade|modulePsEventbusNeedUpgrade|cloudsyncVersionNeeded|VITE_MIN_VERSION_NEEDED_CLOUD_SYNC'
eventbus_paths=(
  "$root/_dev/apps/ui/src/App.vue"
  "$root/_dev/apps/ui/src/store/modules/app/getters.ts"
  "$root/_dev/apps/ui/src/store/modules/app/state.ts"
)

scan_forbidden \
  'runtime Eventbus bootstrap contract failed' \
  -n "$eventbus_bootstrap" "${eventbus_paths[@]}"

if ((failed)); then
  exit 1
fi
printf 'runtime network contract passed\n'
