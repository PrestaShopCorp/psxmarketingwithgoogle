<template>
  <b-col
    cols
    class="ps_gs-productfeed-report-card ps_gs-productfeed-report-card--full"
  >
    <div class="px-3 py-2">
      <div class="ps_gs-fz-13 font-weight-600">
        <b-iconstack
          v-if="hasMapping"
          font-scale="1.5"
          class="mr-1 fixed-size text-success"
          width="16"
          height="16"
        >
          <b-icon-circle-fill stacked />
          <b-icon-check
            stacked
            variant="white"
          />
        </b-iconstack>
        {{ $t('productFeedCard.googleTaxonomyAssociation') }}
        <span
          class="text-primary-600 font-italic font-weight-normal"
        >-&nbsp;{{ $t('productFeedCard.optional') }}</span>
      </div>
      <div
        v-if="hasMapping"
        class="mt-3 d-sm-flex align-items-end text-center"
      >
        <div class="flex-grow-1">
          <span class="text-success ps_gs-fz-16 font-weight-600">
            {{
              $t("productFeedCard.mappedCategories", [
                categoriesMapped,
                categoriesTotal,
              ])
            }}
          </span>
          <b-progress
            :value="categoriesMapped"
            :max="categoriesTotal"
            variant="success"
            class="mt-2 w-75 mx-auto"
          />
        </div>
        <b-button
          class="mt-3 ml-sm-4 mt-sm-0"
          variant="outline-secondary"
        >
          {{ $t("cta.modifyMapping") }}
        </b-button>
      </div>
      <div
        v-else
        class="d-sm-flex align-items-end"
      >
        <p class="ps_gs-fz-12 mb-0 flex-grow-1">
          {{ $t('productFeedCard.attributeDescription') }}<br>
          <a
            :href="$options.googleUrl.googleProductCategories"
            target="_blank"
            class="text-primary-600"
          >
            {{ $t('cta.aboutProductCategory') }}
          </a>
        </p>
        <b-button
          class="mx-auto mt-3 ml-sm-4 mr-sm-0 mt-sm-0 d-block"
          variant="outline-secondary"
        >
          {{ $t("cta.addMapping") }}
        </b-button>
      </div>
    </div>
  </b-col>
</template>

<script>
import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
} from 'bootstrap-vue';
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  name: 'ProductFeedCardReportMappedCategoriesCard',
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
  },
  props: {
    hasMapping: {
      type: Boolean,
      required: false,
      default: false,
    },
    categoriesMapped: {
      type: Number,
      required: false,
      default: 0,
    },
    categoriesTotal: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  googleUrl,
};
</script>
