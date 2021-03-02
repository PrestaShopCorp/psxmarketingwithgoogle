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

    public function postProcess()
    {
    }
}
