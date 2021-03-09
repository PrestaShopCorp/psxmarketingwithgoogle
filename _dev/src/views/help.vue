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
    class="ps-google-help-tab"
  >
    <faq
      :faq="faq"
      :contact-us-link="contactUsLink"
      :doc-link="docLink"
      :loading="loading"
      class="m-3"
    />
  </div>
</template>

<script>
import {defineComponent} from '@vue/composition-api';
import faq from '../components/help/faq.vue';

export default defineComponent({
  name: 'HelpTab',
  components: {
    faq,
  },
  props: {
    psGoogleRetrieveFaq: {
      type: String,
      required: false,
      default: () => global.psGoogleRetrieveFaq,
    },
  },
  data() {
    return {
      faq: {},
      docLink: '',
      contactUsLink: '',
      loading: true,
    };
  },
  created() {
    this.fetchFaq();
  },
  methods: {
    fetchFaq() {
      fetch(this.psGoogleRetrieveFaq)
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.statusText || res.status);
          }
          return res.json();
        })
        .then((resp) => {
          this.faq = resp.faq;
          this.docLink = resp.doc;
          this.contactUsLink = resp.contactUs;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
  },
});
</script>

<style lang="scss">
  .ps-google-help-tab {
    div.card {
      border: none !important;
      border-radius: 3px;
    }
  }
</style>
