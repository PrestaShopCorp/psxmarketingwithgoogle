<?php

$prestaShopRoot = getenv('PRESTASHOP_ROOT');
if (!is_string($prestaShopRoot) || '' === $prestaShopRoot) {
    $prestaShopRoot = __DIR__ . '/../../../../';
}

require_once rtrim($prestaShopRoot, '/') . '/config/config.inc.php';
require_once __DIR__ . '/../../vendor/autoload.php';
