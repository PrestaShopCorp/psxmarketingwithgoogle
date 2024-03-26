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
use PrestaShop\Module\PsxMarketingWithGoogle\ProductFilter\Options\CategoryOptionsProvider;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CategoryRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\LanguageRepository;
use stdClass;

class CategoryOptionsProviderTest extends TestCase
{
    public function testTransformRawDataToValidOptions()
    {
        $stubCategoryRepository = $this->createStub(CategoryRepository::class);
        $stubLanguageRepository = $this->createStub(LanguageRepository::class);

        $stubCategoryRepository->method('getCategoriesList')
            ->willReturn($this->getInputData());

        $provider = new CategoryOptionsProvider(
            $stubCategoryRepository,
            $stubLanguageRepository
        );
        $result = $provider->getOptions();
        $this->assertSame(
            [
                [
                    'reference' => '834',
                    'value' => 'Feu',
                ],
                [
                    'reference' => '845',
                    'value' => 'Livres',
                ],
            ],
            $result
        );
    }

    private function getInputData(): array
    {
        return [
          $this->generateCategory('834', 'Feu'),
          $this->generateCategory('845', 'Livres'),
        ];
    }

    private function generateCategory(string $id, string $name): stdClass
    {
        $class = new stdClass();
        $class->id = $id;
        $class->id_category = $id;
        $class->name = $name;

        return $class;
    }
}
