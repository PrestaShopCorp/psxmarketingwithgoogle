<?php

declare(strict_types=1);

use PrestaShop\Module\PsxMarketingWithGoogle\ProductSync\SyncJobRepository;

require_once dirname(__DIR__) . '/bootstrap.php';

$mode = $argv[1] ?? '';
$schema = $argv[2] ?? '';
$jobId = $argv[3] ?? '';
$itemId = $argv[4] ?? '';
$coordinationDirectory = $argv[5] ?? '';
if (!in_array($mode, ['recount', 'complete'], true)
    || 1 !== preg_match('/^psxmg_task7_fix_[a-z0-9_]+$/D', $schema)
    || 1 !== preg_match('/^[1-9][0-9]*$/D', $jobId)
    || 1 !== preg_match('/^[1-9][0-9]*$/D', $itemId)
    || 0 !== strpos($coordinationDirectory, sys_get_temp_dir() . '/psxmg-task7-concurrency-')
    || !is_dir($coordinationDirectory)
) {
    exit(2);
}

$jobId = (int) $jobId;
$itemId = (int) $itemId;

try {
    $connection = new DbPDO(_DB_SERVER_, _DB_USER_, _DB_PASSWD_, $schema);
    if ('recount' === $mode) {
        $database = new SyncJobConcurrencyPausingDatabase($connection, static function () use ($coordinationDirectory): void {
            touch($coordinationDirectory . '/aggregated');
            $deadline = microtime(true) + 10;
            while (!is_file($coordinationDirectory . '/release') && microtime(true) < $deadline) {
                usleep(10000);
            }
            if (!is_file($coordinationDirectory . '/release')) {
                throw new RuntimeException('Concurrency coordination timed out.');
            }
        });
        (new SyncJobRepository($database, _DB_PREFIX_))->recount(7, $jobId);
    } else {
        touch($coordinationDirectory . '/completion-started');
        $repository = new SyncJobRepository($connection, _DB_PREFIX_);
        $repository->recordSuccess(7, $jobId, $itemId);
        $repository->recount(7, $jobId);
        touch($coordinationDirectory . '/completion-finished');
    }
} catch (Throwable $exception) {
    unset($exception);
    fwrite(STDERR, 'worker_failure');
    exit(1);
}

exit(0);

final class SyncJobConcurrencyPausingDatabase
{
    /** @var DbPDO */
    private $db;

    /** @var callable|null */
    private $afterAggregate;

    public function __construct(DbPDO $db, callable $afterAggregate)
    {
        $this->db = $db;
        $this->afterAggregate = $afterAggregate;
    }

    public function execute(string $statement): bool
    {
        return $this->db->execute($statement);
    }

    /** @return mixed */
    public function executeS(string $statement)
    {
        return $this->db->executeS($statement);
    }

    /** @return mixed */
    public function getRow(string $statement)
    {
        $row = $this->db->getRow($statement);
        if (false !== strpos($statement, 'COUNT(*) AS total') && null !== $this->afterAggregate) {
            $callback = $this->afterAggregate;
            $this->afterAggregate = null;
            $callback();
        }

        return $row;
    }

    /** @return mixed */
    public function getValue(string $statement)
    {
        return $this->db->getValue($statement);
    }

    /** @param array<string, mixed> $data */
    public function insert(string $table, array $data): bool
    {
        return $this->db->insert($table, $data);
    }

    public function Insert_ID(): int
    {
        return (int) $this->db->Insert_ID();
    }

    public function Affected_Rows(): int
    {
        return (int) $this->db->Affected_Rows();
    }

    public function escape(string $value): string
    {
        return (string) $this->db->escape($value);
    }

    public function getNumberError(): int
    {
        return (int) $this->db->getNumberError();
    }

    public function getMsgError(): string
    {
        return (string) $this->db->getMsgError();
    }
}
