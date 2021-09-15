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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Provider;

use Category;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\CategoryRepository;

class CategoryProvider
{
    /**
    * @var CategoryRepository
    */
    private $categoryRepository;

    public function __construct(
        CategoryRepository $CategoryRepository
    ) {
        $this->categoryRepository = $CategoryRepository;
    }

    public function getCategoryPaths($topCategoryId, $langId, $shopId)
    {
        if ((int) $topCategoryId === 0) {
            return [
                'category_path' => '',
                'category_id_path' => '',
            ];
        }
        $categoryId = $topCategoryId;
        $categories = [];
        try {
            $categoriesWithParentsInfo = $this->categoryRepository->getCategoriesWithParentInfo($langId, $shopId);
        } catch (\PrestaShopDatabaseException $e) {
            return [
                'category_path' => '',
                'category_id_path' => '',
            ];
        }
        $homeCategory = Category::getTopCategory()->id;
        $categoryExists = true;

        while ((int) $categoryId != $homeCategory && $categoryExists) {
            $categoryExists = false;
            foreach ($categoriesWithParentsInfo as $category) {
                if ($category['id_category'] == $categoryId) {
                    $categories[] = $category;
                    $categoryId = $category['id_parent'];
                    $categoryExists = true;
                    break;
                }
            }
        }
        $categories = array_reverse($categories);

        return [
            'category_path' => implode('/', array_map(function ($category) {
                return $category['name'];
            }, $categories)),
            'category_id_path' => implode('/', array_map(function ($category) {
                return $category['id_category'];
            }, $categories)),
        ];
    }
}
