#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
forbidden='googleshopping-api\.psessentials\.net|api\.cloudsync\.prestashop\.com|api\.addons\.prestashop\.com|addons\.prestashop\.com|billing-api\.distribution(?:-preprod)?\.prestashop\.net|billing\.distribution\.prestashop\.net|storage\.googleapis\.com/psessentials-documentation|assets\.prestashop3\.com|integration-assets\.prestashop3\.com|psxmarketing-cdn|segment\.com|ingest\.sentry\.io|billing-cdc|prestashop-accounts|fonts\.googleapis\.com|fonts\.gstatic\.com'
forbidden_built_artifacts='\[GGL\] Understand CMP requirement|ps_eventbus|PrestaShop CloudSync|PrestaShop account|Billing information'
forbidden_runtime_dependencies='@prestashopcorp/billing-cdc|prestashop-accounts|psaccounts|ps_accounts|pseventbus|ps_eventbus|cloudsync|BillingAdapter|USE_BILLING_SANDBOX|psxmarketingwithgoogle\.billing_env|@segment/analytics-next|@sentry/(browser|tracing|vue)'

scan_paths=(
  "$root/classes"
  "$root/config"
  "$root/controllers"
  "$root/psxmarketingwithgoogle.php"
  "$root/_dev/apps/ui/src/views/help-page.vue"
  "$root/_dev/apps/ui/src/components/help/card-faq.vue"
  "$root/_dev/apps/ui/src/components/enhanced-conversions/alert-sign-gads-tos.vue"
  "$root/views/templates/admin/app.tpl"
  "$root/views/js"
)

runtime_source_paths=(
  "$root/classes"
  "$root/config"
  "$root/controllers"
  "$root/psxmarketingwithgoogle.php"
  "$root/views/templates"
  "$root/_dev/apps/ui/src"
  "$root/_dev/apps/verification-tag/src"
  "$root/_dev/apps/warning-messages/src"
)

dependency_paths=(
  "$root/_dev/apps/ui/package.json"
  "$root/_dev/apps/verification-tag/package.json"
  "$root/_dev/apps/warning-messages/package.json"
  "$root/_dev/pnpm-lock.yaml"
)

failed=0

if rg -n -o -i "$forbidden" "${scan_paths[@]}"; then
  printf 'runtime network contract failed\n' >&2
  failed=1
fi

if rg --no-ignore -n -o -i "$forbidden_built_artifacts" "$root/views/js"; then
  printf 'runtime branding artifact contract failed\n' >&2
  failed=1
fi

if rg -n -o -i "$forbidden_runtime_dependencies|$forbidden" "${runtime_source_paths[@]}" \
  --glob '!**/*.spec.ts' --glob '!**/*.stories.ts'; then
  printf 'runtime dependency source contract failed\n' >&2
  failed=1
fi

if rg -n -o -i "$forbidden_runtime_dependencies" "${dependency_paths[@]}"; then
  printf 'runtime dependency manifest/lock contract failed\n' >&2
  failed=1
fi

if rg --no-ignore -n -o -i "$forbidden_runtime_dependencies|$forbidden" "$root/views/js"; then
  printf 'runtime dependency built-asset contract failed\n' >&2
  failed=1
fi

eventbus_bootstrap='ps_eventbus|checkModulePsEventbusNeedUpgrade|modulePsEventbusNeedUpgrade|cloudsyncVersionNeeded|VITE_MIN_VERSION_NEEDED_CLOUD_SYNC'
eventbus_paths=(
  "$root/_dev/apps/ui/src/App.vue"
  "$root/_dev/apps/ui/src/store/modules/app/getters.ts"
  "$root/_dev/apps/ui/src/store/modules/app/state.ts"
)

if rg -n "$eventbus_bootstrap" "${eventbus_paths[@]}"; then
  printf 'runtime Eventbus bootstrap contract failed\n' >&2
  failed=1
fi

if ((failed)); then
  exit 1
fi
printf 'runtime network contract passed\n'
