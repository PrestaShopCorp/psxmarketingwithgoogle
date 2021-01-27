<?php
/**
 * 2007-2020 PrestaShop and Contributors.
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2020 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

namespace PrestaShop\AccountsAuth\Service;

use Context;
use Lcobucci\JWT\Parser;
use Module;
use PrestaShop\AccountsAuth\Adapter\LinkAdapter;
use PrestaShop\AccountsAuth\Api\Client\FirebaseClient;
use PrestaShop\AccountsAuth\Api\Client\ServicesAccountsClient;
use PrestaShop\AccountsAuth\Context\ShopContext;
use PrestaShop\AccountsAuth\DependencyInjection\PsAccountsServiceProvider;
use PrestaShop\AccountsAuth\Environment\Env;
use PrestaShop\AccountsAuth\Exception\EnvVarException;
use PrestaShop\AccountsAuth\Exception\ServiceNotFoundException;
use PrestaShop\AccountsAuth\Exception\SshKeysNotFoundException;
use PrestaShop\AccountsAuth\Repository\ConfigurationRepository;
use Tools;

/**
 * Construct the psaccounts service.
 */
class PsAccountsService
{
    const STR_TO_SIGN = 'data';

    /**
     * @var Module
     */
    public $module;

    /**
     * @var Context
     */
    public $context;

    /**
     * @var ShopContext
     */
    public $shopContext;

    /**
     * @var string | null
     */
    public $psxName = null;

    /**
     * @var \Symfony\Component\DependencyInjection\ContainerInterface
     */
    protected $container;

    /**
     * @var PsAccountsServiceProvider
     */
    protected $psAccountContainer;

    /**
     * @var LinkAdapter
     */
    protected $linkAdapter;

    /**
     * @var ConfigurationRepository
     */
    private $configuration;

    /**
     * @var FirebaseClient
     */
    private $firebaseClient;

    /**
     * PsAccountsService constructor.
     *
     * @throws ServiceNotFoundException
     */
    public function __construct()
    {
        $this->psAccountContainer = PsAccountsServiceProvider::getInstance();

        $this->psAccountContainer->get(Env::class);

        $this->configuration = $this->psAccountContainer->get(ConfigurationRepository::class);
        $this->firebaseClient = $this->psAccountContainer->get(FirebaseClient::class);
        $this->module = $this->psAccountContainer->get(Module::class);
        $this->context = $this->psAccountContainer->get(Context::class);
        $this->shopContext = $this->psAccountContainer->get(ShopContext::class);
        $this->linkAdapter = $this->psAccountContainer->get(LinkAdapter::class);
    }

    /**
     * @return ShopContext
     */
    public function getShopContext()
    {
        return $this->shopContext;
    }

    /**
     * @return Context
     */
    public function getContext()
    {
        return $this->context;
    }

    /**
     * @param string $psxName
     *
     * @return void
     */
    public function setPsxName($psxName)
    {
        $this->psxName = $psxName;
    }

    /**
     * @return string | null
     */
    public function getPsxName()
    {
        return $this->psxName;
    }

    /**
     * Override of native function to always retrieve Symfony container instead of legacy admin container on legacy context.
     *
     * @param string $serviceName
     *
     * @return mixed
     */
    public function get($serviceName)
    {
        if (null === $this->container) {
            $this->container = \PrestaShop\PrestaShop\Adapter\SymfonyContainer::getInstance();
        }

        return $this->container->get($serviceName);
    }

    /**
     * @return bool
     */
    public function isShopContext()
    {
        if (\Shop::isFeatureActive() && \Shop::getContext() !== \Shop::CONTEXT_SHOP) {
            return false;
        }

        return true;
    }

    /**
     * @return array
     */
    public function getCurrentShop()
    {
        $shop = \Shop::getShop($this->context->shop->id);

        return [
            'id' => $shop['id_shop'],
            'name' => $shop['name'],
            'domain' => $shop['domain'],
            'domainSsl' => $shop['domain_ssl'],
            'url' => $this->linkAdapter->getAdminLink(
                'AdminModules',
                true,
                [],
                [
                    'configure' => $this->psxName,
                    'setShopContext' => 's-' . $shop['id_shop'],
                ]
            ),
        ];
    }

    /**
     * @return array
     */
    public function getShopsTree()
    {
        $shopList = [];

        if (true === $this->isShopContext()) {
            return $shopList;
        }

        foreach (\Shop::getTree() as $groupId => $groupData) {
            $shops = [];
            foreach ($groupData['shops'] as $shopId => $shopData) {
                $shops[] = [
                    'id' => $shopId,
                    'name' => $shopData['name'],
                    'domain' => $shopData['domain'],
                    'domainSsl' => $shopData['domain_ssl'],
                    'url' => $this->linkAdapter->getAdminLink(
                        'AdminModules',
                        true,
                        [],
                        [
                            'configure' => $this->psxName,
                            'setShopContext' => 's-' . $shopId,
                        ]
                    ),
                ];
            }

            $shopList[] = [
                'id' => $groupId,
                'name' => $groupData['name'],
                'shops' => $shops,
            ];
        }

        return $shopList;
    }

    /**
     * @return string | null
     */
    public function getFirebaseRefreshToken()
    {
        return $this->configuration->getFirebaseRefreshToken() ?: null;
    }

    /**
     * @return string | null
     */
    public function getFirebaseIdToken()
    {
        return $this->configuration->getFirebaseIdToken() ?: null;
    }

    /**
     * @return string
     */
    public function getSuperAdminEmail()
    {
        $employee = new \Employee(1);

        return $employee->email;
    }

    /**
     * @return string | null
     */
    public function getEmail()
    {
        return $this->configuration->getFirebaseEmail() ?: null;
    }

    /**
     * @return bool
     */
    public function isEmailValidated()
    {
        return $this->configuration->firebaseEmailIsVerified();
    }

    /**
     * @return bool
     */
    public function sslEnabled()
    {
        return $this->configuration->sslEnabled();
    }

    /**
     * @return string
     */
    public function getProtocol()
    {
        return false == $this->sslEnabled() ? 'http' : 'https';
    }

    /**
     * @return string
     */
    public function getDomainName()
    {
        $currentShop = $this->getCurrentShop();

        return false == $this->sslEnabled() ? $currentShop['domain'] : $currentShop['domainSsl'];
    }

    /**
     * @return string | false
     */
    public function getShopUuidV4()
    {
        return $this->configuration->getShopUuid();
    }

    /**
     * @return string | null
     */
    public function getPsAccountsInstallLink()
    {
        if (true === Module::isInstalled('ps_accounts')) {
            return null;
        }

        if ($this->shopContext->isShop17()) {
            $router = $this->get('router');

            return Tools::getHttpHost(true) . $router->generate('admin_module_manage_action', [
                'action' => 'install',
                'module_name' => 'ps_accounts',
            ]);
        }

        return  $this->linkAdapter->getAdminLink('AdminModules', true, [], [
            'module_name' => $this->psxName,
            'configure' => $this->psxName,
            'install' => 'ps_accounts',
        ]);
    }

    /**
     * @return string | null
     */
    public function getPsAccountsEnableLink()
    {
        if (true === Module::isEnabled('ps_accounts')) {
            return null;
        }

        if ($this->shopContext->isShop17()) {
            $router = $this->get('router');

            return Tools::getHttpHost(true) . $router->generate('admin_module_manage_action', [
                'action' => 'enable',
                'module_name' => 'ps_accounts',
            ]);
        }

        return  $this->linkAdapter->getAdminLink('AdminModules', true, [], [
            'module_name' => $this->psxName,
            'configure' => $this->psxName,
            'enable' => 'ps_accounts',
        ]);
    }

    /**
     * @return string
     *
     * @throws \Exception
     */
    public function getOnboardingLink()
    {
        if (false === Module::isInstalled('ps_accounts')) {
            return '';
        }

        $callback = preg_replace(
            '/^https?:\/\/[^\/]+/',
            '',
            $this->linkAdapter->getAdminLink('AdminModules', true) . '&configure=' . $this->psxName
        );

        $uiSvcBaseUrl = $_ENV['ACCOUNTS_SVC_UI_URL'];
        if (false === $uiSvcBaseUrl) {
            throw new EnvVarException('Environmenrt variable ACCOUNTS_SVC_UI_URL should not be empty');
        }

        $protocol = $this->getProtocol();
        $domainName = $this->getDomainName();
        $currentShop = $this->getCurrentShop();

        $queryParams = [
            'bo' => $callback,
            'pubKey' => $this->configuration->getAccountsRsaPublicKey(),
            'next' => preg_replace(
                '/^https?:\/\/[^\/]+/',
                '',
                $this->linkAdapter->getAdminLink('AdminConfigureHmacPsAccounts')
            ),
            'name' => $currentShop['name'],
            'lang' => $this->context->language->iso_code,
        ];

        $queryParamsArray = [];
        foreach ($queryParams as $key => $value) {
            $queryParamsArray[] = $key . '=' . urlencode($value);
        }
        $strQueryParams = implode('&', $queryParamsArray);

        return  $uiSvcBaseUrl . '/shop/account/link/' . $protocol . '/' . $domainName
            . '/' . $protocol . '/' . $domainName . '/' . $this->psxName . '?' . $strQueryParams;
    }

    /**
     * @param array $bodyHttp
     * @param string $trigger
     *
     * @return mixed
     *
     * @throws \ReflectionException
     */
    public function changeUrl($bodyHttp, $trigger)
    {
        if (array_key_exists('shop_id', $bodyHttp)) {
            // id for multishop
            $this->configuration->setShopId($bodyHttp['shop_id']);
        }

        $sslEnabled = $this->sslEnabled();
        $protocol = $this->getProtocol();
        $domain = $sslEnabled ? $bodyHttp['domain_ssl'] : $bodyHttp['domain'];

        $uuid = $this->getShopUuidV4();

        $response = false;
        $boUrl = preg_replace(
            '/^https?:\/\/[^\/]+/',
            $protocol . '://' . $domain,
            $this->linkAdapter->getAdminLink('AdminModules', true)
        );

        if ($uuid && strlen($uuid) > 0) {
            $response = (new ServicesAccountsClient($this->getContext()->link))->changeUrl(
                $uuid,
                [
                    'protocol' => $protocol,
                    'domain' => $domain,
                    'boUrl' => $boUrl,
                    'trigger' => $trigger,
                ]
            );
        }

        return $response;
    }

    /**
     * @return array
     *
     * @throws \ReflectionException
     */
    public function unlinkShop()
    {
        $response = (new ServicesAccountsClient($this->getContext()->link))
            ->deleteShop((string) $this->getShopUuidV4());

        // Réponse: 200: Shop supprimé avec payload contenant un message de confirmation
        // Réponse: 404: La shop n'existe pas (not found)
        // Réponse: 401: L'utilisateur n'est pas autorisé à supprimer cette shop

        if ($response['status'] && $response['httpCode'] === 200) {
            $this->resetOnboardingData();
        }

        return $response;
    }

    /**
     * Empty onboarding configuration values
     *
     * @return void
     */
    public function resetOnboardingData()
    {
        $this->configuration->updateAccountsRsaPrivateKey('');
        $this->configuration->updateAccountsRsaPublicKey('');
        $this->configuration->updateAccountsRsaSignData('');

        $this->configuration->updateFirebaseIdAndRefreshTokens('', '');
        $this->configuration->updateFirebaseEmail('');
        $this->configuration->updateFirebaseEmailIsVerified(false);

        $this->configuration->updateShopUuid('');
    }

    /**
     * @return void
     *
     * @throws \Exception
     */
    public function manageOnboarding()
    {
        $this->generateSshKey();
        $this->updateOnboardingData();
    }

    /**
     * @return void
     *
     * @throws SshKeysNotFoundException
     */
    public function generateSshKey()
    {
        if (false === $this->configuration->hasAccountsSshKeys()) {
            $sshKey = new SshKey();

            $key = $sshKey->generate();
            $this->configuration->updateAccountsRsaPrivateKey($key['privatekey']);
            $this->configuration->updateAccountsRsaPublicKey($key['publickey']);
            $this->configuration->updateAccountsRsaSignData(
                $sshKey->signData(
                    $this->configuration->getAccountsRsaPrivateKey(),
                    self::STR_TO_SIGN
                )
            );
            if (empty($this->configuration->getAccountsRsaPrivateKey())) {
                throw new SshKeysNotFoundException('SshKeys not found');
            }
        }
    }

    /**
     * Only callable during onboarding
     *
     * Prepare onboarding data
     *
     * @return void
     *
     * @throws \Exception
     */
    public function updateOnboardingData()
    {
        $email = \Tools::getValue('email');
        $emailVerified = \Tools::getValue('emailVerified');
        $customToken = \Tools::getValue('adminToken');

        if (false === $this->configuration->hasAccountsSshKeys()) {
            throw new \Exception('SSH keys were not found');
        }

        if (!$this->exchangeCustomTokenForIdAndRefreshToken($customToken)) {
            return;
        }

        if (!empty($email)) {
            $this->configuration->updateFirebaseEmail($email);

            if (!empty($emailVerified)) {
                $this->configuration->updateFirebaseEmailIsVerified('true' === $emailVerified);
            }
        }
    }

    /**
     * Get the user firebase token.
     *
     * @return string
     *
     * @throws \Exception
     */
    public function getOrRefreshToken()
    {
        if (
            $this->configuration->hasFirebaseRefreshToken()
            && $this->isTokenExpired()
        ) {
            $this->refreshToken();
        }

        return $this->configuration->getFirebaseIdToken();
    }

    /**
     * @return bool
     *
     * @throws \Exception
     */
    public function refreshToken()
    {
        $response = $this->firebaseClient->exchangeRefreshTokenForIdToken(
            $this->configuration->getFirebaseRefreshToken()
        );

        if ($response && true === $response['status']) {
            $this->configuration->updateFirebaseIdAndRefreshTokens(
                $response['body']['id_token'],
                $response['body']['refresh_token']
            );

            return true;
        }

        return false;
    }

    /**
     * get refreshToken.
     *
     * @see https://firebase.google.com/docs/reference/rest/auth Firebase documentation
     *
     * @param string $customToken
     *
     * @return bool
     */
    public function exchangeCustomTokenForIdAndRefreshToken($customToken)
    {
        $response = $this->firebaseClient->signInWithCustomToken($customToken);

        if ($response && true === $response['status']) {
            $uid = (new Parser())->parse((string) $customToken)->getClaim('uid');

            $this->configuration->updateShopUuid($uid);

            $this->configuration->updateFirebaseIdAndRefreshTokens(
                $response['body']['idToken'],
                $response['body']['refreshToken']
            );

            return true;
        }

        return false;
    }

    /**
     * Check the token validity. The token expire time is set to 3600 seconds.
     *
     * @return bool
     *
     * @throws \Exception
     */
    public function isTokenExpired()
    {
        /*$refresh_date = $this->configuration->get(Configuration::PS_PSX_FIREBASE_REFRESH_DATE);

        if (empty($refresh_date)) {
            return true;
        }

        return strtotime($refresh_date) + 3600 < time();*/

        // iat, exp

        $token = (new Parser())->parse($this->configuration->getFirebaseIdToken());

        return $token->isExpired(new \DateTime());
    }

    /**
     * @return string
     */
    public function getManageAccountLink()
    {
        $url = $_ENV['SSO_MANAGE_ACCOUNT'];
        $langIsoCode = $this->context->language->iso_code;

        return $url . '?lang=' . substr($langIsoCode, 0, 2);
    }

    /**
     * @return string
     */
    public function getAccountsRsaPublicKey()
    {
        return $this->configuration->getAccountsRsaPublicKey();
    }

    /**
     * @return string
     */
    public function getAccountsRsaSignData()
    {
        return $this->configuration->getAccountsRsaSignData();
    }

    /**
     * Generate ajax admin link with token
     * available via PsAccountsPresenter into page dom,
     * ex :
     * let url = window.contextPsAccounts.adminAjaxLink + '&action=unlinkShop'
     *
     * @return string
     */
    public function getAdminAjaxLink()
    {
//        Tools::getAdminTokenLite('AdminAjaxPsAccounts'));
        return $this->linkAdapter->getAdminLink('AdminAjaxPsAccounts', true, [], ['ajax' => 1]);
    }
}
