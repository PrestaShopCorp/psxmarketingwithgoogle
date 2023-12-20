<template>
  <section>
    <b-alert
      variant="danger"
      show
      v-if="!loading && !languages.length"
    >
      <strong>{{
        $t('productFeedPage.dashboardPage.productFeedConfiguration.alerts.noEligibleLanguagesTitle')
      }}</strong><br>
      <!-- eslint-disable max-len -->
      <i18n
        path="productFeedPage.dashboardPage.productFeedConfiguration.alerts.noEligibleLanguagesDesc"
        class="mt-3 mt-md-0"
        tag="div"
      >
        <router-link
          :to="{ name: 'product-feed-settings',
                 params: { step: ProductFeedSettingsPages.SHIPPING_SETTINGS}}"
          class="external_link-no_icon"
          @click="targetCountryClicked"
        >
          {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.alerts.productFeedCta') }}
        </router-link>
        <b-link
          target="_blank"
          :href="$store.getters['app/GET_LANGUAGES_URL']"
          @click="languageClicked"
        >
          {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.alerts.boSettingsCta') }}
        </b-link>
      </i18n>
    </b-alert>

    <b-alert
      :variant="targetCountriesInError.length === localizationListLengths.countries ? 'danger' : 'warning'"
      show
      v-if="!loading && targetCountriesInError.length"
    >
      <strong>
        {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.alerts.noEligibleCurrenciesTitle') }}
      </strong><br>
      <i18n
        path="productFeedPage.dashboardPage.productFeedConfiguration.alerts.noEligibleCurrenciesDesc"
        class="mt-3 mt-md-0"
        tag="div"
      >
        <router-link
          :to="{ name: 'product-feed-settings',
                 params: { step: ProductFeedSettingsPages.SHIPPING_SETTINGS}}"
          class="external_link-no_icon"
          @click="targetCountryClicked"
        >
          {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.alerts.productFeedCta') }}
        </router-link>
        <b-link
          target="_blank"
          :href="$store.getters['app/GET_CURRENCIES_URL']"
          @click="languageClicked"
        >
          {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.alerts.boSettingsCta') }}
        </b-link>
      </i18n>
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
          <div class="mr-1 d-flex flex-grow-1">
            <div
              class="text-nowrap"
            >
              <i class="material-icons ps_gs-fz-20">language</i>
              <span class="font-weight-600 mr-1">
                {{ $tc(
                  'productFeedPage.dashboardPage.productFeedConfiguration.targetCountries',
                  localizationListLengths.countries) }}
              </span>
            </div>
            <div>
              <b-card
                v-for="(country, index) in targetCountriesDetails"
                :border-variant="country.currencyIsFound ? 'primary' : 'danger'"
                :text-variant="country.currencyIsFound ? 'primary' : 'danger'"
                class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13 mb-2"
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
          </div>

          <div class="flex d-flex-column flex-grow-1">
            <div class="d-flex">
              <div
                class="text-nowrap"
              >
                <i class="material-icons ps_gs-fz-20">translate</i>
                <span class="font-weight-600 mr-1">
                  {{ $tc(
                    'productFeedPage.dashboardPage.productFeedConfiguration.languages',
                    localizationListLengths.languages) }}
                </span>
              </div>
              <span
                v-if="!languages.length"
                data-test-id="pf-config-no-lang"
                class="text-danger"
              >
                {{ $t('productFeedPage.dashboardPage.productFeedConfiguration.noLanguage') }}
              </span>
              <div
                v-else
              >
                <b-card
                  v-for="(language, index) in languages"
                  border-variant="primary"
                  class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13 mb-2"
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
              </div>
            </div>
          </div>
        </div>
      </b-skeleton-wrapper>
    </div>
  </section>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

import {IncrementalSyncContext} from './feed-configuration';
import {timeConverterToDate, timeConverterToHour} from '@/utils/Dates';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import {changeCountryCodeToName, getCurrencyFromCountry} from '@/utils/Countries';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

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
    targetCountriesInError(): string[] {
      return [...new Set(this.targetCountriesDetails
        .filter((countryDetails) => !countryDetails.currencyIsFound)
        .map((countryDetails) => countryDetails.countryName),
      )];
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
  watch: {
    loading(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        this.$segment.identify(this.$store.state.accounts.shopIdPsAccounts, {
          ggl_sync_has_currencies_issues: !!this.targetCountriesInError.length,
          ggl_sync_has_languages_issues: !this.languages.length,
        });
      }
    },
  },
});
</script>
