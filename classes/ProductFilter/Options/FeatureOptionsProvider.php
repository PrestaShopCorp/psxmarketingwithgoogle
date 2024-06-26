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

namespace PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options;

use PrestaShop\Module\PsxMarketingWithGoogle\Repository\AttributesRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;

class FeatureOptionsProvider implements OptionsProviderInterface
{
    /**
     * @var AttributesRepository
     */
    protected $attributeRepository;

    /**
     * @var LanguageRepository
     */
    protected $languageRepository;

    /**
     * @var int
     */
    private $currentLanguageId;

    public function __construct(
        AttributesRepository $attributeRepository,
        LanguageRepository $languageRepository,
        int $currentLanguageId
    ) {
        $this->attributeRepository = $attributeRepository;
        $this->languageRepository = $languageRepository;
        $this->currentLanguageId = $currentLanguageId;
    }

    public function getOptions(): array
    {
        $rawData = $this->attributeRepository->getFeaturesWithLocalizedValues();

        $options = [];
        foreach ($rawData as $rawAttribute) {
            if (!isset($options[$rawAttribute['id_feature']])) {
                $options[$rawAttribute['id_feature']] = [
                    'id' => $rawAttribute['id_feature'],
                    'key' => $rawAttribute['feature_name'],
                    'values' => [],
                ];
            }

            if ($this->currentLanguageId === (int) $rawAttribute['id_lang']) {
                $options[$rawAttribute['id_feature']]['key'] = $rawAttribute['feature_name'];
            }

            $options[$rawAttribute['id_feature']]['values'][] = [
                'id' => $rawAttribute['id_feature_value'],
                // Repeat key to ease the creation of payload when value is selected
                'key' => $rawAttribute['feature_name'],
                'value' => $rawAttribute['value'],
                'language' => $this->languageRepository->getIsoById($rawAttribute['id_lang']),
            ];
        }

        return array_values($options);
    }
}
