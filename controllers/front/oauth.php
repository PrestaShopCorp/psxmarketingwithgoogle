<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 *
 * @license https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */

use PrestaShop\Module\PsxMarketingWithGoogle\Config\Config;
use PrestaShop\Module\PsxMarketingWithGoogle\OAuth\GoogleOAuthCallback;

class PsxmarketingwithgoogleOauthModuleFrontController extends ModuleFrontController
{
    public function initContent()
    {
        parent::initContent();

        $query = [];
        foreach (['state', 'code', 'error'] as $key) {
            $value = Tools::getValue($key);
            if (is_string($value)) {
                $query[$key] = $value;
            }
        }
        if (Tools::getIsset('id_shop')) {
            $query['id_shop'] = Tools::getValue('id_shop');
        }

        $module = $this->module;
        if (!$module instanceof PsxMarketingWithGoogle) {
            throw new RuntimeException('Tiny Lux Google OAuth controller is unavailable.');
        }

        /** @var GoogleOAuthCallback $callback */
        $callback = $module->getService(GoogleOAuthCallback::class);
        $backOfficeUrl = $this->context->link->getAdminLink('AdminPsxMktgWithGoogleModule');
        Tools::redirectAdmin($callback->handle(
            $query,
            $backOfficeUrl,
            Config::GOOGLE_OAUTH_REDIRECT_URI
        ));
    }
}
