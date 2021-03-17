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
        $client->setClientId('1000722766520-po71n2uteu42u0e60s3e7paqc8030ckl.apps.googleusercontent.com');
        $client->setClientSecret('LoXOocivJ1oIpiN0QQftZyGd');
        $client->setRedirectUri('http://margud.eu.ngrok.io/google/admin1/index.php?controller=AdminAjaxPsgoogleshopping');
//        $client->setAccessType('offline');
        $client->fetchAccessTokenWithAuthCode($_GET['code']);
        $access_token = $client->getAccessToken();

    }
}
