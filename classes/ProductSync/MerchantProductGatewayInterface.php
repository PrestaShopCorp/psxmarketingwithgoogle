<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductSync;

interface MerchantProductGatewayInterface
{
    /** @return array<int, array<string, mixed>> */
    public function listDataSources(string $accessToken, string $accountId): array;

    /** @param array<string, mixed> $payload
     * @return array<string, mixed>
     */
    public function insertProductInput(
        string $accessToken,
        string $accountId,
        string $dataSourceName,
        array $payload
    ): array;
}
