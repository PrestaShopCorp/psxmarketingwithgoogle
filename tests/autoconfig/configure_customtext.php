<?php


use PrestaShop\PrestaShop\Adapter\Module\Configuration\ModuleComplexConfigurationInterface;

class configure_customtext implements ModuleComplexConfigurationInterface
{
    public function run(PrestaShop\PrestaShop\Core\Module\ModuleInterface $module, array $params)
    {
        $shopName = str_replace(['_', '-'], [' ', ' '], Configuration::get('PS_SHOP_NAME'));

        $requestsList = [
            "UPDATE ps_info_lang SET `text` = '<h2><span style=\"color: #cbb3f7\">Discover {$shopName}</span></h2>
        <p>Welcome to {$shopName}, your online destination for unique and quality clothing, accessories, and home decor. We take pride in offering you a wide selection of products from different styles and trends so you can find something that suits you.</p>
        <p>Whether you\'re looking for a dress for a special occasion, a handbag to complement your daily outfit, or decor items for your home, we\'ve got you covered. Our team works hard to find the most popular products of the moment and ensure that we offer quality items at affordable prices.</p>
        <p>Browse our online store to discover our collection of products and find your next favorite item at {$shopName}.</p>' WHERE id_shop = 1 AND id_lang = (SELECT id_lang from ps_lang where iso_code = 'gb')",
            
            "UPDATE ps_info_lang SET `text` = '<h2><span style=\"color: #cbb3f7\">Découvrez {$shopName}</span></h2>
        <p>Bienvenue chez {$shopName}, votre destination en ligne pour des vêtements, des accessoires et de la décoration uniques et de qualité. Nous sommes fiers de vous offrir une large sélection de produits de différents styles et tendances pour que vous puissiez trouver quelque chose qui vous convient.</p>
        <p>Que vous cherchiez une robe pour une occasion spéciale, un sac à main pour compléter votre tenue quotidienne ou des objets de décoration pour votre maison, nous avons ce qu\'il vous faut. Notre équipe travaille dur pour trouver les produits les plus en vogue du moment et pour s\'assurer que nous proposons des articles de qualité à des prix abordables.</p>
        <p>Parcourez notre boutique en ligne pour découvrir notre collection de produits et trouvez votre prochain coup de cœur chez {$shopName}.</p>' WHERE id_shop = 1 AND id_lang = (SELECT id_lang from ps_lang where iso_code = 'fr')",

            "UPDATE ps_hook_module SET position = position + 1 WHERE id_hook = (SELECT id_hook FROM `ps_hook` where `name` like \"displayHome\")",
            "UPDATE ps_hook_module SET position = 0 WHERE id_hook = (SELECT id_hook FROM `ps_hook` where `name` like \"displayHome\") AND id_module = (SELECT id_module FROM ps_module WHERE `name` LIKE 'ps_customtext')",
        ];

        $db = Db::getInstance();
        foreach($requestsList as $request) {
            $db->executeS($request);
        }
    }
}