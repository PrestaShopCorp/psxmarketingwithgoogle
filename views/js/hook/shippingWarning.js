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

document.addEventListener('DOMContentLoaded', () => {
    let i = 1;
    let findDelayDiv = document.querySelector(`#carrier_wizard #step_carrier_general #delay_${i}`);

    while (!!findDelayDiv) {
        findDelayDiv.addEventListener('change', displayWarningMsg);
        i++;
        findDelayDiv = document.querySelector(`#carrier_wizard #step_carrier_general #delay_${i}`);
    }
})

function displayWarningMsg() {
    const formId = document.querySelector('#carrier_wizard #step_carrier_general #fieldset_form');
    const findAlert = document.querySelector('#carrier_wizard #step_carrier_general #warningTransit');
    if (!!findAlert) {
        return;
    }
    let warningShipping = document.createElement('div');
    warningShipping.setAttribute('id', 'warningTransit');
    const content = `
        <div class="alert alert-warning">
            <div class="alert-text">
                ${transitWarningMsg}
            </div>
        </div>
    `;
    warningShipping.innerHTML = content;
    formId.after(warningShipping);
}
