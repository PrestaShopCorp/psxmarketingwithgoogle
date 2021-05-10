<?php

$inputTranslationsPath = __DIR__ . '/../../translations';
$outputTranslationsJsonFile = __DIR__ . '/../../_dev/.storybook/translations.json';

require_once __DIR__ . '/../../classes/Translations/PsGoogleShoppingTranslations.php';
$translationsClassName = 'PrestaShop\Module\Ps_GoogleShopping\Translations\PsGoogleShoppingTranslations';

define('MODULE_NAME', 'ps_googleshopping');

/* -- End of data to customize -- */

class Module
{
    private $name = MODULE_NAME;

    public function l($originalString, $domain = null)
    {
        if (!$domain) {
            trigger_error('No domain specified, error in Translation class?', E_USER_WARNING);
        }

        $string = preg_replace("/\\\*'/", "\'", $originalString);
        $key = '<{' . $this->name . '}prestashop>' . strtolower($domain ?: $this->name) . '_' . md5($string);

        global $_MODULE;

        return isset($_MODULE[$key]) ? $_MODULE[$key] : $originalString;
    }
}

class Context
{
    /** @var Context */
    protected static $instance;

    public $language;

    public function __construct()
    {
        $this->language = (object) [
            'iso_code' => 'en',
        ];
    }

    public static function getContext()
    {
        if (!isset(self::$instance)) {
            self::$instance = new Context();
        }

        return self::$instance;
    }

    public function setLanguageIsoCode($iso_code)
    {
        $this->language->iso_code = $iso_code;
    }
}

$translationsClass = new $translationsClassName(new Module());

$translations = [];

foreach (scandir($inputTranslationsPath) as $file) {
    if ($file === 'index.php' || substr($file, 0, 1) === '.') {
        continue;
    }

    $iso_code = substr($file, 0, strpos($file, '.'));

    Context::getContext()->setLanguageIsoCode($iso_code);
    require $inputTranslationsPath . '/' . $file;

    $translations += $translationsClass->getTranslations();
}

file_put_contents($outputTranslationsJsonFile, json_encode($translations));
