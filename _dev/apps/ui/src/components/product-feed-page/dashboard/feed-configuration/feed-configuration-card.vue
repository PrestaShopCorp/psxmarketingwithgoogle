<template>
  <section>
    <b-alert
      variant="danger"
      show
      v-if="!loading && !languages.length"
    >
      <p class="mb-0">
        {{
          $tc('productFeedSettings.preScan.langConflict',
              targetCountries.length,
              [targetCountriesDetails.map((country) => country.countryName).join(', ')]
          )
        }}
      </p>
    </b-alert>
    <div
      class="d-flex flex-column border border-600-20 mb-4 px-3 py-2 d-flex"
    >
      <b-skeleton-wrapper
        :loading="loading"
      >
        <template #loading>
          <b-skeleton
            width="30%"
            class="mb-3"
          />
          <div
            class="d-flex"
          >
            <b-skeleton
              width="50%"
              class="mr-3"
            />
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
            data-test-id="pf-config-date"
          >
            {{ lastModificationDate }}, {{ lastModificationTime }}
          </span>
        </div>

        <div class="d-flex justify-content-between">
          <div class="mr-1 mb-1">
            <i class="material-icons ps_gs-fz-20">language</i>
            <span class="font-weight-600 mr-1">
              {{ $tc(
                'productFeedPage.dashboardPage.productFeedConfiguration.targetCountries',
                localizationListLengths.countries) }}
            </span>
            <b-card
              v-for="(country, index) in targetCountriesDetails"
              :border-variant="country.currencyIsFound ? 'primary' : 'danger'"
              :text-variant="country.currencyIsFound ? 'primary' : 'danger'"
              class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13"
              :key="index"
              data-test-id="pf-config-country"
            >
              {{ country.countryName }} ({{ country.currency }})
              <router-link
                :to="{ name: 'product-feed-settings',
                       params: { step: ProductFeedSettingsPages.SHIPPING_SETTINGS}}"
                class="stretched-link external_link-no_icon"
                @click="targetCountryClicked"
              />
            </b-card>
          </div>

          <div class="flex d-flex-column flex-grow-1">
            <div class="mb-1">
              <i class="material-icons ps_gs-fz-20">translate</i>
              <span class="font-weight-600 mr-1">
                {{ $tc(
                  'productFeedPage.dashboardPage.productFeedConfiguration.languages',
                  localizationListLengths.languages) }}
              </span>
              <span
                v-if="!languages.length"
                data-test-id="pf-config-no-lang"
                class="text-danger"
              >
                {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.noLanguage') }}
              </span>
              <template
                v-else
              >
                <b-card
                  v-for="(language, index) in languages"
                  border-variant="primary"
                  class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13"
                  :key="index"
                  data-test-id="pf-config-lang"
                >
                  {{ language }}
                  <b-link
                    target="_blank"
                    :href="$store.getters['app/GET_LANGUAGES_URL']"
                    class="stretched-link external_link-no_icon"
                    @click="languageClicked"
                  />
                </b-card>
              </template>
            </div>
          </div>
        </div>
      </b-skeleton-wrapper>
    </div>
  </section>
</template>

<script lang="ts">
import {PropType} from '@vue/composition-api';
import {defineComponent} from 'vue';

import {IncrementalSyncContext} from './feed-configuration';
import {timeConverterToDate, timeConverterToHour} from '@/utils/Dates';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import {changeCountryCodeToName, getCurrencyFromCountry} from '@/utils/Countries';

export default defineComponent({
  props: {
    productFeedConfiguration: {
      type: [Object, null] as PropType<IncrementalSyncContext>,
      required: false,
      default: null,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      ProductFeedSettingsPages,
    };
  },
  computed: {
    targetCountries(): string[] {
      return this.productFeedConfiguration?.targetCountries || [];
    },
    languages(): string[] {
      return this.productFeedConfiguration?.languages || [];
    },
    currencies(): string[] {
      return this.productFeedConfiguration?.currencies || [];
    },
    localizationListLengths() {
      return {
        countries: this.targetCountries.length,
        languages: this.languages.length,
        currencies: this.currencies.length,
      };
    },
    lastModificationDate() {
      return timeConverterToDate(this.productFeedConfiguration?.lastModificationDate);
    },
    lastModificationTime() {
      return timeConverterToHour(this.productFeedConfiguration?.lastModificationDate);
    },
    targetCountriesDetails() {
      return this.targetCountries.map((country) => {
        const currency = getCurrencyFromCountry(country);

        return {
          countryName: changeCountryCodeToName(country),
          currency: currency || '?',
          currencyIsFound: currency && this.currencies.includes(currency),
        };
      });
    },
  },
  methods: {
    targetCountryClicked(): void {
      this.$segment.track('[GGL] Edit target countries from Product Feed Tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    languageClicked(): void {
      this.$segment.track('[GGL] Edit languages from Product Feed Tab', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
  },
});
</script>
