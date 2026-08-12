#!/usr/bin/env bash
set -euo pipefail

archive=${1:?usage: tests/package-ready-contract.sh path/to/archive.zip}
module=psxmarketingwithgoogle
expected_version=2.0.1
expected_min_ps_version=8.2.7

fail() {
  printf 'package contract failed: %s\n' "$1" >&2
  exit 1
}

require_tool() {
  command -v "$1" >/dev/null 2>&1 || fail "required tool is unavailable: $1"
}

rg_assert_clean() {
  local label=$1
  local pattern=$2
  shift 2
  local status

  set +e
  rg --no-messages -a -l -i -e "$pattern" -- "$@" >/dev/null
  status=$?
  set -e

  case "$status" in
    0) fail "$label" ;;
    1) return 0 ;;
    *) fail "$label scan could not be completed (rg exit $status)" ;;
  esac
}

for tool in python3 rg php; do
  require_tool "$tool"
done
[[ -f "$archive" ]] || fail "archive is missing: $archive"

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

if ! python3 - "$archive" "$tmpdir" "$module" "$expected_version" "$expected_min_ps_version" <<'PY'
import pathlib
import re
import stat
import sys
import unicodedata
import xml.etree.ElementTree as ET
import zipfile

archive = pathlib.Path(sys.argv[1])
destination = pathlib.Path(sys.argv[2])
module = sys.argv[3]
expected_version = sys.argv[4]
expected_min_ps_version = sys.argv[5]


def reject(message):
    raise ValueError(message)


required = {
    f"{module}/psxmarketingwithgoogle.php",
    f"{module}/config.xml",
    f"{module}/vendor/autoload.php",
    f"{module}/vendor/composer/autoload_real.php",
    f"{module}/vendor/composer/installed.php",
    f"{module}/views/js/app.js",
    f"{module}/views/js/vendor.js",
    f"{module}/views/js/psxmarketingwithgoogle-ui.js",
    f"{module}/views/js/translations/en.js",
    f"{module}/views/js/fetchVerificationTag.js",
    f"{module}/views/js/fetchWarningMessage.js",
    f"{module}/controllers/admin/AdminTinyLuxGoogleApiController.php",
    f"{module}/controllers/front/oauth.php",
    f"{module}/controllers/front/cron.php",
    f"{module}/classes/Api/LocalGoogleApi.php",
    f"{module}/classes/OAuth/GoogleConnectionService.php",
    f"{module}/classes/Merchant/MerchantApiClient.php",
    f"{module}/classes/ProductSync/SyncProcessor.php",
    f"{module}/sql/install.php",
    f"{module}/sql/uninstall.php",
    f"{module}/upgrade/upgrade-2.0.0.php",
    f"{module}/upgrade/upgrade-2.0.1.php",
}
root_directories = {
    "_dev", "scripts", "dist", "attachments", "node_modules", ".superpowers", "e2e-env",
}
forbidden_segments = {
    "test", "tests", "doc", "docs", "example", "examples", "bench", "benches",
    "benchmark", "benchmarks", ".git", ".github", ".circleci", ".gitlab", ".travis",
    ".buildkite", ".teamcity",
}
forbidden_vendor_roots = {
    "bin", "doctrine", "friendsofphp", "myclabs", "nikic", "phar-io", "php-cs-fixer",
    "phpstan", "phpunit", "psr", "sebastian", "squizlabs", "theseer",
}
root_files = {
    "makefile", "composer.json", "composer.lock", "composer.phar", "crowdin.yml",
    ".editorconfig", ".gitignore", ".php-cs-fixer.dist.php",
}
credential_filename = re.compile(
    r"(?:client[_-]?secret|credentials?|oauth[_-]?(?:client|secret)).*\.json$|\.(?:pem|key|p12|pfx)$",
    re.IGNORECASE,
)
development_metadata_filename = re.compile(
    r'''(?ix)^(?:
      (?:phpunit|psalm|phpcs|phpmd)(?:[-._][a-z0-9_-]+)?\.xml(?:\.dist)?
      |phpstan(?:[-._][a-z0-9_-]+)?\.neon(?:\.dist)?
      |infection\.(?:json|json5)(?:\.dist)?
      |(?:behat|phpspec)\.(?:yml|yaml)(?:\.dist)?
      |phpbench\.(?:json|xml)(?:\.dist)?
      |(?:grumphp|codecov|appveyor|azure-pipelines|bitbucket-pipelines)\.(?:yml|yaml)
      |\.(?:travis|gitlab-ci|coveralls|scrutinizer)\.(?:yml|yaml)
      |\.php-cs-fixer(?:\.dist)?\.php
      |(?:rector|pest)\.php
      |\.gitignore|\.gitattributes
    )$''',
)
private_key = re.compile(br"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")
high_confidence_token = re.compile(
    br"(?:GOCSPX-[A-Za-z0-9_-]{16,}|ya29\.[A-Za-z0-9._~-]{12,}|1//[A-Za-z0-9._~-]{12,})"
)
assigned_secret = re.compile(
    r'''(?ix)
    (?P<key>client_secret|refresh_token|access_token|cron_token)
    ["']?\s*(?:=>|:|=)\s*
    (?P<quote>["'])(?P<value>[^"'\r\n]{1,8192})(?P=quote)
    ''',
)
unquoted_secret = re.compile(
    r'''(?ix)
    (?P<key>client_secret|refresh_token|access_token|cron_token)
    \s*(?:=>|:|=)\s*
    (?P<value>[A-Za-z0-9._~+/=-]{12,8192})
    ''',
)


def placeholder(key, value):
    normalized = value.strip().casefold()
    if normalized in {
        "null", "none", "undefined", "redacted", "[redacted]", "masked", "hidden",
        "placeholder", "example", "sample", "dummy", "fake", "secret", "token", "value",
        key.casefold(), key.replace("_", "-").casefold(), "***", "xxxxx",
    }:
        return True
    if any(marker in normalized for marker in ("${", "{{", "}}", "<", ">", "[your-", "[your_")):
        return True
    return normalized.startswith(("your-", "your_", "example-", "example_", "placeholder-", "placeholder_"))


def validate_path(info, raw_name, seen_raw, seen_normalized, roots):
    if not raw_name:
        reject("empty ZIP entry name")
    if any(ord(character) < 32 or ord(character) == 127 for character in raw_name):
        reject(f"control character in ZIP entry name: {raw_name!r}")
    if "\\" in raw_name or raw_name.startswith("/"):
        reject(f"non-portable ZIP entry name: {raw_name!r}")

    is_directory = raw_name.endswith("/")
    path_name = raw_name[:-1] if is_directory else raw_name
    parts = path_name.split("/")
    if not path_name or any(part in {"", ".", ".."} for part in parts):
        reject(f"unsafe ZIP path segment: {raw_name!r}")
    if parts[0] != module:
        reject(f"archive entry is outside the exact {module}/ root: {raw_name!r}")

    if raw_name in seen_raw:
        reject(f"duplicate raw ZIP entry: {raw_name!r}")
    seen_raw.add(raw_name)

    normalized_parts = [unicodedata.normalize("NFC", part).casefold() for part in parts]
    normalized_name = "/".join(normalized_parts)
    if normalized_name in seen_normalized:
        reject(f"Unicode/case-normalized ZIP collision: {raw_name!r}")
    seen_normalized.add(normalized_name)
    roots.add(parts[0])

    mode = (info.external_attr >> 16) & 0xFFFF
    entry_type = stat.S_IFMT(mode)
    if entry_type not in {0, stat.S_IFREG, stat.S_IFDIR}:
        reject(f"unsafe non-regular ZIP entry type: {raw_name!r}")
    if is_directory and entry_type == stat.S_IFREG:
        reject(f"directory name carries a regular-file mode: {raw_name!r}")
    if not is_directory and entry_type == stat.S_IFDIR:
        reject(f"file name carries a directory mode: {raw_name!r}")
    if info.flag_bits & 0x1:
        reject(f"encrypted ZIP entry is not permitted: {raw_name!r}")

    folded_basename = normalized_parts[-1]
    if len(normalized_parts) > 1 and normalized_parts[1] in root_directories:
        reject(f"source/development directory in archive: {raw_name!r}")
    if any(segment in forbidden_segments for segment in normalized_parts[1:]):
        reject(f"test/doc/VCS directory in archive: {raw_name!r}")
    if (len(normalized_parts) > 2
            and normalized_parts[1] == "vendor"
            and normalized_parts[2] in forbidden_vendor_roots):
        reject(f"development-only vendor remnant in archive: {raw_name!r}")
    if len(normalized_parts) == 2 and folded_basename in root_files:
        reject(f"source/development root file in archive: {raw_name!r}")
    if folded_basename.startswith(("readme", "changelog", "contributing")):
        reject(f"dependency/project documentation in archive: {raw_name!r}")
    if folded_basename.startswith(".env") or folded_basename.endswith((".map", ".log")):
        reject(f"environment, map, or log file in archive: {raw_name!r}")
    if credential_filename.search(folded_basename):
        reject(f"credential-like filename in archive: {raw_name!r}")
    if development_metadata_filename.fullmatch(folded_basename):
        reject(f"test/benchmark/CI metadata in archive: {raw_name!r}")


try:
    with zipfile.ZipFile(archive, "r") as package:
        infos = package.infolist()
        if not infos:
            reject("archive is empty")

        seen_raw = set()
        seen_normalized = set()
        roots = set()
        payloads = {}
        for info in infos:
            raw_name = info.orig_filename
            validate_path(info, raw_name, seen_raw, seen_normalized, roots)
            if not raw_name.endswith("/"):
                payloads[raw_name] = package.read(info)

        bad_crc = package.testzip()
        if bad_crc is not None:
            reject(f"CRC failure in ZIP entry: {bad_crc!r}")
        if roots != {module}:
            reject(f"archive must have exactly one {module}/ root")

        missing = sorted(required.difference(payloads))
        if missing:
            reject(f"missing runtime file: {missing[0]}")

        config_root = ET.fromstring(payloads[f"{module}/config.xml"])
        config_name = (config_root.findtext("name") or "").strip()
        config_version = (config_root.findtext("version") or "").strip()
        if config_name != module:
            reject(f"config.xml module name is not {module}")
        if config_version != expected_version:
            reject(f"config.xml version is not {expected_version}")

        main_php = payloads[f"{module}/psxmarketingwithgoogle.php"].decode("utf-8")
        main_names = [match[1] for match in re.findall(
            r"\$this->name\s*=\s*(['\"])([^'\"]+)\1\s*;", main_php
        )]
        main_versions = [match[1] for match in re.findall(
            r"\$this->version\s*=\s*(['\"])([^'\"]+)\1\s*;", main_php
        )]
        if main_names != [module]:
            reject(f"main module name is not exactly {module}")
        if main_versions != [expected_version]:
            reject(f"main module version is not exactly {expected_version}")

        minimum_versions = [match[1] for match in re.findall(
            r"\$this->ps_versions_compliancy\s*=\s*\[\s*['\"]min['\"]\s*=>\s*(['\"])([^'\"]+)\1",
            main_php,
        )]
        if minimum_versions != [expected_min_ps_version]:
            reject(f"main module minimum PrestaShop version is not {expected_min_ps_version}")

        upgrade_php = payloads[f"{module}/upgrade/upgrade-2.0.0.php"].decode("utf-8")
        if "installTabs()" not in upgrade_php or "unset($module)" in upgrade_php:
            reject("2.0.0 upgrade does not register newly introduced admin controllers")

        upgrade_201_php = payloads[f"{module}/upgrade/upgrade-2.0.1.php"].decode("utf-8")
        if "installTabs()" not in upgrade_201_php or "Config::HOOK_LIST" not in upgrade_201_php:
            reject("2.0.1 upgrade does not restore required tabs and hooks")

        ui_javascript = payloads[f"{module}/views/js/psxmarketingwithgoogle-ui.js"]
        if re.search(br'''url\((?:["']?)\.\./woff2/''', ui_javascript):
            reject("injected UI CSS contains document-relative font URLs")

        for entry_name, body in payloads.items():
            if private_key.search(body) or high_confidence_token.search(body):
                reject(f"plaintext credential material in archive entry: {entry_name!r}")
            text = body.decode("utf-8", errors="ignore")
            for match in assigned_secret.finditer(text):
                key = match.group("key")
                value = match.group("value")
                if not placeholder(key, value):
                    reject(f"non-placeholder {key} value in archive entry: {entry_name!r}")
            for match in unquoted_secret.finditer(text):
                key = match.group("key")
                value = match.group("value")
                if not placeholder(key, value):
                    reject(f"non-placeholder {key} value in archive entry: {entry_name!r}")

        package.extractall(destination)
except (ET.ParseError, UnicodeError, ValueError, zipfile.BadZipFile, OSError) as error:
    print(f"package archive inspection failed: {error}", file=sys.stderr)
    sys.exit(1)
PY
then
  fail 'archive metadata, identity, content, or extraction validation failed'
fi

forbidden_host_pattern='googleshopping-api\.psessentials\.net|api\.cloudsync\.prestashop\.com|cloudsync\.prestashop\.com|api\.addons\.prestashop\.com|billing-api\.distribution(?:-preprod)?\.prestashop\.net|billing\.distribution\.prestashop\.net|storage\.googleapis\.com/psessentials-documentation|assets\.prestashop3\.com|integration-assets\.prestashop3\.com|psxmarketing-cdn|segment\.(com|io)|sentry\.io|sentry-cdn\.com|fonts\.googleapis\.com|fonts\.gstatic\.com'
forbidden_runtime_pattern='PrestaShop account|Billing information|PrestaShop CloudSync|PS Marketing with Google|@prestashopcorp/billing-cdc|prestashop-accounts|ps_accounts|ps_eventbus|@segment/analytics-next|@sentry/(browser|tracing|vue)'

rg_assert_clean \
  'archive contains a forbidden runtime host' \
  "$forbidden_host_pattern" \
  "$tmpdir/$module"

runtime_paths=(
  "$tmpdir/$module/classes"
  "$tmpdir/$module/config"
  "$tmpdir/$module/controllers"
  "$tmpdir/$module/sql"
  "$tmpdir/$module/upgrade"
  "$tmpdir/$module/views"
  "$tmpdir/$module/psxmarketingwithgoogle.php"
)
rg_assert_clean \
  'archive contains removed branding, package, or telemetry runtime' \
  "$forbidden_runtime_pattern" \
  "${runtime_paths[@]}"

if ! php -r '
$loader = require $argv[1];
if (!is_object($loader)
    || !method_exists($loader, "isClassMapAuthoritative")
    || !$loader->isClassMapAuthoritative()) {
    fwrite(STDERR, "Composer autoloader is not classmap authoritative\n");
    exit(1);
}
$installed = require $argv[2];
if (($installed["root"]["dev"] ?? null) !== false) {
    fwrite(STDERR, "Composer root is marked as a development install\n");
    exit(1);
}
foreach (($installed["versions"] ?? []) as $name => $package) {
    if (($package["dev_requirement"] ?? false) !== false
        || preg_match("~(?:^|/)(?:phpunit|phpstan|php-cs-fixer|php-dev-tools)(?:$|/)~i", $name)
        || preg_match("~^(?:friendsofphp|squizlabs|mockery)/~i", $name)) {
        fwrite(STDERR, "Composer development package is installed\n");
        exit(1);
    }
}
' \
  "$tmpdir/$module/vendor/autoload.php" \
  "$tmpdir/$module/vendor/composer/installed.php"
then
  fail 'Composer production autoloader/package metadata validation failed'
fi

printf 'package contract passed: %s (%s)\n' "$archive" "$expected_version"
