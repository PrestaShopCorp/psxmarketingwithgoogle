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
  <div
    id="help"
  >
    <faq
      :informations="helpInformations"
      :loading="loading"
      class="m-3"
    />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import faq from '../components/help/faq.vue';

export default defineComponent({
  name: 'HelpTab',
  components: {
    faq,
  },
  data() {
    return {
      loading: true,
    };
  },
  created() {
    this.fetchHelpInformations();
    this.$segment.track('[GGL] View Help tab', {
      module: 'psxmarketingwithgoogle',
      params: SegmentGenericParams,
    });
  },
  computed: {
    helpInformations() {
      return this.$store.getters['app/GET_DOC_AND_FAQ'];
    },
  },
  methods: {
    fetchHelpInformations() {
      this.$store.dispatch('app/REQUEST_DOC_AND_FAQ').then(() => {
        this.loading = false;
      });
    },
  },
});
</script>
