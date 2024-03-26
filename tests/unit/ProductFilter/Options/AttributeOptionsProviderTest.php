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
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\AttributeOptionsProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\AttributesRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;

class AttributeOptionsProviderTest extends TestCase
{
    public function testTransformRawDataToValidOptions()
    {
        $stubAttributeRepository = $this->createStub(AttributesRepository::class);
        $stubLanguageRepository = $this->createStub(LanguageRepository::class);

        $stubAttributeRepository->method('getCustomAttributesWithValues')
            ->willReturn($this->getInputData());
        $stubLanguageRepository->method('getIsoById')
            ->will($this->onConsecutiveCalls('fr', 'en_gb', 'fr', 'en_gb', 'fr', 'en_gb', 'fr', 'en_gb'));

        $provider = new AttributeOptionsProvider(
            $stubAttributeRepository,
            $stubLanguageRepository
        );
        $result = $provider->getOptions();
        $this->assertSame(
            [
                [
                    'reference' => '2',
                    'key' => 'Form',
                    'values' => [
                        ['value' => 'Classique', 'language' => 'fr'],
                        ['value' => 'Classic', 'language' => 'en_gb'],
                        ['value' => 'Chromatique', 'language' => 'fr'],
                        ['value' => 'Shiny', 'language' => 'en_gb'],
                    ],
                ],
                [
                    'reference' => '1',
                    'key' => 'Gender',
                    'values' => [
                        ['value' => 'Femmes', 'language' => 'fr'],
                        ['value' => 'Women', 'language' => 'en_gb'],
                        ['value' => 'Hommes', 'language' => 'fr'],
                        ['value' => 'Men', 'language' => 'en_gb'],
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
              'id_attribute_group' => '2',
              'id_lang' => '1',
              'name' => 'Classique',
              'attribute_group' => 'Form',
            ],
            [
              'id_attribute_group' => '2',
              'id_lang' => '3',
              'name' => 'Classic',
              'attribute_group' => 'Form',
            ],
            [
              'id_attribute_group' => '2',
              'id_lang' => '1',
              'name' => 'Chromatique',
              'attribute_group' => 'Form',
            ],
            [
              'id_attribute_group' => '2',
              'id_lang' => '3',
              'name' => 'Shiny',
              'attribute_group' => 'Form',
            ],
            [
              'id_attribute_group' => '1',
              'id_lang' => '1',
              'name' => 'Femmes',
              'attribute_group' => 'Gender',
            ],
            [
              'id_attribute_group' => '1',
              'id_lang' => '3',
              'name' => 'Women',
              'attribute_group' => 'Gender',
            ],
            [
              'id_attribute_group' => '1',
              'id_lang' => '1',
              'name' => 'Hommes',
              'attribute_group' => 'Gender',
            ],
            [
              'id_attribute_group' => '1',
              'id_lang' => '3',
              'name' => 'Men',
              'attribute_group' => 'Gender',
            ],
        ];
    }
}
