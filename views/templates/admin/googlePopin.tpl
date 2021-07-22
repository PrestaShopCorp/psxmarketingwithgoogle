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
 <html>
  <head>
    <title>Marketing With Google</title>
    <meta charset="utf-8">
    <meta name="robots" content="NOFOLLOW, NOINDEX">
    <style lang="css">
      @-webkit-keyframes rotating {
          from {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
          }
          to {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
          }
      }

      @keyframes rotating {
          from {
              -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
          }
          to {
              -webkit-transform: rotate(360deg);
              transform: rotate(360deg);
          }
      }

      body {
          display: flex;
          flex-direction: column;
          align-items: center;
      }

      .spinner {
          height: 90vh;
          display: flex;
          flex-direction: row;
          align-items: center;
      }

      .spinner > div:not(.alert) {
          color: #fff;
          background-color: #fff;
          width: 80px;
          width: 5rem;
          height: 80px;
          height: 5rem;
          border-radius: 5rem;
          border-right-color: #3ed2f0;
          border-bottom-color: #3ed2f0;
          border-width: 4px;
          border-style: solid;
          font-size: 0;
          outline: none;
          display: inline-block;
          border-left-color: #e1e9f9;
          border-top-color: #e1e9f9;
          -webkit-animation: rotating 2s linear infinite;
          animation: rotating 2s linear infinite;
      }
    </style>
    <script>
      function init() {
        if (!window.opener) {
          console.error('Not opened as a popup.');
        }

        window.opener.postMessage(window.location.search);
        setTimeout(() => {
          window.close();
        }, 100);
      }

      window.onload = init;
    </script>
  </head>
  <body>
    <div id="spinner" class="spinner"><div></div></div>
  </body>
 </html>
