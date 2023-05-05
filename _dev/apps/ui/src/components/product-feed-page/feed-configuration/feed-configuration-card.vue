<template>
  <section>
    <div
      class="d-flex flex-column border border-600-20 rounded mb-2 px-3 py-2 d-flex bg-prestashop-bg"
    >
      <b-skeleton-wrapper
        :loading="loading"
      >
        <template #loading>
          <b-skeleton width="30%" class="mb-3" />
          <div
            class="d-flex"
          >
            <b-skeleton width="50%" class="mr-3"/>
            <b-skeleton width="50%" />
          </div>
        </template>

        <div class="mb-3">
          <span class="font-weight-600 mb-1 mr-2 h3">
            {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.title') }}
          </span>
          <span
            class="ps_gs-fz-12"
            v-if="productFeedConfiguration"
          >
            {{ lastModificationDate }}, {{ lastModificationTime }}
          </span>
        </div>
  
        <div class="d-flex justify-content-between">
          <div class="flex-grow-1">
            <i class="material-icons ps_gs-fz-20">language</i>
            <span class="font-weight-600">
              {{ $tc('productFeedPage.dashboardPage.productFeedConfiguration.targetCountries', localizationListLengths.countries) }}
            </span>
            <b-card
              v-for="country in targetCountriesNames"
              border-variant="primary"
              class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13"
            >
              {{ country }}
            </b-card>
          </div>
  
          <div class="flex-grow-1">
            <i class="material-icons ps_gs-fz-20">translate</i>
            <span class="font-weight-600">
              {{ $tc('productFeedPage.dashboardPage.productFeedConfiguration.languages', localizationListLengths.languages) }}
            </span>
            <b-card
              v-for="language in languages"
              border-variant="primary"
              class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13"
            >
              {{ language }}
            </b-card>
          </div>
        </div>
      </b-skeleton-wrapper>
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from '@vue/composition-api';
import { defineComponent } from 'vue';

import {ProductFeedConfiguration} from './feed-configuration'
import {timeConverterToDate, timeConverterToHour} from '@/utils/Dates';
import {changeCountriesCodesToNames} from '@/utils/Countries';

export default defineComponent({
  props: {
    productFeedConfiguration: {
      type: [Object, null] as PropType<ProductFeedConfiguration>,
      required: false,
      default: null,
    },
    loading: {
      type: Boolean,
    },
  },
  computed: {
    targetCountries(): string[] {
      return this.productFeedConfiguration?.targetCountries || [];
    },
    languages(): string[] {
      return this.productFeedConfiguration?.languages || [];
    },
    localizationListLengths() {
      return {
        countries: this.targetCountries.length,
        languages: this.languages.length,
      };
    },
    lastModificationDate() {
      return timeConverterToDate(this.productFeedConfiguration?.lastModificationDate);
    },
    lastModificationTime() {
      return timeConverterToHour(this.productFeedConfiguration?.lastModificationDate);
    },
    targetCountriesNames() {
      return changeCountriesCodesToNames(this.targetCountries);
    },
  },
});
</script>
