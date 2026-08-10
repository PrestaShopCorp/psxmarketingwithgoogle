<!--**
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
 *-->
<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <template #header>
      {{ $t("general.tabs.help") }}
    </template>

    <b-card-body
      class="p-3"
    >
      <b-row>
        <b-col
          cols="12"
          md="12"
        >
          <div class="module-desc d-flex mb-4">
            <div>
              <p>
                {{ $t("help.intro") }}
              </p>
              <strong class="font-weight-600">{{ $t("help.allowsYouTo.title") }}</strong>
              <ul class="mt-3">
                <li>{{ $t("help.allowsYouTo.easySync") }}</li>
                <li>{{ $t("help.allowsYouTo.freeListing") }}</li>
                <li>{{ $t("help.allowsYouTo.campaigns") }}</li>
                <li>{{ $t("help.allowsYouTo.reporting") }}</li>
              </ul>
            </div>
          </div>
        </b-col>
      </b-row>

      <div class="row">
        <div class="faq col">
          <h1 class="border-bottom pb-3 mb-3">
            {{ $t("faq.title") }}
          </h1>
          <b-alert
            class="mb-0"
            variant="info"
            show
          >
            <p class="mb-0">
              {{ $t("faq.noFaq") }}
            </p>
          </b-alert>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({});
</script>
