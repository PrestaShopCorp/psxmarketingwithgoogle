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
  <span>
    <b-icon-info-circle
      :id="`tooltip-circle-${this._uid}`"
      class="iconInfo ml-2"
      variant="primary"
    />
    <b-tooltip
      :target="`tooltip-circle-${this._uid}`"
      :container="`#${this.$root.$el.id}`"
      triggers="hover"
      placement="right"
    >
      {{ text }}
    </b-tooltip>
  </span>
</template>

<script lang="ts">
import {BIconInfoCircle} from 'bootstrap-vue';

export default {
  name: 'Tooltip',
  components: {
    BIconInfoCircle,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped>
    .iconInfo {
      position: relative;
      top: 0.1em;
    }
</style>
