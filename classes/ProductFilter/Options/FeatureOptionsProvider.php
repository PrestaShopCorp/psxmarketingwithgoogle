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

    public function __construct(
        AttributesRepository $attributeRepository,
        LanguageRepository $languageRepository
    ) {
        $this->attributeRepository = $attributeRepository;
        $this->languageRepository = $languageRepository;
    }

    public function getOptions(): array
    {
        $rawData = $this->attributeRepository->getFeaturesWithLocalizedValues();

        $options = [];
        foreach ($rawData as $rawAttribute) {
            // find existing attribute group to modify it...
            foreach ($options as &$option) {
                if ($option['id'] === $rawAttribute['id_feature']) {
                    $option['values'][] = [
                        'key' => $rawAttribute['feature_name'],
                        'value' => $rawAttribute['value'],
                        'language' => $this->languageRepository->getIsoById($rawAttribute['id_lang']),
                    ];
                    continue 2;
                }
            }

            // ... or push a new one
            $options[] = [
                'id' => $rawAttribute['id_feature'],
                'key' => $rawAttribute['feature_name'],
                'values' => [
                    [
                        // Repeat key to ease the creation of payload when value is selected
                        'key' => $rawAttribute['feature_name'],
                        'value' => $rawAttribute['value'],
                        'language' => $this->languageRepository->getIsoById($rawAttribute['id_lang']),
                    ],
                ],
            ];
        }

        return $options;
    }
}
