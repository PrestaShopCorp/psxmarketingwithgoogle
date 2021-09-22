<!--**
 * 2007-2020 PrestaShop and Contributors
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
 *-->
<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard px-0"
  >
    <b-card-header
      header-tag="h3"
      header-class="px-3 py-3 font-weight-600 ps_gs-fz-16 mb-0"
    >
      Remarketing
    </b-card-header>
    <b-card-body
      body-class="p-3"
    >
      <ul>
        <li>Remarketing tag is implemented by a third party module: ???</li>
        <li>
          Remarketing tag is implemented and enabled by "PrestaShop Marketing With Google":
          {{ GET_REMARKETING_TRACKING_TAG_IS_SET }}
        </li>
        <li>
          List of conversion actions set on front-office
          ({{ GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED.length }}):
          <ul>
            <li
              v-for="action in GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED"
              :key="action.category"
            >
              {{ action.category }}:
              <code>{{ action.tag }}</code>
            </li>
          </ul>
        </li>
      </ul>
    </b-card-body>
  </b-card>
</template>

<script>
import {mapGetters} from 'vuex';
import GettersTypes from '@/store/modules/smart-shopping-campaigns/getters-types.ts';

export default {
  name: 'Debug',
  components: {
  },
  props: {
  },
  computed: {
    ...mapGetters('smartShoppingCampaigns', [
      GettersTypes.GET_REMARKETING_TRACKING_TAG_IS_SET,
      GettersTypes.GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED,
      // Todo: Add getter for state.tagAlreadyExists
    ]),
  },
  mounted() {
    this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_TRACKING_TAG_STATUS_MODULE');
    this.$store.dispatch('smartShoppingCampaigns/GET_REMARKETING_CONVERSION_ACTIONS_ASSOCIATED');
  },
};
</script>
