<?php

namespace PrestaShop\Module\PrestashopGoogleShopping\Database;

use Exception;
use PrestaShop\Module\PrestashopGoogleShopping\Config\Config;
use PrestaShop\Module\PrestashopGoogleShopping\Exception\GoogleShoppingInstallerException;
use PrestaShop\Module\PrestashopGoogleShopping\Handler\ErrorHandler\ErrorHandler;
use PrestaShop\Module\PrestashopGoogleShopping\Repository\TabRepository;
use PrestaShop\Module\PrestashopGoogleShopping\Tracker\Segment;

class Uninstaller
{
    const CLASS_NAME = 'Uninstaller';

    /**
     * @var array
     */
    private $errors = [];

    private $module;

    /**
     * @var TabRepository
     */
    private $tabRepository;

    /**
     * @var Segment
     */
    private $segment;

    /**
     * @var ErrorHandler
     */
    private $errorHandler;

    public function __construct(
        \Ps_googleshopping $module,
        TabRepository $tabRepository,
        Segment $segment,
        ErrorHandler $errorHandler
    ) {
        $this->module = $module;
        $this->tabRepository = $tabRepository;
        $this->segment = $segment;
        $this->errorHandler = $errorHandler;
    }

    /**
     * @return bool
     *
     * @throws Exception
     */
    public function uninstall()
    {
        $this->segment->setMessage('PS Google shopping uninstalled');
        $this->segment->track();

        foreach (array_keys(Config::CONFIGURATION_LIST) as $name) {
            \Configuration::deleteByName((string) $name);
        }

        return $this->uninstallTabs() && $this->uninstallTables();
    }

    /**
     * @return bool
     *
     * @throws \PrestaShopDatabaseException
     * @throws \PrestaShopException|Exception
     */
    private function uninstallTabs()
    {
        $uninstallTabCompleted = true;

        try {
            foreach (Config::MODULE_ADMIN_CONTROLLERS as $controllerName) {
                $id_tab = (int) \Tab::getIdFromClassName($controllerName);
                $tab = new \Tab($id_tab);
                if (\Validate::isLoadedObject($tab)) {
                    $uninstallTabCompleted = $uninstallTabCompleted && $tab->delete();
                }
            }
            $uninstallTabCompleted = $uninstallTabCompleted && $this->uninstallMarketingTab();
        } catch (Exception $e) {
            $this->errorHandler->handle(
                new GoogleShoppingInstallerException(
                    'Failed to uninstall module tabs',
                    GoogleShoppingInstallerException::GOOGLE_SHOPPING_UNINSTALL_EXCEPTION,
                    $e
                ),
                $e->getCode(),
                false
            );
            $this->errors[] = $this->module->l('Failed to uninstall database tables', self::CLASS_NAME);

            return false;
        }

        return $uninstallTabCompleted;
    }

    /**
     * @return bool
     *
     * @throws \PrestaShopDatabaseException
     * @throws \PrestaShopException
     */
    private function uninstallMarketingTab()
    {
        $id_tab = (int) \Tab::getIdFromClassName('Marketing');
        $tab = new \Tab($id_tab);
        if (!\Validate::isLoadedObject($tab)) {
            return true;
        }
        if ($this->tabRepository->hasChildren($id_tab)) {
            return true;
        }

        return $tab->delete();
    }

    public function uninstallTables()
    {
        try {
            include dirname(__FILE__) . '/../../sql/uninstall.php';
        } catch (\Exception $e) {
            $this->errorHandler->handle(
                new GoogleShoppingInstallerException(
                    'Failed to uninstall database tables',
                    GoogleShoppingInstallerException::GOOGLE_SHOPPING_UNINSTALL_EXCEPTION,
                    $e
                ),
                $e->getCode(),
                false
            );
            $this->errors[] = $this->module->l('Failed to uninstall database tables', self::CLASS_NAME);

            return false;
        }

        return true;
    }
}
