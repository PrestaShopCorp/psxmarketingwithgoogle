{**
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
 *}

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<link href="{$cloudSyncUrl|escape:'htmlall':'UTF-8'}" rel=preload as=script>
<link href="{$ps_account_cdn_url|escape:'htmlall':'UTF-8'}" rel=preload as=script>

<div id="psxMktgWithGoogleApp"></div>
<script src="{$cloudSyncUrl|escape:'htmlall':'UTF-8'}"></script>
<script src="{$ps_account_cdn_url|escape:'htmlall':'UTF-8'}"></script>
<script src="{$billingUrl|escape:'htmlall':'UTF-8'}" rel=preload></script>

{if $psxMktgWithGoogleLiveMode}
  <script type="module" src="http://localhost:5173/@vite/client"></script>
  <script type="module" src="http://localhost:5173/src/main.ts"></script>
{else}
  <link href="{$pathApp|escape:'htmlall':'UTF-8'}" rel=preload as=script>
  <script src="{$pathApp|escape:'htmlall':'UTF-8'}" type="module"></script>
{/if}
<style>
  /** Hide native multistore module activation panel, because of visual regressions on non-bootstrap content */
  #content.nobootstrap div.bootstrap.panel {
    display: none;
  }
</style>

<script>
// it's used to avoid breaking the menu on the module
document.addEventListener('DOMContentLoaded', function () {
  const hasNoBootstrapClass = document.querySelector('#content.nobootstrap');
  if (hasNoBootstrapClass === null) {
    document.querySelector('#content').classList.add('nobootstrap');
    document.querySelector('#content').classList.remove('bootstrap');
  }
});
</script>
