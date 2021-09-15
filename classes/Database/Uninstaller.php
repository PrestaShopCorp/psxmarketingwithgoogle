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

namespace PrestaShop\Module\PsxMarketingWithGoogle\Database;

use Exception;
use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\Exception\MktgWithGoogleInstallerException;
use PrestaShop\Module\PsxMarketingWithGoogle\Handler\ErrorHandler;
use PrestaShop\Module\PsxMarketingWithGoogle\Repository\TabRepository;
use PrestaShop\Module\PsxMarketingWithGoogle\Tracker\Segment;

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
        \PsxMarketingWithGoogle $module,
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

        /* todo: remove ignore when first configuration is added to the list */
        /* @phpstan-ignore-next-line */
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
                new MktgWithGoogleInstallerException(
                    'Failed to uninstall module tabs',
                    MktgWithGoogleInstallerException::MKTG_WITH_GOOGLE_UNINSTALL_EXCEPTION,
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
                new MktgWithGoogleInstallerException(
                    'Failed to uninstall database tables',
                    MktgWithGoogleInstallerException::MKTG_WITH_GOOGLE_UNINSTALL_EXCEPTION,
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
