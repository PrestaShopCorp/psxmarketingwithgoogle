<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

function upgrade_module_2_0_0($module)
{
    unset($module);

    if (!(bool) include dirname(__DIR__) . '/sql/install.php') {
        return false;
    }

    $db = Db::getInstance();
    $jobTable = _DB_PREFIX_ . 'psxmarketingwithgoogle_sync_job';
    $itemTable = _DB_PREFIX_ . 'psxmarketingwithgoogle_sync_item';
    $columns = [
        [$jobTable, 'merchant_account', 'VARCHAR(64) NOT NULL DEFAULT \'\' AFTER `id_shop`'],
        [$jobTable, 'data_source', 'VARCHAR(128) NOT NULL DEFAULT \'\' AFTER `merchant_account`'],
        [$jobTable, 'id_lang', 'INT UNSIGNED NOT NULL DEFAULT 0 AFTER `data_source`'],
        [$jobTable, 'content_language', 'VARCHAR(35) NOT NULL DEFAULT \'\' AFTER `id_lang`'],
        [$jobTable, 'feed_label', 'VARCHAR(20) NOT NULL DEFAULT \'\' AFTER `content_language`'],
        [$jobTable, 'full_sync', 'TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `feed_label`'],
        [$itemTable, 'claim_token', 'CHAR(32) NULL AFTER `attempts`'],
        [$itemTable, 'next_attempt_at', 'DATETIME NULL AFTER `claim_token`'],
    ];

    foreach ($columns as $column) {
        if (!psxmgUpgrade200ColumnExists($db, $column[0], $column[1])
            && !$db->execute(
                'ALTER TABLE `' . bqSQL($column[0]) . '` ADD COLUMN `' . bqSQL($column[1]) . '` ' . $column[2]
            )) {
            return false;
        }
    }

    if (!$db->execute(
        'UPDATE `' . bqSQL($itemTable) . '`'
        . ' SET next_attempt_at = COALESCE(next_attempt_at, updated_at)'
        . " WHERE status = 'pending' AND next_attempt_at IS NULL"
    )) {
        return false;
    }

    $indexes = [
        [$jobTable, 'idx_psxmg_sync_job_oldest', '(`id_shop`, `status`, `created_at`, `id_job`)'],
        [$itemTable, 'idx_psxmg_sync_item_eligible', '(`id_job`, `status`, `next_attempt_at`, `id_item`)'],
        [$itemTable, 'idx_psxmg_sync_item_claim', '(`id_job`, `claim_token`)'],
    ];
    foreach ($indexes as $index) {
        if (!psxmgUpgrade200IndexExists($db, $index[0], $index[1])
            && !$db->execute(
                'ALTER TABLE `' . bqSQL($index[0]) . '` ADD INDEX `' . bqSQL($index[1]) . '` ' . $index[2]
            )) {
            return false;
        }
    }

    return true;
}

function psxmgUpgrade200ColumnExists($db, $table, $column)
{
    return 0 < (int) $db->getValue(
        'SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS'
        . ' WHERE TABLE_SCHEMA = DATABASE()'
        . " AND TABLE_NAME = '" . pSQL($table) . "'"
        . " AND COLUMN_NAME = '" . pSQL($column) . "'"
    );
}

function psxmgUpgrade200IndexExists($db, $table, $index)
{
    return 0 < (int) $db->getValue(
        'SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS'
        . ' WHERE TABLE_SCHEMA = DATABASE()'
        . " AND TABLE_NAME = '" . pSQL($table) . "'"
        . " AND INDEX_NAME = '" . pSQL($index) . "'"
    );
}
