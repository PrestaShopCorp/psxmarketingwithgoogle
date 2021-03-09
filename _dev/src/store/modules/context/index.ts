/**
 * 2007-2021 PrestaShop and Contributors
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
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */
 import {Module, VuexModule} from 'vuex-module-decorators';

 const {contextPsAccounts} = window || {};
 const {translations} = window || {};
 const {i18nSettings} = window || {};
 const stateContext = contextPsAccounts || {};
 const stateTranslations = translations || {};
 const statei18nSettings = i18nSettings || {};

 @Module({namespaced: true})
 export default class ModuleContext extends VuexModule {
   appContext: Record<string, any> = {
     ...stateContext,
     shopDomain: (window as any).shopDomain,
     shopUrl: (window as any).shopUrl,
     email: (window as any).email,
     psVersion: (window as any).psVersion,
     moduleVersion: (window as any).moduleVersion,
     shopId: (window as any).psAccountShopId,
   };

   stateTranslations: Record<string, any> = {...stateTranslations};

   statei18nSettings: Record<string, any> = {...statei18nSettings};

   get shopDomain() {
     return this.appContext.shop.domain;
   }
 }
