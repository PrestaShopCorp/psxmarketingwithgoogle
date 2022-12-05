<template>
  <b-form>
    <p class="h3 mb-2 font-weight-600">
      {{ $t('productFeedSettings.shippingSetup.title') }}
    </p>
    <b-form-group
      :label="$t('productFeedSettings.shippingSetup.mandatoryStep')"
      label-class="h1 font-weight-600 mb-0 d-block p-0 bg-transparent border-0"
    >
      <p class="mb-1">
        {{ $t('productFeedSettings.shippingSetup.stepExplanation') }}
      </p>
      <p class="mb-2 ps_gs-fz-12 font-italic text-muted">
        {{ $t('productFeedSettings.submissionExplanation') }}
      </p>
      <div
        class="p-3 mb-2 border rounded ps_gs-shipping-setup-option"
        :class="[{'selected':shippingSetup === ShippingSetupOption.ESTIMATE}]"
      >
        <b-form-radio
          v-model="shippingSetup"
          @input="chosenShippingSetup = $event.target.value"
          name="shippingSettingsRadio"
          :value="ShippingSetupOption.ESTIMATE"
        >
          <div>
            <span class="font-weight-600 mb-2">
              {{ $t('productFeedSettings.shippingSetup.estimateOption.title') }}
            </span>
            <VueShowdown
              class="text-muted ps_gs-fz-12 mb-0"
              :markdown="$t('productFeedSettings.shippingSetup.estimateOption.description')"
            />
          </div>
        </b-form-radio>
      </div>
      <div
        class="p-3 mb-2 border rounded ps_gs-shipping-setup-option"
        :class="[{'selected':shippingSetup === ShippingSetupOption.IMPORT}]"
      >
        <b-form-radio
          v-model="shippingSetup"
          @input="chosenShippingSetup = $event.target.value"
          name="shippingSettingsRadio"
          :value="ShippingSetupOption.IMPORT"
        >
          <div>
            <span class="font-weight-600 mb-2">
              {{ $t('productFeedSettings.shippingSetup.importOption.title') }}
            </span>
            <VueShowdown
              class="text-muted ps_gs-fz-12 mb-0"
              :markdown="$t('productFeedSettings.shippingSetup.importOption.description')"
            />
          </div>
        </b-form-radio>
      </div>
    </b-form-group>
    <p
      v-if="displayValidationErrors && !stepIsValid"
      class="text-danger text-small ps_gs-fz-12 d-md-flex justify-content-end"
    >
      <!-- eslint-disable-next-line max-len -->
      {{ $t('productFeedSettings.shippingSetup.validationErrors.needOptionToBeChosen') }}
    </p>
    <actions-buttons
      :next-step="nextStep"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
  </b-form>
</template>

<script lang="ts">
import {VueShowdown} from 'vue-showdown';
import {BFormRadio, BFormGroup} from 'bootstrap-vue';
import {defineComponent} from 'vue';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {ShippingSetupOption} from '@/enums/product-feed/shipping';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';

export default defineComponent({
  name: 'ShippingSetup',
  components: {
    ActionsButtons,
    VueShowdown,
    BFormRadio,
    BFormGroup,
  },
  data() {
    return {
      tax: null,
      chosenShippingSetup: null,
      loading: false,
      displayValidationErrors: false,
      ShippingSetupOption,
    };
  },
  computed: {
    stepIsValid() {
      return this.shippingSetup !== null;
    },
    shippingSetup(): ShippingSetupOption|null {
      if (this.chosenShippingSetup) {
        return this.chosenShippingSetup;
      }
      // Handle potential value from store.
      const initialValue = getDataFromLocalStorage('productFeed-shippingSetup') ?? this.$store.state.productFeed.settings.shippingSetup;

      if (initialValue) {
        return initialValue;
      }

      // Backward compatibility of data coming from Product Feed funnel
      // when we only had manuel or automatic import of shipping settings
      const initialOldValue: boolean = getDataFromLocalStorage('productFeed-autoImportShippingSettings') ?? !!this.$store.state.productFeed.settings.autoImportShippingSettings;

      if (initialOldValue === true) {
        return ShippingSetupOption.IMPORT;
      }
      return null;
    },
  },
  methods: {
    validateStep(): boolean {
      this.displayValidationErrors = true;

      return this.stepIsValid;
    },
    cancel(): void {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    nextStep(): void {
      if (this.validateStep() === false) {
        return;
      }
      this.loading = true;
      this.$store.commit('productFeed/SET_SHIPPING_SETUP_SELECTED', this.shippingSetup);
      this.$segment.track('[GGL] Product feed config - Step 1 with Config my shipping settings now', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$store.dispatch('productFeed/GET_SAVED_ADDITIONAL_SHIPPING_SETTINGS').then(() => {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
        this.$router.push({
          name: 'product-feed-settings',
          params: {
            step: ProductFeedSettingsPages.SHIPPING_SETTINGS,
          },
        });
        window.scrollTo(0, 0);
      });
    },
  },
  watch: {
    chosenShippingSetup() {
      this.displayValidationErrors = false;
    },
  },

});
</script>
