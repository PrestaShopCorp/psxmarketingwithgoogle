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
    $installer = new PrestaShop\Module\PsxMarketingWithGoogle\Database\Installer(
        $module,
        $module->getService(PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler::class)
    );
    if (!$installer->installTabs()) {
        return false;
    }

    if (!psxmgUpgrade200RegisterHooks(
        $module,
        PrestaShop\Module\PsxMarketingWithGoogle\Config\Config::HOOK_LIST
    )) {
        return false;
    }

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

    $invalidSnapshot = "(j.merchant_account NOT REGEXP '^[0-9]{1,20}$'"
        . " OR j.data_source NOT REGEXP '^accounts/[0-9]{1,20}/dataSources/[0-9]{1,20}$'"
        . " OR SUBSTRING_INDEX(SUBSTRING_INDEX(j.data_source, '/', 2), '/', -1) <> j.merchant_account"
        . ' OR j.id_lang = 0'
        . " OR j.content_language NOT REGEXP '^[a-z]{2}$'"
        . " OR j.feed_label NOT REGEXP '^[A-Z0-9_-]{1,20}$'"
        . ' OR j.full_sync <> 1)';

    if (!$db->execute(
        'UPDATE `' . bqSQL($itemTable) . '` i'
        . ' INNER JOIN `' . bqSQL($jobTable) . '` j ON j.id_job = i.id_job'
        . " SET i.status = 'failed', i.claim_token = NULL, i.next_attempt_at = NULL,"
        . " i.error_code = 'legacy_snapshot_invalid', i.error_field = NULL,"
        . " i.error_message = 'Synchronization stopped because the saved routing snapshot is invalid.',"
        . ' i.updated_at = UTC_TIMESTAMP()'
        . " WHERE j.status IN ('pending', 'running')"
        . ' AND ' . $invalidSnapshot
        . " AND i.status IN ('pending', 'running')"
    )) {
        return false;
    }

    if (!$db->execute(
        'UPDATE `' . bqSQL($jobTable) . '` j'
        . ' LEFT JOIN ('
        . ' SELECT id_job, COUNT(*) AS total,'
        . " COALESCE(SUM(status = 'success'), 0) AS succeeded,"
        . " COALESCE(SUM(status = 'failed'), 0) AS failed,"
        . " COALESCE(SUM(status = 'skipped'), 0) AS skipped"
        . ' FROM `' . bqSQL($itemTable) . '` GROUP BY id_job'
        . ' ) counts ON counts.id_job = j.id_job'
        . ' SET j.total = COALESCE(counts.total, 0),'
        . ' j.succeeded = COALESCE(counts.succeeded, 0),'
        . ' j.failed = COALESCE(counts.failed, 0),'
        . ' j.skipped = COALESCE(counts.skipped, 0),'
        . ' j.status = CASE'
        . " WHEN COALESCE(counts.failed, 0) = 0 THEN 'completed'"
        . " WHEN counts.failed = counts.total - counts.skipped THEN 'failed'"
        . " ELSE 'partial' END,"
        . ' j.finished_at = COALESCE(j.finished_at, UTC_TIMESTAMP())'
        . " WHERE j.status IN ('pending', 'running')"
        . ' AND ' . $invalidSnapshot
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

function psxmgUpgrade200RegisterHooks($module, array $hooks)
{
    foreach ($hooks as $hook) {
        if ($module->isRegisteredInHook($hook)) {
            continue;
        }

        if (!$module->registerHook($hook)) {
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
