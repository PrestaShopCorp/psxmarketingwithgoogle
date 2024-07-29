<template>
  <div>
    <MonetizationBannerInformation
      v-if="!googleAccountIsOnboarded
        && !GET_BILLING_SUBSCRIPTION_ACTIVE
        && page === 'configuration'"
    />
    <MonetizatizationAlertWarningUpdateModule
      v-if="modaleIsClosed && !moduleIsUpdated"
      @moduleUpdated="clickModuleUpdated"
    />
    <MonetizationPopinUpdateModule
      v-if="moduleNeedUpgrade && !moduleIsUpdated"
      @clickUpdateModule="moduleIsUpdated = true"
      @closeModale="modaleIsClosed = true"
    >
      <template #content>
        <slot name="content-modale" />
      </template>
    </MonetizationPopinUpdateModule>
    <PsToast
      v-if="moduleIsUpdated"
      variant="success"
      :visible="moduleIsUpdated"
      toaster="b-toaster-top-right"
      body-class="border border-success"
    >
      <p>{{ $t("toast.moduleUpdated") }}</p>
    </PsToast>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import MonetizationPopinUpdateModule from '@/components/monetization/monetization-popin-update-module.vue';
import MonetizatizationAlertWarningUpdateModule from '@/components/monetization/monetization-alert-warning-update-module.vue';
import MonetizationBannerInformation from '@/components/monetization/monetization-banner-information.vue';
import PsToast from '@/components/commons/ps-toast.vue';
import AppGettersTypes from '@/store/modules/app/getters-types';
import AccountsGettersTypes from '@/store/modules/accounts/getters-types';

export default defineComponent({
  name: 'MonetizationMessage',
  components: {
    MonetizationBannerInformation,
    MonetizationPopinUpdateModule,
    MonetizatizationAlertWarningUpdateModule,
    PsToast,
  },
  props: {
    page: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      moduleIsUpdated: false,
      modaleIsClosed: false,
    };
  },
  computed: {
    ...mapGetters('app', [
      AppGettersTypes.GET_BILLING_SUBSCRIPTION_ACTIVE,
    ]),
    moduleNeedUpgrade() {
      return this.$store.getters[`app/${AppGettersTypes.GET_MODULE_NEED_UPGRADE}`](this.$store.state.app.psxMktgWithGoogleModuleVersionNeeded);
    },
    googleAccountIsOnboarded() {
      return this.$store.getters[`accounts/${AccountsGettersTypes.GET_GOOGLE_ACCOUNT_IS_ONBOARDED}`];
    },
  },
  methods: {
    clickModuleUpdated() {
      this.moduleIsUpdated = true;
    },
  },
});
</script>
