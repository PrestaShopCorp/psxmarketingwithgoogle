<template>
  <section>
    <b-card
      no-body
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
            <b-link
              :to="{name: 'product-feed-verification-errors'}"
              class="d-flex align-items-center ps_gs-breadcrumb__link"
            >
              {{ $t('productFeedPage.breadcrumb.nonCompliantProducts') }}
            </b-link>
          </li>
          <li class="list-inline-item ps_gs-breadcrumb__item">
            {{ $t(`productFeedPage.compliancyIssues.${
              ProductVerificationIssueTranslation[verificationIssueName
              ]}`) }}
          </li>
        </ol>
      </template>
      <b-card-body
        class="p-3"
      >
        <div class="d-flex justify-content-between align-items-center mb-3">
          <VueShowdown
            :markdown="$t('productFeedPage.compliancyIssueProductsPage.details', {
              action: $t(`productFeedPage.compliancyIssues.${
                ProductVerificationIssueTranslation[verificationIssueName
                ]}Action`),
            })"
          />
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
                <div
                  class="flex align-items-center text-nowrap"
                  :class="(+index === filtersHeaderList.length-1) && 'text-right'"
                >
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
                v-for="index in pageSize"
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
                  />
                </b-td>
              </b-tr>
            </template>

            <table-api-error
              v-else-if="apiFailed"
              :colspan="filtersHeaderList.length"
            />

            <template v-else-if="!issueProducts || !issueProducts.length">
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
              <non-compliant-products-details-row
                v-for="product in issueProducts"
                :key="product.name"
                :verification-issue-product="product"
              />
            </template>
          </b-tbody>
        </b-table-simple>
        <TablePageControls
          :total-pages="totalPages"
          :active-page="activePage+1"
          :selected-filter-quantity-to-show="pageSize"
        />
      </b-card-body>
    </b-card>
  </section>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';

import NonCompliantProductsDetailsRow from './non-compliant-products-details-row.vue';
import {ProductVerificationIssue, ProductVerificationIssueProduct, ProductVerificationIssueTranslation} from '@/store/modules/product-feed/state';
import TableApiError from '@/components/commons/table-api-error.vue';
import TablePageControls from '@/components/commons/table-page-controls.vue';

export default defineComponent({
  name: 'NonCompliantProductsDetailsPage',
  components: {
    NonCompliantProductsDetailsRow,
    TableApiError,
    TablePageControls,
  },
  data() {
    return {
      loading: false as boolean,
      apiFailed: false as boolean,
      pageSize: 10 as number,
      activePage: 0 as number,
      ProductVerificationIssueTranslation,
    };
  },
  props: {
    verificationIssueName: {
      type: String as PropType<ProductVerificationIssue>,
      required: true,
    },
  },
  computed: {
    totalPages(): number {
      return Math.ceil(
        (this.$store.getters['productFeed/GET_PRODUCT_FEED_VERIFICATION_ISSUE_NB_OF_PRODUCTS'](
          this.verificationIssueName,
        ) || 0)
        / this.pageSize,
      );
    },
    issueProducts(): ProductVerificationIssueProduct[]|null {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_VERIFICATION_ISSUE_PRODUCTS'](
        this.verificationIssueName,
        this.pageSize,
        this.activePage,
      )?.filter((product: ProductVerificationIssueProduct|null) => !!product) || null;
    },
    filtersHeaderList(): string[] {
      return [
        this.$t('productFeedPage.compliancyIssueProductsPage.columns.productsId'),
        this.$t('productFeedPage.compliancyIssueProductsPage.columns.productsTitle'),
        this.$t('productFeedPage.compliancyIssueProductsPage.columns.languages'),
        this.$t('productFeedPage.compliancyIssueProductsPage.columns.actions'),
      ];
    },
  },
  methods: {
    getIssues(): void {
      if (!this.issueProducts?.length) {
        this.loading = true;
      }
      this.apiFailed = false;

      this.$store.dispatch({
        type: 'productFeed/REQUEST_VERIFICATION_ISSUE_PRODUCTS',
        verificationIssue: this.verificationIssueName,
        limit: this.pageSize,
        offset: this.activePage * this.pageSize,
      }).catch((e) => {
        this.apiFailed = true;
        throw e;
      })
        .finally(() => {
          this.loading = false;
        });
    },
    pageChanged(newPageNumber: number): void {
      this.activePage = newPageNumber - 1;
      this.getIssues();
    },
    limitChanged(newLimit: number): void {
      this.pageSize = newLimit;
      this.getIssues();
    },
  },
  mounted() {
    this.getIssues();
    this.$root.$on('changePage', this.pageChanged);
    this.$root.$on('changeLimit', this.limitChanged);
  },
  beforeDestroy() {
    this.$root.$off('changePage', this.pageChanged);
    this.$root.$off('changeLimit', this.limitChanged);
  },
});
</script>
