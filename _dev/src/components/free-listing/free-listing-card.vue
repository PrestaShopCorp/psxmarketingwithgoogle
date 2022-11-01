<template>
  <section>
    <b-skeleton-wrapper
      :loading="loading"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3"
        :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
      >
        <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center">
            <img
              class="mr-3"
              :src="isEnabled
                ? require('@/assets/images/google-icon.svg')
                : require('@/assets/images/google-icon-grey.svg')"
              width="32"
              height="32"
              alt=""
            >
            <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
              {{ $t('freeListingCard.title') }}
              <b-badge
                class="ml-3"
                variant="muted"
              >
                {{ $t('badge.free') }}
              </b-badge>
            </b-card-text>
          </div>
          <div
            class="ml-auto mb-0"
            v-if="isEnabled"
          >
            <span
              class="ps-switch ps-switch-sm"
            >
              <input
                @click.prevent="openPopinDisabled"
                :disabled="errorAPI"
                type="radio"
                name="switchEnable"
                :value="false"
                :checked="freeListingStatus == false"
                id="switch_off_freelisting"
              >
              <label for="switch_off_freelisting">{{ $t('cta.disabled') }}</label>
              <input
                @change="toggle"
                :disabled="errorAPI"
                type="radio"
                name="switchEnable"
                :value="true"
                :checked="freeListingStatus == true"
                id="switch_on_freelisting"
              >
              <label for="switch_on_freelisting">{{ $t('cta.enabled') }}</label>
              <span class="slide-button" />

            </span>
          </div>
        </div>
        <p
          class="mb-1"
        >
          {{ $t('freeListingCard.intro') }}
        </p>
        <template v-if="isEnabled">
          <b-alert
            v-if="alert"
            :variant="alert.variant"
            show
            class="mb-0 mt-3"
          >
            <p class="mb-0">
              {{ $t(`freeListingCard.${alert.text}`) }}
            </p>
            <div
              v-if="errorAPI"
              class="d-md-flex text-center align-items-center mt-2"
            >
              <b-button
                size="sm"
                class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
                variant="outline-secondary"
                @click="refresh"
                data-test-id="btn-refresh"
              >
                {{ $t('general.refreshPage') }}
              </b-button>
            </div>
          </b-alert>
          <ul
            class="list-inline text-muted ps_gs-fz-12 mb-0 mt-3"
          >
            <li class="list-inline-item">
              <a
                :href="$options.googleUrl.learnAboutFreeListing"
                target="_blank"
              >
                {{ $t('freeListingCard.learnFreeListing') }}
              </a>
            </li>
          </ul>
        </template>
        <BadgeListRequirements
          v-if="!isEnabled"
          :badges="['productFeed', 'merchantCenterAccount']"
        />
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import BadgeListRequirements from '../commons/badge-list-requirements';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'FreeListingCard',
  components: {
    BadgeListRequirements,
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    alert() {
      if (this.errorAPI) {
        return {
          variant: 'warning',
          text: 'alertCantEnableFreeListing',
        };
      }
      if (this.freeListingStatus === true
      && this.productFeedIsEnabled === false) {
        return {
          variant: 'warning',
          text: 'alertProductFeedDisabled',
        };
      }
      if (this.freeListingStatus === false
      && this.productFeedIsEnabled === true) {
        return {
          variant: 'warning',
          text: 'alertEnableFreeListing',
        };
      }

      // TODO: handle Country not eligible
      // if (1) {
      //   return {
      //     variant: 'warning',
      //     text: 'alertCountryNotEligible',
      //   };
      // }
      return null;
    },
    freeListingStatus() {
      return this.$store.getters['freeListing/GET_FREE_LISTING_STATUS'];
    },
    errorAPI() {
      return this.$store.getters['freeListing/GET_FREE_LISTING_STATUS_API'];
    },
    productFeedIsEnabled() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
  },
  methods: {
    toggle() {
      this.$segment.track('[GGL] Enable Disable Free Listing', {
        module: 'psxmarketingwithgoogle',
        free_listing_activation_value: !this.freeListingStatus,
        params: SegmentGenericParams,
      });
      this.$store.dispatch('freeListing/SEND_FREE_LISTING_STATUS', !this.freeListingStatus);
      this.$store.commit('freeListing/SAVE_ACTIVATED_ONCE', true);
    },
    refresh() {
      this.$router.go();
    },
    openPopinDisabled() {
      this.$emit('openPopin');
    },
  },
  googleUrl,
};
</script>
