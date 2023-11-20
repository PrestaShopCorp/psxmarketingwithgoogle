<template>
    <section v-if="GET_ENHANCED_CONVERSIONS_STATUS !== null">
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3"
      >
        <div
          class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
        >
          <div class="d-flex align-items-center">
            <span class="material-icons-round ps_gs-fz-32 mr-2">
                touch_app
            </span>
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t('enhancedConversionTrackingCard.title') }}
            </b-card-text>
          </div>
        </div>
  
        <div class="ml-2 ps_gs-onboardingcard__content">
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
          >
            <span class="ps_gs-fz-14 text-dark d-block">
              {{ GET_ENHANCED_CONVERSIONS_STATUS ?
                $t('cta.enabled') :
                $t('cta.disabled')
              }}
            </span>
          </b-form-checkbox>
        </div>
      </b-card>
    </section>
  </template>
  
  <script lang="ts">
  import {defineComponent} from 'vue';
  import {mapGetters} from 'vuex';
  import GettersTypesCampaigns from '@/store/modules/campaigns/getters-types';

  export default defineComponent({
    name: 'EnhancedConversionsCard',
    components: {
    },
    computed: {
      ...mapGetters('campaigns', [
        GettersTypesCampaigns.GET_ENHANCED_CONVERSIONS_STATUS,
      ]),
    },
    methods: {
      async toggleFeature(): Promise<void> {
        await this.$store.dispatch('campaigns/SAVE_ENHANCED_CONVERSIONS_STATUS', !this.GET_ENHANCED_CONVERSIONS_STATUS);
      }, 
    },
  });
  </script>
  