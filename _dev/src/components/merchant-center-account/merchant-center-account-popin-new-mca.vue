<template>
  <ps-modal
    id="MerchantCenterAccountPopinNewMca"
    :title="$t('mcaRequirements.title')"
    v-bind="$attrs"
    scrollable
    ref="MerchantCenterAccountPopinNewMca"
  >
    <form class="my-1">
      <legend class="font-weight-normal ps_gs-fz-14 mb-2">
        {{ $t('mcaRequirements.legend') }}
      </legend>
      <ul class="list-unstyled">
        <li
          v-for="requirement in requirements"
          :key="$t(`mcaRequirements.${requirement}.title`)"
          class="d-flex border-bottom py-3 pl-2 ml-1"
        >
        <b-form-checkbox
          class="ps_gs-checkbox"
          :id="safeString($t(`mcaRequirements.${requirement}.title`))"
          v-model="selectedRequirements"
          :value="safeString($t(`mcaRequirements.${requirement}.title`))"
        >
          <div>
            <span
              class="ps_gs-fz-14 font-weight-normal mb-1"
            >
              {{ $t(`mcaRequirements.${requirement}.title`) }}
            </span>
            <p class="ps_gs-fz-12 text-muted">
              {{ $t(`mcaRequirements.${requirement}.description`) }}<br>
              <a
                :href="$options.googleUrl[requirement]"
                target="_blank"
              >
                {{ $t(`mcaRequirements.${requirement}.link`)  }}
              </a>
            </p>
          </div>
        </b-form-checkbox>
        </li>
      </ul>
    </form>
    <template slot="modal-footer">
      <a
        class="ps_gs-fz-12 text-muted mr-sm-auto"
        href="//google.com"
        target="_blank"
      >
        {{ $t('mcaRequirements.footer') }}
      </a>
      <b-button
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <span
        v-b-tooltip:googleShoppingApp
        :title="validateForm() ? $t('tooltip.mustCheckAllRequirements') : ''"
      >
        <b-button
          variant="primary"
          @click="ok()"
          :disabled="validateForm()"
        >
          I checked all requirements
        </b-button>
      </span>
    </template>
  </ps-modal>
</template>

<script>
/**
 * TODO: Handle events (close, continue, etc...)
 */

import googleUrl from '@/assets/json/googleUrl.json';

import PsModal from '../commons/ps-modal';

export default {
  name: 'MerchantCenterAccountPopinNewMca',
  components: {
    PsModal,
  },
  data() {
    return {
      requirements: [
        'shoppingAdsPolicies',
        'accurateContactInformation',
        'secureCheckoutProcess',
        'returnPolicy',
        'billingTerms',
        'completeCheckoutProcess',
      ],
      selectedRequirements: [],
    };
  },
  methods: {
   safeString(str) {
      str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      str = str
        .replace(/\-/g, " ") //convert all hyphens to spaces
        .replace(/\s+/g, "") //remove spaces
      return str;
    },
    validateForm() {
      return !(this.selectedRequirements.length === this.requirements.length);
    },
    ok() {

    },
    cancel() {
      this.$refs.MerchantCenterAccountPopinNewMca.hide()
    },
  },
  googleUrl,
};
</script>
