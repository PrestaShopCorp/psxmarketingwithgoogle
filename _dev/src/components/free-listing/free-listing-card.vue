<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
  >
    <div
      class="d-md-flex flex-wrap align-items-center justify-content-between mb-3"
    >
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="isEnabled
            ? require('@/assets/images/google-shopping-icon.svg')
            : require('@/assets/images/google-shopping-icon-grey.svg')"
          width="40"
          height="40"
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
        v-if="!firstTime"
        class="form-group ml-auto mb-md-0"
      >
        <span class="ps-switch ps-switch-sm">
          <input
            type="radio"
            name="switchEnable"
            v-model="enabledFreeListing"
            :value="false"
          >
          <label for="example_off_3">{{ $t('cta.disabled') }}</label>
          <input
            type="radio"
            name="switchEnable"
            v-model="enabledFreeListing"
            :value="true"
            checked
          >
          <label for="example_on_3">{{ $t('cta.enabled') }}</label>
          <span class="slide-button" />
        </span>
      </div>
    </div>
    <p
      class="ps_gs-fz-12"
      :class="isEnabled ? 'mb-0' : 'mb-2'"
    >
      {{ $t('freeListingCard.intro') }}
    </p>
    <template v-if="isEnabled">
      <ul
        class="list-inline text-muted ps_gs-fz-12 mb-0"
      >
        <li class="list-inline-item">
          <a
            href="//google.com"
            target="_blank"
          >
            {{ $t('freeListingCard.learnFreeListing') }}
          </a>
        </li>
        <li class="list-inline-item">
          <a
            href="//google.com"
            target="_blank"
          >
            {{ $t('freeListingCard.seeFreeListing') }}
          </a>
        </li>
      </ul>
      <div
        v-if="firstTime"
        class="d-md-flex justify-content-md-end align-items-center text-center mt-3"
      >
        <p class="text-muted ps_gs-fz-12 mb-3 mb-md-0 text-left">
          {{ $t('freeListingCard.googleDelay') }}
        </p>
        <b-button
          size="sm"
          :disabled="ctaIsDisabled"
          variant="primary"
          class="ml-md-3"
        >
          {{ $t('cta.enableFreeListing') }}
        </b-button>
      </div>
      <b-alert
        v-if="alert"
        :variant="alert.variant"
        show
        class="mb-0 mt-3"
      >
        <p class="mb-0">
          {{ $t(`freeListingCard.${alert.text}`) }}
        </p>
      </b-alert>
    </template>
    <div
      v-if="!isEnabled"
      class="d-flex mt-3"
    >
      <span
        class="mr-2"
      >
        <b-icon-exclamation-circle />
      </span>
      <ul class="list-inline mb-0">
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge
            variant="muted"
          >
            {{ $t('badge.productFeed') }}
          </b-badge>
        </li>
        <li
          class="list-inline-item"
          v-b-tooltip.hover
          title="Tooltip directive content"
        >
          <b-badge
            variant="muted"
          >
            {{ $t('badge.mca') }}
          </b-badge>
        </li>
      </ul>
    </div>
  </b-card>
</template>

<script>
import {
  BIconExclamationCircle,
} from 'bootstrap-vue';

export default {
  name: 'FreeListingCard',
  data() {
    return {
      ctaIsDisabled: false,
    };
  },
  components: {
    BIconExclamationCircle,
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    firstTime: {
      type: Boolean,
      default: true,
    },
    alert: {
      type: Object,
      default: null,
    },
    enabledFreeListing: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
