<?php

class AdminPsgoogleshoppingModuleController extends ModuleAdminController
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
    }

    public function postProcess()
    {
    }
}
