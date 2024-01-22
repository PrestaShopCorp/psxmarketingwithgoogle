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
      <p>
        {{ $t('productFeedPage.approvalTable.description') }}
      </p>
      <b-table-simple
        id="table-products"
        class="mb-3 ps_gs-table-products"
        :table-class="{'border-bottom-0': loading}"
        variant="light"
        responsive="xl"
      >
        <b-thead>
          <b-tr>
            <b-th
              v-for="(field, index) in fields"
              :key="index"
              :class="{'b-table-sticky-column': index === 1}"
            >
              {{ field.label }}
            </b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <template v-for="(product, index) in items">
            <template v-for="(status, indexStatus) in onlyDisapproved(product.statuses)">
              <DisapprovedProductsRow
                :key="`${index}-${indexStatus}`"
                :product="product"
                :status="status"
                :index-status="indexStatus"
              />
            </template>
          </template>
          <b-tr v-if="loading">
            <b-td
              colspan="7"
              class="ps_gs-table-products__loading-slot"
            >
              <i class="ps_gs-table-products__spinner">loading</i>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DisapprovedProductsRow from './disapproved-products-row.vue';
import ProductsStatusType from '@/enums/product-feed/products-status-type';

export default defineComponent({
  name: 'ProductFeedTableStatusDetails',
  components: {
    DisapprovedProductsRow,
  },
  data() {
    return {
      loading: false,
      nextToken: null,
      selectedFilterQuantityToShow: '100',
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
          key: 'country',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderCountry'),
        },
        {
          key: 'lang',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderLanguage'),
        },
        {
          key: 'issues',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderIssue'),
        },
        {
          key: 'actions',
        },
      ],
    };
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
    items() {
      return this.$store.state.productFeed.productsDatas.items
        .filter((item) => item.statuses);
    },
  },
  updated() {
    this.$nextTick(() => {
      // Observer to add class to sticky columns when they are stuck
      document.querySelectorAll('.b-table-sticky-column').forEach((i) => {
        if (i) {
          const observer = new IntersectionObserver(
            (entries) => {
              observerCallback(entries, observer, i);
            },
            {
              root: document.querySelector('.ps_gs-table-products'),
              threshold: 1,
            },
          );
          observer.observe(i);
        }
      });
      const observerCallback = (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-pinned', entry.intersectionRatio < 1);
        });
      };
    });
  },
  mounted() {
    if (!this.items.length) {
      this.getItems(null);
      window.addEventListener('scroll', this.handleScroll);
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    getItems(token) {
      this.loading = true;
      this.$store.dispatch('productFeed/REQUEST_REPORTING_PRODUCTS_STATUSES', token)
        .then((res) => {
          if (!res.nextToken) {
            // IF api does not send token, it means there are no results anymore.
            // We remove the scroll event
            window.removeEventListener('scroll', this.handleScroll);
          } else {
            // ELSE API gave us a token which means it still has results
            // so we can keep scrolling and sending another GET with the token
            this.nextToken = res.nextToken;
          }
        }).catch((error) => {
          console.error(error);
          window.removeEventListener('scroll', this.handleScroll);
        })
        .then(() => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
    },
    handleScroll() {
      const de = document.documentElement;

      if (this.loading === false && de.scrollTop + window.innerHeight >= de.scrollHeight - 1) {
        this.getItems(this.nextToken);
      }
    },
    onlyDisapproved(product) {
      return product.filter((stat) => stat.status === ProductsStatusType.DISAPPROVED);
    },
  },
});
</script>
