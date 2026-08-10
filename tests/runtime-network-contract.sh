#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)
forbidden='googleshopping-api\.psessentials\.net|api\.cloudsync\.prestashop\.com|assets\.prestashop3\.com|integration-assets\.prestashop3\.com|psxmarketing-cdn|segment\.com|ingest\.sentry\.io|billing-cdc|prestashop-accounts|fonts\.googleapis\.com|fonts\.gstatic\.com'

scan_paths=(
  "$root/classes"
  "$root/config"
  "$root/controllers"
  "$root/psxmarketingwithgoogle.php"
  "$root/views/templates/admin/app.tpl"
  "$root/views/js"
)

if rg -n -i "$forbidden" "${scan_paths[@]}"; then
  printf 'runtime network contract failed\n' >&2
  exit 1
fi
printf 'runtime network contract passed\n'
