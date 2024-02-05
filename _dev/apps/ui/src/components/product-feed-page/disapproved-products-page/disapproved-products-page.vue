<template>
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
          {{ $t('productFeedPage.breadcrumb.productStatusDetails') }}
        </li>
      </ol>
    </template>
    <b-card-body body-class="p-3 mt-2">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <p>
          {{ $t('productFeedPage.approvalTable.description') }}
        </p>
        <language-filter-selector
          :languages="languages"
          @languageToFilterUpdated="selectedLanguage = $event"
          :disabled="loadingStatus !== RequestState.SUCCESS || !GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL"
        />
      </div>
      <b-table-simple
        id="table-products"
        class="mb-3 card"
        responsive="xl"
      >
        <b-thead class="card-header">
          <b-tr>
            <b-th
              v-for="(field, index) in fields"
              :key="index"
            >
              <div class="flex align-items-center text-nowrap">
                {{ field.label }}
              </div>
            </b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <template
            v-if="loadingStatus === RequestState.PENDING && !GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL"
          >
            <b-tr
              v-for="index in 5"
              :key="index"
              class="justify-content-between align-items-center py-3"
            >
              <b-td
                v-for="(text, textIndex) in fields"
                :class="`${(textIndex!==6 ? 'align-top': undefined)}`"
                :key="textIndex"
              >
                <b-skeleton
                  class="mb-0 mx-1"
                  :height="`${(textIndex===5 ? '5em' : undefined)}`"
                />
              </b-td>
            </b-tr>
          </template>

          <table-api-error
            v-else-if="loadingStatus === RequestState.FAILED"
            :colspan="fields.length"
          />

          <table-no-data
            v-else-if="loadingStatus === RequestState.SUCCESS && !GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL"
            :colspan="fields.length"
          />

          <template
            v-else
            v-for="(product) in filteredItems"
          >
            <DisapprovedProductsRow
              :key="product.id"
              :product="product"
              @renderProductIssues="onRenderProductIssues($event)"
            />
          </template>
          <b-tr
            v-if="loadingStatus === RequestState.PENDING && GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL"
          >
            <b-td
              colspan="7"
              class="ps_gs-table-products__loading-slot"
            >
              <i class="ps_gs-table-products__spinner">loading</i>
            </b-td>
          </b-tr>
          <b-tr
            v-else-if="nextToken"
          >
            <b-td
              colspan="7"
              class="text-center"
            >
              <b-button
                variant="link"
                @click="getItems()"
              >
                {{ $t('cta.loadNextPage') }}
              </b-button>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-card-body>

    <popin-product-issues
      :product="modalData"
      ref="PopinProductIssues"
    />
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import GettersTypesProductFeed from '@/store/modules/product-feed/getters-types';
import DisapprovedProductsRow from './disapproved-products-row.vue';
import LanguageFilterSelector from '@/components/product-feed-page/language-filter-selector.vue';
import {RequestState} from '@/store/types';
import TableApiError from '@/components/commons/table-api-error.vue';
import TableNoData from '@/components/commons/table-no-data.vue';
import PopinProductIssues from '@/components/product-feed-page/disapproved-products-page/popin-product-issues.vue';
import {ProductInfos} from '@/store/modules/product-feed/state';
import {ProductIdentifier} from './types';
import {initReplay} from '@/utils/Sentry';
import ProductsStatusType from '@/enums/product-feed/products-status-type';

export default defineComponent({
  name: 'DisapprovedProductsPage',
  components: {
    DisapprovedProductsRow,
    LanguageFilterSelector,
    PopinProductIssues,
    TableApiError,
    TableNoData,
  },
  data() {
    return {
      loadingStatus: RequestState.IDLE as RequestState,
      nextToken: null as string|null,
      selectedFilterQuantityToShow: 100,
      modalData: null as ProductIdentifier|null,
      selectedLanguage: null as string|null,
      fields: [
        {
          key: 'id',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderID'),
        },
        {
          key: 'name',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderName'),
        },
        {
          key: 'currency',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderCurrency'),
        },
        {
          key: 'lang',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderLanguage'),
        },
        {
          key: 'country',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderCountry'),
        },
        {
          key: 'issues',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderIssue'),
        },
        {
          key: 'actions',
        },
      ],
      RequestState,
    };
  },
  computed: {
    ...mapGetters('productFeed', [
      GettersTypesProductFeed.GET_PRODUCTS_VALIDATION_DISAPPROVED_LIST,
      GettersTypesProductFeed.GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL,
    ]),
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
    filteredItems(): ProductInfos[] {
      if (!this.selectedLanguage) {
        return this.GET_PRODUCTS_VALIDATION_DISAPPROVED_LIST;
      }

      return this.GET_PRODUCTS_VALIDATION_DISAPPROVED_LIST.filter(
        (item: ProductInfos) => !!item.impacts.find((impact) => impact.language === this.selectedLanguage),
      );
    },
    languages(): string[] {
      // Get all languages and make the array unique
      return [
        ...new Set(this.GET_PRODUCTS_VALIDATION_DISAPPROVED_LIST?.reduce((prev: string[], product: ProductInfos) => {
          prev.push(...product.impacts.map((impact) => impact.language));
          return prev;
        }, [] as string[])),
      ];
    },
  },
  mounted() {
    if (!this.GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL) {
      this.getItems();
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  beforeCreate() {
    // We want to check the behavior of user with many disapproved products.
    if (this.$store.getters['productFeed/GET_PRODUCT_FEED_VALIDATION_SUMMARY']
      .disapprovedProducts > 100
    ) {
      initReplay();
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    async getItems(): Promise<void> {
      this.loadingStatus = RequestState.PENDING;
      try {
        const res = await this.$store.dispatch('productFeed/REQUEST_REPORTING_PRODUCTS_STATUSES', {
          limit: this.selectedFilterQuantityToShow,
          offset: this.GET_PRODUCTS_VALIDATION_DISAPPROVED_TOTAL,
          status: ProductsStatusType.DISAPPROVED,
        } as {
          status: ProductsStatusType,
          limit: number,
          offset: number,
        });

        if (!res.nextToken) {
          // IF api does not send token, it means there are no results anymore.
          // We remove the scroll event
          window.removeEventListener('scroll', this.handleScroll);
        }
        this.nextToken = res.nextToken || null;
        this.loadingStatus = RequestState.SUCCESS;
      } catch (error) {
        console.error(error);
        window.removeEventListener('scroll', this.handleScroll);
        this.loadingStatus = RequestState.FAILED;
      }
    },
    handleScroll() {
      const de = document.documentElement;

      if (this.loadingStatus === RequestState.SUCCESS
        && de.scrollTop + window.innerHeight >= de.scrollHeight - 1
      ) {
        this.getItems();
      }
    },
    onRenderProductIssues(product: ProductIdentifier): void {
      this.$bvModal.show(
        this.$refs.PopinProductIssues.$refs.modal.id,
      );
      this.modalData = product;
    },
  },
});
</script>
