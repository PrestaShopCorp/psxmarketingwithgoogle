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

namespace ProductFilter\Options;

use PHPUnit\Framework\TestCase;
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\FeatureOptionsProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\AttributesRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;

class FeatureOptionsProviderTest extends TestCase
{
    public function testTransformRawDataToValidOptionsLanguage1()
    {
        $stubAttributeRepository = $this->createStub(AttributesRepository::class);
        $stubLanguageRepository = $this->createStub(LanguageRepository::class);

        $languages = [1 => 'fr', 2 => 'en'];

        $stubAttributeRepository->method('getFeaturesWithLocalizedValues')
            ->willReturn($this->getInputData());

        $stubLanguageRepository->method('getIsoById')
            ->willReturnCallback(function ($id) use ($languages) {
                return $languages[$id];
            });

        $provider = new FeatureOptionsProvider(
            $stubAttributeRepository,
            $stubLanguageRepository,
            1
        );
        $result = $provider->getOptions();
        $this->assertSame(
            [
                [
                    'id' => '1',
                    'key' => 'Composition',
                    'values' => [
                        [
                            'id' => '1',
                            'key' => 'Composition',
                            'value' => 'Polyester',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '1',
                            'key' => 'Compositions',
                            'value' => 'Polyester',
                            'language' => 'en',
                        ],
                        [
                            'id' => '4',
                            'key' => 'Composition',
                            'value' => 'Coton',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '4',
                            'key' => 'Compositions',
                            'value' => 'Cotton',
                            'language' => 'en',
                        ],
                        [
                            'id' => '5',
                            'key' => 'Composition',
                            'value' => 'Carton recyclé',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '5',
                            'key' => 'Compositions',
                            'value' => 'Recycled cardboard',
                            'language' => 'en',
                        ],
                        [
                            'id' => '6',
                            'key' => 'Composition',
                            'value' => 'Papier mat',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '6',
                            'key' => 'Compositions',
                            'value' => 'Papier mat',
                            'language' => 'en',
                        ],
                    ],
                ],
                [
                    'id' => '2',
                    'key' => 'Propriété',
                    'values' => [
                        [
                            'id' => '7',
                            'key' => 'Propriété',
                            'value' => 'Manches longues',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '7',
                            'key' => 'Property',
                            'value' => 'Manches longues',
                            'language' => 'en',
                        ],
                        [
                            'id' => '8',
                            'key' => 'Propriété',
                            'value' => 'Manches courtes',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '8',
                            'key' => 'Property',
                            'value' => 'Short Sleeve',
                            'language' => 'en',
                        ],
                        [
                            'id' => '9',
                            'key' => 'Propriété',
                            'value' => 'Housse amovible',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '9',
                            'key' => 'Property',
                            'value' => 'Housse amovible',
                            'language' => 'en',
                        ],
                        [
                            'id' => '10',
                            'key' => 'Propriété',
                            'value' => '120 pages',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '10',
                            'key' => 'Property',
                            'value' => '120 pages',
                            'language' => 'en',
                        ],
                    ],
                ],
            ],
            $result
        );
    }

    public function testTransformRawDataToValidOptionsLanguage2()
    {
        $stubAttributeRepository = $this->createStub(AttributesRepository::class);
        $stubLanguageRepository = $this->createStub(LanguageRepository::class);

        $languages = [1 => 'fr', 2 => 'en'];

        $stubAttributeRepository->method('getFeaturesWithLocalizedValues')
            ->willReturn($this->getInputData());

        $stubLanguageRepository->method('getIsoById')
            ->willReturnCallback(function ($id) use ($languages) {
                return $languages[$id];
            });

        $provider = new FeatureOptionsProvider(
            $stubAttributeRepository,
            $stubLanguageRepository,
            2
        );
        $result = $provider->getOptions();
        $this->assertSame(
            [
                [
                    'id' => '1',
                    'key' => 'Compositions',
                    'values' => [
                        [
                            'id' => '1',
                            'key' => 'Composition',
                            'value' => 'Polyester',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '1',
                            'key' => 'Compositions',
                            'value' => 'Polyester',
                            'language' => 'en',
                        ],
                        [
                            'id' => '4',
                            'key' => 'Composition',
                            'value' => 'Coton',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '4',
                            'key' => 'Compositions',
                            'value' => 'Cotton',
                            'language' => 'en',
                        ],
                        [
                            'id' => '5',
                            'key' => 'Composition',
                            'value' => 'Carton recyclé',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '5',
                            'key' => 'Compositions',
                            'value' => 'Recycled cardboard',
                            'language' => 'en',
                        ],
                        [
                            'id' => '6',
                            'key' => 'Composition',
                            'value' => 'Papier mat',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '6',
                            'key' => 'Compositions',
                            'value' => 'Papier mat',
                            'language' => 'en',
                        ],
                    ],
                ],
                [
                    'id' => '2',
                    'key' => 'Property',
                    'values' => [
                        [
                            'id' => '7',
                            'key' => 'Propriété',
                            'value' => 'Manches longues',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '7',
                            'key' => 'Property',
                            'value' => 'Manches longues',
                            'language' => 'en',
                        ],
                        [
                            'id' => '8',
                            'key' => 'Propriété',
                            'value' => 'Manches courtes',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '8',
                            'key' => 'Property',
                            'value' => 'Short Sleeve',
                            'language' => 'en',
                        ],
                        [
                            'id' => '9',
                            'key' => 'Propriété',
                            'value' => 'Housse amovible',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '9',
                            'key' => 'Property',
                            'value' => 'Housse amovible',
                            'language' => 'en',
                        ],
                        [
                            'id' => '10',
                            'key' => 'Propriété',
                            'value' => '120 pages',
                            'language' => 'fr',
                        ],
                        [
                            'id' => '10',
                            'key' => 'Property',
                            'value' => '120 pages',
                            'language' => 'en',
                        ],
                    ],
                ],
            ],
            $result
        );
    }

    private function getInputData(): array
    {
        return [
            [
                'id_feature' => '1',
                'id_lang' => '1',
                'feature_name' => 'Composition',
                'id_feature_value' => '1',
                'value' => 'Polyester',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '2',
                'feature_name' => 'Compositions',
                'id_feature_value' => '1',
                'value' => 'Polyester',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '1',
                'feature_name' => 'Composition',
                'id_feature_value' => '4',
                'value' => 'Coton',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '2',
                'feature_name' => 'Compositions',
                'id_feature_value' => '4',
                'value' => 'Cotton',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '1',
                'feature_name' => 'Composition',
                'id_feature_value' => '5',
                'value' => 'Carton recyclé',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '2',
                'feature_name' => 'Compositions',
                'id_feature_value' => '5',
                'value' => 'Recycled cardboard',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '1',
                'feature_name' => 'Composition',
                'id_feature_value' => '6',
                'value' => 'Papier mat',
            ],
            [
                'id_feature' => '1',
                'id_lang' => '2',
                'feature_name' => 'Compositions',
                'id_feature_value' => '6',
                'value' => 'Papier mat',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '1',
                'feature_name' => 'Propriété',
                'id_feature_value' => '7',
                'value' => 'Manches longues',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '2',
                'feature_name' => 'Property',
                'id_feature_value' => '7',
                'value' => 'Manches longues',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '1',
                'feature_name' => 'Propriété',
                'id_feature_value' => '8',
                'value' => 'Manches courtes',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '2',
                'feature_name' => 'Property',
                'id_feature_value' => '8',
                'value' => 'Short Sleeve',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '1',
                'feature_name' => 'Propriété',
                'id_feature_value' => '9',
                'value' => 'Housse amovible',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '2',
                'feature_name' => 'Property',
                'id_feature_value' => '9',
                'value' => 'Housse amovible',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '1',
                'feature_name' => 'Propriété',
                'id_feature_value' => '10',
                'value' => '120 pages',
            ],
            [
                'id_feature' => '2',
                'id_lang' => '2',
                'feature_name' => 'Property',
                'id_feature_value' => '10',
                'value' => '120 pages',
            ],
        ];
    }
}
