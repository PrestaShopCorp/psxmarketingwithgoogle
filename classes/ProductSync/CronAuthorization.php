<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

declare(strict_types=1);

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

use InvalidArgumentException;
use Throwable;

final class CronAuthorization
{
    private const DEFAULT_LIMIT = 25;
    private const MAX_LIMIT = 25;
    private const MAX_TOKEN_BYTES = 512;

    /** @var mixed */
    private $tokenResolver;

    /** @var callable */
    private $comparator;

    /** @param mixed $tokenResolver */
    public function __construct($tokenResolver, ?callable $comparator = null)
    {
        if (!is_callable($tokenResolver)
            && (!is_object($tokenResolver) || !method_exists($tokenResolver, 'find'))
        ) {
            throw new InvalidArgumentException('Cron token resolver is unavailable.');
        }
        $this->tokenResolver = $tokenResolver;
        $this->comparator = $comparator ?? 'hash_equals';
    }

    /**
     * @param array<string, mixed> $query
     *
     * @return array{shop: int, limit: int}
     */
    public function authorize(array $query): array
    {
        $shop = $this->positiveInteger($query['shop'] ?? null);
        $limit = array_key_exists('limit', $query)
            ? $this->positiveInteger($query['limit'])
            : self::DEFAULT_LIMIT;
        $providedToken = $query['token'] ?? null;

        if (null === $shop || null === $limit || !$this->isValidToken($providedToken)) {
            throw new CronAuthorizationException();
        }

        try {
            $knownToken = $this->resolveKnownToken($shop);
            $authorized = $this->isValidToken($knownToken)
                && ($this->comparator)($knownToken, $providedToken);
        } catch (Throwable $exception) {
            unset($exception);
            $authorized = false;
        }

        if (!$authorized) {
            throw new CronAuthorizationException();
        }

        return [
            'shop' => $shop,
            'limit' => min(self::MAX_LIMIT, $limit),
        ];
    }

    private function resolveKnownToken(int $shopId): ?string
    {
        if (is_callable($this->tokenResolver)) {
            $token = ($this->tokenResolver)($shopId);

            return is_string($token) ? $token : null;
        }

        /** @var mixed $row */
        $row = $this->tokenResolver->find($shopId);

        return is_array($row) && is_string($row['cron_token'] ?? null)
            ? $row['cron_token']
            : null;
    }

    /** @param mixed $value */
    private function positiveInteger($value): ?int
    {
        if (!is_string($value) || 1 !== preg_match('/^[1-9][0-9]*$/D', $value)) {
            return null;
        }

        $integer = (int) $value;

        return 0 < $integer && (string) $integer === $value ? $integer : null;
    }

    /** @param mixed $token */
    private function isValidToken($token): bool
    {
        return is_string($token)
            && '' !== $token
            && self::MAX_TOKEN_BYTES >= strlen($token)
            && 1 === preg_match('/^[\x21-\x7E]+$/D', $token);
    }
}
