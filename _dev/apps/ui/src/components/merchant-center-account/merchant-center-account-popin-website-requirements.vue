<template>
  <ps-modal
    id="MerchantCenterAccountPopinNewMca"
    :title="popinTitle"
    v-bind="$attrs"
    @close="cancel"
    ref="modal"
    footer-class="flex-sm-nowrap"
    footer-border-variant="0"
    size="lg"
  >
    <ps-stepper
      v-if="newMca"
      :active-step="stepActiveData"
      :steps="steps()"
      @changeStep="stepToChange($event)"
    />

    <StepRequirements
      v-if="stepActiveData === 1"
      :new-mca="newMca"
      @stepRequirementsValidation="stepRequirementsValidation"
    />

    <StepStoreInfo
      v-else-if="stepActiveData === 2"
      @stepStoreInfoValidation="stepStoreInfoValidation"
    />
    <template
      slot="modal-footer"
      v-if="stepActiveData === 1"
    >
      <a
        class="ps_gs-fz-12 mr-sm-auto"
        :href="$options.googleUrl.googleWebsiteRequirements"
        target="_blank"
      >
        {{ $t('mcaRequirements.footer') }}
      </a>
      <b-button
        size="sm"
        v-if="newMca"
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <span
        v-if="newMca"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="isBtnStepRequirementsDisabled ? $t('tooltip.mustCheckAllRequirements') : ''"
      >
        <b-button
          size="sm"
          variant="primary"
          @click="saveFirstStep()"
          :disabled="isBtnStepRequirementsDisabled"
        >
          {{ $t('cta.storeMeetsRequirements') }}
        </b-button>
      </span>
    </template>
    <template
      slot="modal-footer"
      v-else-if="stepActiveData === 2"
    >
      <b-button
        size="sm"
        variant="outline-secondary"
        @click="cancel()"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <div
        class="flex-shrink-0"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="isBtnStepstoreInfoDisabled ? $t('tooltip.mustAgreeGoogleTerms') : ''"
      >
        <b-button
          size="sm"
          variant="primary"
          @click="ok()"
          :disabled="isBtnStepstoreInfoDisabled"
        >
          <template v-if="isCreating">
            {{ $t('cta.creating') }}
            <span class="ml-1 icon-busy" />
          </template>
          <template v-else>
            {{ $t('cta.createAccount') }}
          </template>
        </b-button>
      </div>
    </template>
  </ps-modal>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';
import PsModal from '@/components/commons/ps-modal.vue';
import PsStepper from '@/components/commons/ps-stepper.vue';
import StepRequirements from '@/components/merchant-center-account/website-requirements/step-requirements.vue';
import StepStoreInfo from '@/components/merchant-center-account/website-requirements/step-store-info.vue';
import WebsiteRequirementsSteps from '@/enums/stepper/website-requirements-steps';
import WebsiteRequirements from '@/enums/merchant-center-account/website-requirements';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default defineComponent({
  name: 'MerchantCenterAccountPopinWebsiteRequirements',
  components: {
    PsModal,
    PsStepper,
    StepRequirements,
    StepStoreInfo,
  },
  data() {
    return {
      isCreating: false,
      stepActiveData: 1,
      isBtnStepRequirementsDisabled: true,
      isBtnStepstoreInfoDisabled: true,
      containsAdultContent: false,
    };
  },
  props: {
    stepActive: {
      type: Number,
      default: 1,
    },
    newMca: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    steps() {
      const steps = [];
      Object.keys(WebsiteRequirementsSteps).forEach((key) => {
        steps.push({
          title: this.$i18n.t(`mcaRequirements.steps.${WebsiteRequirementsSteps[key]}`),
        });
      });

      return steps;
    },
    stepRequirementsValidation(allRequirementsNotChecked) {
      this.isBtnStepRequirementsDisabled = allRequirementsNotChecked;
    },
    stepStoreInfoValidation(allFieldsNotFilled, containsAdultContent) {
      this.isBtnStepstoreInfoDisabled = allFieldsNotFilled;
      this.containsAdultContent = containsAdultContent;
      this.$segment.track('[GGL] Create GMC - Step 2 Confirm Store Information', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    saveFirstStep() {
      this.$segment.track('[GGL] Create GMC - Step 1', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.stepActiveData = 2;
    },
    stepToChange(value) {
      this.stepActiveData = value;
    },
    ok() {
      this.$segment.track('[GGL] Start Create GMC', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.isCreating = true;
      const payload = {
        shop_url: this.shopInformations.shop.url,
        shop_name: this.shopInformations.shop.name,
        location: this.shopInformations.store.country.iso_code,
        adult_content: this.containsAdultContent,
        address: this.shopInformations.store.streetAddress,
        phone: this.shopInformations.store.phone,
        postal_code: this.shopInformations.store.postalCode,
        locality: this.shopInformations.store.locality,
      };

      if (this.shopInformations.store?.region) {
        payload.region = this.shopInformations.store.region;
      }

      this.$store.dispatch('accounts/REQUEST_TO_SAVE_NEW_GMC', payload).then(() => {
        this.isCreating = false;
        this.$refs.modal.hide();
      });
    },
    cancel() {
      this.$refs.modal.hide();
      this.stepActiveData = 1;
    },
    saveChangeExistingGmc() {
      /**
       * TODO: Save change when existing GMC
       */
    },
  },
  computed: {
    popinTitle() {
      return this.newMca ? this.$i18n.t('mcaRequirements.title') : this.$i18n.t('mcaRequirements.steps.websiteRequirements');
    },
    shopInformations() {
      return this.$store.getters['accounts/GET_SHOP_INFORMATIONS'];
    },
    requirements() {
      return Object.values(WebsiteRequirements);
    },
  },
  mounted() {
    this.stepActiveData = this.stepActive;
    if (this.newMca === true) {
      this.$store.dispatch('accounts/REQUEST_WEBSITE_REQUIREMENTS').then(() => {
        this.isBtnStepRequirementsDisabled = !(this.$store.getters['accounts/GET_WEBSITE_REQUIREMENTS'].length === this.requirements.length);
      });
    }
  },
  googleUrl,
});
</script>
