<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */
$sql = [
    'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'psxmarketingwithgoogle_connection` (
        `id_shop` INT UNSIGNED NOT NULL,
        `client_id` VARCHAR(255) NOT NULL,
        `client_secret` LONGTEXT NOT NULL,
        `refresh_token` LONGTEXT NULL,
        `google_email` VARCHAR(255) NULL,
        `merchant_account` VARCHAR(64) NULL,
        `data_source` VARCHAR(128) NULL,
        `cron_token` LONGTEXT NOT NULL,
        `created_at` DATETIME NOT NULL,
        `updated_at` DATETIME NOT NULL,
        PRIMARY KEY (`id_shop`)
    ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8mb4;',
    'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'psxmarketingwithgoogle_oauth_state` (
        `state_hash` CHAR(64) NOT NULL,
        `id_shop` INT UNSIGNED NOT NULL,
        `id_employee` INT UNSIGNED NOT NULL,
        `expires_at` DATETIME NOT NULL,
        `consumed_at` DATETIME NULL,
        PRIMARY KEY (`state_hash`),
        INDEX `idx_psxmg_oauth_shop_expiry` (`id_shop`, `expires_at`)
    ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8mb4;',
    'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'psxmarketingwithgoogle_sync_job` (
        `id_job` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        `id_shop` INT UNSIGNED NOT NULL,
        `status` ENUM(\'pending\',\'running\',\'completed\',\'partial\',\'failed\') NOT NULL,
        `total` INT UNSIGNED NOT NULL DEFAULT 0,
        `succeeded` INT UNSIGNED NOT NULL DEFAULT 0,
        `failed` INT UNSIGNED NOT NULL DEFAULT 0,
        `skipped` INT UNSIGNED NOT NULL DEFAULT 0,
        `created_at` DATETIME NOT NULL,
        `started_at` DATETIME NULL,
        `finished_at` DATETIME NULL,
        PRIMARY KEY (`id_job`),
        INDEX `idx_psxmg_sync_job_shop_status` (`id_shop`, `status`)
    ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8mb4;',
    'CREATE TABLE IF NOT EXISTS `' . _DB_PREFIX_ . 'psxmarketingwithgoogle_sync_item` (
        `id_item` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        `id_job` BIGINT UNSIGNED NOT NULL,
        `offer_key` VARCHAR(191) NOT NULL,
        `status` ENUM(\'pending\',\'running\',\'success\',\'failed\',\'skipped\') NOT NULL,
        `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
        `error_code` VARCHAR(64) NULL,
        `error_field` VARCHAR(191) NULL,
        `error_message` VARCHAR(500) NULL,
        `updated_at` DATETIME NOT NULL,
        PRIMARY KEY (`id_item`),
        UNIQUE KEY `uniq_psxmg_sync_item_job_offer` (`id_job`, `offer_key`),
        INDEX `idx_psxmg_sync_item_job_status` (`id_job`, `status`)
    ) ENGINE=' . _MYSQL_ENGINE_ . ' DEFAULT CHARSET=utf8mb4;',
];

foreach ($sql as $query) {
    if (Db::getInstance()->execute($query) == false) {
        return false;
    }
}

return true;
