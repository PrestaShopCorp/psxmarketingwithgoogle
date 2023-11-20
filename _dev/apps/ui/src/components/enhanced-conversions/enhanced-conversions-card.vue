<template>
  <section v-if="GET_ENHANCED_CONVERSIONS_STATUS !== null">
    <b-card no-body class="ps_gs-onboardingcard p-3">
      <div
        class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
      >
        <div class="d-flex align-items-center">
          <span class="material-icons-round ps_gs-fz-32 mr-2"> touch_app </span>
          <b-card-text
            class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0"
          >
            {{ $t("enhancedConversionTrackingCard.title") }}
          </b-card-text>
        </div>
      </div>

      <div class="ml-2 mb-3 ps_gs-onboardingcard__content">
        <VueShowdown
          tag="p"
          :markdown="$t('enhancedConversionTrackingCard.intro')"
          class="mb-0"
          :extensions="['no-p-tag']"
        />
        <b-form-checkbox
          switch
          size="lg"
          class="mt-3 ps_gs-switch"
          :checked="GET_ENHANCED_CONVERSIONS_STATUS"
          @click.native.prevent="toggleFeature"
          :disabled="toggleIsDisabled"
        >
          <span class="ps_gs-fz-14 text-dark d-block">
            {{
              GET_ENHANCED_CONVERSIONS_STATUS
                ? $t("cta.enabled")
                : $t("cta.disabled")
            }}
          </span>
        </b-form-checkbox>
      </div>
      <alert-sign-gads-tos
        v-if="!GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED"
      />
      <alert-ec-ready
        v-else-if="showReadyToEnableFeature"
        :is-on-configuration-page="true"
      />
    </b-card>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import GettersTypesCampaigns from "@/store/modules/campaigns/getters-types";
import GettersTypesGoogleAds from "@/store/modules/google-ads/getters-types";
import AlertEcReady from "@/components/enhanced-conversions/alert-ec-ready.vue";
import AlertSignGadsTos from "@/components/enhanced-conversions/alert-sign-gads-tos.vue";

export default defineComponent({
  name: "EnhancedConversionsCard",
  components: {
    AlertEcReady,
    AlertSignGadsTos
},
  data() {
    return {
      showReadyToEnableFeature: false as boolean,
    };
  },
  computed: {
    ...mapGetters("campaigns", [
      GettersTypesCampaigns.GET_ENHANCED_CONVERSIONS_STATUS,
    ]),
    ...mapGetters("googleAds", [
      GettersTypesGoogleAds.GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED,
    ]),
    toggleIsDisabled(): boolean {
      return !this.GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED;
    },
  },
  methods: {
    async toggleFeature(): Promise<void> {
      if (this.toggleIsDisabled) {
        return;
      }
      await this.$store.dispatch(
        "campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS",
        !this.GET_ENHANCED_CONVERSIONS_STATUS,
      );
    },
  },
  watch: {
    GET_CONVERSIONS_TERMS_OF_SERVICES_SIGNED(newValue: boolean): void {
      if (newValue) {
        this.showReadyToEnableFeature = true;
      }
    },
  },
});
</script>
