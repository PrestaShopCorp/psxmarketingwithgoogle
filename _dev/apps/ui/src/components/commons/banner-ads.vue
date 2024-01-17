<template>
  <b-card
    class="border-0"
    :class="{ 'shadow-sm mb-3' : size !== 'xs' }"
  >
    <button
      v-if="isBanner"
      type="button"
      class="close"
      aria-label="Close"
      @click="closeBanner"
    >
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="d-flex flex-column flex-md-row align-items-center">
      <img
        :src="pathToAdsPromotionImage"
        alt="banner-price"
        :height="size === 'xs' ? 90 : 140"
        :width="size === 'xs' ? 90 : 140"
        class="mr-md-4 mb-3 mb-md-0"
      >
      <div>
        <h3 class="font-weight-600">
          {{ $t("banner.titleAdsbanner") }}
        </h3>
        <VueShowdown
          :markdown="version === 'short'
            ? $t('banner.textAdsBanner', [priceForAds])
            : $t('banner.textAdsBannerLong', [
              priceForAds, $options.googleUrl.googleAdsAccount
            ])"
          :extensions="['extended-link']"
        />
        <VueShowdown
          class="ps_gs-fz-10"
          :markdown="version === 'short'
            ? $t('banner.legend',[$options.googleUrl.googleAdsTermsAndCondition])
            : $t('banner.legendLong',[$options.googleUrl.googleAdsTermsAndCondition])"
          :extensions="['extended-link']"
        />
      </div>

      <img
        v-if="size !== 'xs'"
        class="align-self-start d-none d-md-block"
        src="@/assets/images/banner/dots.png"
        alt=""
        height="70"
      >
    </div>
  </b-card>
</template>

<script>
import {getPathToAdsPromotionImage} from '@/utils/ImageFromCurrency';
import {searchPrice} from '@/utils/PriceFromCurrency';
import googleUrl from '../../assets/json/googleUrl.json';

export default {
  props: {
    isBanner: {
      type: Boolean,
      required: true,
      default: false,
    },
    size: {
      type: String,
      required: false,
      default: null,
    },
    version: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {

    };
  },
  computed: {
    pathToAdsPromotionImage() {
      return getPathToAdsPromotionImage(
        this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode,
      );
    },
    priceForAds() {
      return searchPrice(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode);
    },
  },
  methods: {
    closeBanner() {
      this.$emit('closeBanner');
    },
  },
  googleUrl,

};
</script>
