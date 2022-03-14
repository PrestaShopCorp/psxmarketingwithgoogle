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
    <div class="d-flex align-items-center">
      <img
        :src="require(`@/assets/images/${pngBanner}`)"
        alt=""
        :width="size === 'xs' ? 70 : ''"
      >
      <span>
        <h3 class="font-weight-600">
          {{ $t("banner.titleAdsbanner") }}
        </h3>

        <p>
          {{ $t("banner.textAdsBanner", [$t("banner.priceAdsBanner")]) }}
        </p>
        <p class="ps_gs-fz-10">
          {{
            $t("banner.legendConfigured")

          }}
        </p>
      </span>

      <img
        v-if="size !== 'xs'"
        class="align-self-start"
        src="@/assets/images/banner/dots.png"
        alt=""
        height="70"
      >
    </div>
  </b-card>
</template>

<script>
import {searchImage} from '@/utils/ImageFromCurrency';

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
  },
  data() {
    return {

    };
  },
  computed: {
    pngBanner() {
      return searchImage(this.$store.state.app.psxMktgWithGoogleShopCurrency.isoCode, 0);
    },
  },
  methods: {
    closeBanner() {
      this.$emit('closeBanner');
    },
  },
};
</script>
