<?php

class AdminAjaxPsgoogleshoppingController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;
    }

    public function initContent()
    {
        parent::initContent();
    }

    //** We need to call this logic in our API call where we hold client id and secret
    // https://developers.google.com/identity/protocols/oauth2/web-server */
    public function postProcess()
    {
        $client = new Google\Client();
//        $client->setClientId('511840070660-fh4v9s0l7lhb9rnrq6a7hmsdomphmjpb.apps.googleusercontent.com');
//        $client->setClientSecret('zqkj5LAHGSSOcc2h3h2glHX5');
//        $client->setRedirectUri('https://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping');
//        $client->setAccessType('offline');
        $client->setAuthConfig(__DIR__ . '/../../client_secret.json');
        $client->fetchAccessTokenWithAuthCode($_GET['code']);
        $access_token = $client->getAccessToken();

        Configuration::updateValue('GOOGLE_TOKEN', $access_token['access_token']);
        Configuration::updateValue('GOOGLE_REFRESH_TOKEN', $access_token['refresh_token']);

    }
}
