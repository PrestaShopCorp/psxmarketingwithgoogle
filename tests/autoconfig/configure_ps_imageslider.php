<?php

use PrestaShop\PrestaShop\Adapter\Module\Configuration\ModuleComplexConfigurationInterface;

class configure_ps_imageslider implements ModuleComplexConfigurationInterface
{
    private $data = [
        1 => [
            'fr' => [
                'idCategory' => 9,
                'title' => 'DECORATION',
                'description' => "<h3>Ajoutez la touche finale</h3>
                <p>De l'art et de la décoration pour tous</p>",
            ],
            'gb' => [
                'idCategory' => 9,
                'title' => 'ART',
                'description' => '<h3>Add the final touch</h3>
                <p>Art and decoration for everyone.</p>',
            ],
        ],
        2 => [
            'fr' => [
                'idCategory' => 6,
                'title' => 'ACCESSOIRES',
                'description' => '<h3>Rien que pour vous</h3>
                <p>Découvrez notre collection d’accessoires.</p>',
            ],
            'gb' => [
                'idCategory' => 6,
                'title' => 'ACCESSORIES',
                'description' => '<h3>Only for you</h3>
                <p>Discover our accessories collection.</p>',
            ],
        ],
        3 => [
            'fr' => [
                'idCategory' => 3,
                'title' => 'VETEMENTS',
                'description' => '<h3>Prêt-à-porter</h3>
                <p>Découvrez notre collection de vêtements.</p>',
            ],
            'gb' => [
                'idCategory' => 3,
                'title' => 'CLOTHING',
                'description' => '<h3>Ready to wear</h3>
                <p>Discover our clothing collection.</p>',
            ],
        ],
    ];

    public function run()
    {
        include_once _PS_ROOT_DIR_ . '/modules/ps_imageslider/Ps_HomeSlide.php';

        $languages = Language::getLanguages(false);
        foreach ($this->data as $slideId => $slideData) {
            $slide = new Ps_HomeSlide($slideId);
            foreach ($languages as $language) {
                $slideDataLang = $slideData[$language['iso_code']];

                $slide->title[$language['id_lang']] = $slideDataLang['title'];
                $slide->description[$language['id_lang']] = $slideDataLang['description'];
                $slide->url[$language['id_lang']] = Context::getContext()->link->getCategoryLink(
                    new Category($slideDataLang['idCategory']),
                    null,
                    $language['id_lang']
                );
            }
            $slide->save();
        }
    }
}
