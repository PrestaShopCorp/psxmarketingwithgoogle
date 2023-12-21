<template>
  <section>
    <b-card
      no-body
      class="ps_gs-onboardingcard"
    >
      <template #header>
        <ol class="mb-0 list-inline d-flex align-items-center ps_gs-breadcrumb">
          <li class="list-inline-item ps_gs-breadcrumb__item">
            <b-link
              :to="{name: 'product-feed'}"
              class="d-flex align-items-center ps_gs-breadcrumb__link"
            >
              {{ $t('productFeedSettings.breadcrumb1') }}
            </b-link>
          </li>
          <li class="list-inline-item ps_gs-breadcrumb__item">
            {{ $t('productFeedPage.breadcrumb.nonCompliantProducts') }}
          </li>
        </ol>
      </template>
      <b-card-body
        class="p-3"
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div>
            {{ $t('productFeedPage.compliancyIssuesPage.details') }}
          </div>
          <b-dropdown
            :text="languageSelectionDropdownText"
            class="ml-5"
            variant="outline-primary"
            toggle-class="text-nowrap"
            :disabled="loading || !issues || !issues.length"
          >
            <b-dropdown-form>
              <b-form-radio
                v-model="selectedLanguage"
                :value="null"
                name="campaignType"
              >
                {{ $t('productFeedPage.approvalTable.filterAllStatus') }}
              </b-form-radio>
            </b-dropdown-form>
            <b-dropdown-form
              v-for="lang in languages"
              :key="lang"
            >
              <b-form-radio
                v-model="selectedLanguage"
                :value="lang"
                name="campaignType"
              >
                {{ changeLanguageCodeToName(lang) }}
              </b-form-radio>
            </b-dropdown-form>
          </b-dropdown>
        </div>

        <b-table-simple
          id="table-non-compliant-products"
          class="mb-3 card"
          responsive="xl"
        >
          <b-thead class="card-header">
            <b-tr>
              <b-th
                v-for="(columnText, index) in filtersHeaderList"
                :key="index"
                class="font-weight-600"
              >
                <div class="flex align-items-center text-nowrap">
                  <span>
                    {{ columnText }}
                  </span>
                </div>
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody class="bg-white">
            <template
              v-if="loading"
            >
              <b-tr
                v-for="index in 5"
                :key="index"
                class="justify-content-between align-items-center py-3"
              >
                <b-td
                  v-for="(text, textIndex) in filtersHeaderList"
                  :key="textIndex"
                >
                  <b-skeleton
                    class="mb-0 mx-1"
                    width="100%"
                    :height="`${(textIndex===1 ? '5em' : undefined)}`"
                  />
                </b-td>
              </b-tr>
            </template>

            <table-api-error
              v-else-if="apiFailed"
              :colspan="filtersHeaderList.length"
            />

            <template v-else-if="!issues || !issues.length">
              <tr>
                <td
                  :colspan="filtersHeaderList.length"
                  class="py-5 text-center text-secondary"
                >
                  <div>
                    <i class="material-icons ps_gs-fz-48">layers_clear</i>
                  </div>
                  <div
                    class="ps_gs-fz-16 font-weight-600"
                  >
                    {{ $t('productFeedPage.compliancyIssuesPage.noResults') }}
                  </div>
                </td>
              </tr>
            </template>
            <template v-else>
              <non-compliant-products-row
                v-for="issue in issues"
                :key="issue.name"
                :verification-issue="issue"
              />
            </template>
          </b-tbody>
        </b-table-simple>
      </b-card-body>
    </b-card>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import NonCompliantProductsRow from './non-compliant-products-row.vue';
import {ProductVerificationIssueOverall} from '@/store/modules/product-feed/state';
import TableApiError from '@/components/commons/table-api-error.vue';

export default defineComponent({
  name: 'NonCompliantProductsPage',
  components: {
    NonCompliantProductsRow,
    TableApiError,
  },
  data() {
    return {
      loading: false as boolean,
      apiFailed: false as boolean,
      selectedLanguage: null as string|null,
    };
  },
  computed: {
    issues(): ProductVerificationIssueOverall[]|null {
      if (!this.selectedLanguage) {
        return this.$store.getters['productFeed/GET_PRODUCT_FEED_VERIFICATION_ISSUES'];
      }

      return this.$store.getters['productFeed/GET_PRODUCT_FEED_VERIFICATION_ISSUES'].filter(
        (issue: ProductVerificationIssueOverall) => Object.keys(
          issue.affected,
        ).includes(this.selectedLanguage),
      );
    },
    filtersHeaderList(): string[] {
      return [
        this.$t('productFeedPage.compliancyIssuesPage.columns.issues'),
        this.$t('productFeedPage.compliancyIssuesPage.columns.suggestedActions'),
        this.$t('productFeedPage.compliancyIssuesPage.columns.affectedProducts'),
        this.$t('productFeedPage.compliancyIssuesPage.columns.languages'),
      ];
    },
    languages(): string[] {
      // Get all languages and make the array unique
      return [
        ...new Set(this.issues?.reduce((prev: string[], issue) => {
          prev.push(...Object.keys(issue.affected));
          return prev;
        }, [])),
      ];
    },
    languageSelectionDropdownText() {
      if (this.selectedLanguage) {
        return this.$t('productFeedPage.compliancyIssuesPage.languageSelected', {lang: this.changeLanguageCodeToName(this.selectedLanguage)});
      }
      return this.$t('productFeedPage.compliancyIssuesPage.languageSelection');
    },
  },
  methods: {
    getIssues(): void {
      if (!this.issues?.length) {
        this.loading = true;
      }
      this.apiFailed = false;

      this.$store.dispatch('productFeed/REQUEST_VERIFICATION_ISSUES')
        .catch(() => {
          this.apiFailed = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeLanguageCodeToName(langIsoCode: string): string {
      const languageName = new Intl.DisplayNames(
        [window.i18nSettings.languageLocale],
        {type: 'language'},
      ).of(langIsoCode) || langIsoCode;

      return languageName.replace(
        /^\p{CWU}/u, (char) => char.toLocaleUpperCase(window.i18nSettings.languageLocale),
      );
    },
  },
  mounted() {
    this.getIssues();
  },
});
</script>
