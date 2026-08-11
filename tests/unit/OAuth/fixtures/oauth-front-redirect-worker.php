<?php

declare(strict_types=1);

class ModuleFrontController
{
}

class Tools
{
    /** @var array<string, string> */
    public static $redirect = [];

    public static function redirect(string $url): void
    {
        self::$redirect = ['method' => 'redirect', 'url' => $url];
    }

    public static function redirectAdmin(string $url): void
    {
        unset($url);

        throw new RuntimeException('The admin redirect path is unavailable in a front controller.');
    }
}

require_once dirname(__DIR__, 4) . '/controllers/front/oauth.php';

$controller = new class() extends PsxmarketingwithgoogleOauthModuleFrontController {
    public function redirectForTest(string $url): void
    {
        $this->redirectToBackOffice($url);
    }
};

$controller->redirectForTest('https://shop.example/admin/module?oauth_result=failed');
echo json_encode(Tools::$redirect, JSON_UNESCAPED_SLASHES), PHP_EOL;
