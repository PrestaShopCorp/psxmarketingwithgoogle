<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
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
          {{ $t('productFeedPage.breadcrumb') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body body-class="p-3 mt-2">
      <div class="flex-wrap d-flex flex-md-nowrap justify-content-between align-items-center">
        <i18n
          path="productFeedPage.preScan.description"
          tag="h2"
          class="font-weight-normal ps_gs-fz-14 pr-md-2"
        >
          <span class="font-weight-bold text-lowercase">
            {{
              $tc('smartShoppingCampaignCreation.xProducts',
                  rows,
                  [rows]
              )
            }}
          </span>
        </i18n>
        <b-dropdown
          v-if="countries.length > 1"
          id="filterByCountryDropdown"
          variant=" "
          menu-class="ps-dropdown"
          :text="langChosen ? langChosen
            : $t('productFeedSettings.preScan.selectLanguage')"
          class="mt-1 mb-2 mt-md-0 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250"
        >
          <b-dropdown-item
            :disabled="!langChosen"
            variant="dark"
            link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
            @click="langChosen = null"
          >
            {{ $t('productFeedSettings.shipping.filterTitle') }}
          </b-dropdown-item>
          <b-dropdown-item
            :disabled="lang === langChosen"
            v-for="(lang, index) in countries"
            :key="index"
            @click="langChosen = lang"
            variant="dark"
            link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          >
            {{ lang }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <b-table-simple
        id="table-pre-scan"
        :table-class="{'border-bottom-0': loading}"
        variant="light"
        responsive="xl"
      >
        <b-thead>
          <b-tr>
            <b-th
              v-for="(type, index) in fields"
              :key="index"
              class="font-weight-600"
              tabindex="0"
              @click="sortBy(type)"
              :aria-sort="type.sortable ? 'none' : null"
            >
              {{ type.label }}
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-if="apiError">
            <tr>
              <td
                class="text-center"
                :colspan="fields.length"
              >
                {{ $t('productFeedSettings.preScan.apiError') }}
              </td>
            </tr>
          </template>
          <template v-else-if="fields.length === 0 && loading === false">
            <tr>
              <td
                class="text-center"
                :colspan="fields.length"
              >
                {{ $t('productFeedSettings.preScan.noElement') }}
              </td>
            </tr>
          </template>
          <template
            v-else
            v-for="(product, productIndex) in items"
          >
            <b-tr :key="productIndex">
              <b-td class="align-top">
                {{ product.productId }}
                {{ product.attributeId > 0 ? '&#8209; ' + product.attributeId : '' }}
              </b-td>
              <b-td class="align-top">
                <a
                  class="external_link-no_icon"
                  :href="!isNaN(product.productId)
                    ? getProductBaseUrl.replace('/1?', `/${product.productId}?`) : null"
                  target="_blank"
                >
                  {{ getProductName(product.titleByLang) }}
                </a>
              </b-td>
              <b-td class="align-top">
                <b-badge
                  variant="primary"
                  class="mr-1 ps_gs-fz-12 text-capitalize"
                  v-for="(language, index) in getProductLangs(product.titleByLang)"
                  :key="index"
                >
                  {{ language.toUpperCase() }}
                </b-badge>
              </b-td>
              <b-td class="align-top">
                <span
                  class="material-icons"
                  :class="product.isMissingImage ? 'text-danger' : 'text-success'"
                >
                  {{ product.isMissingImage ? 'close' : 'done' }}
                </span>
              </b-td>
              <b-td class="align-top">
                <span
                  class="material-icons"
                  :class="product.isMissingDescription ? 'text-danger' : 'text-success'"
                >
                  {{ product.isMissingDescription ? 'close' : 'done' }}
                </span>
              </b-td>
              <b-td
                class="align-top"
              >
                <span
                  class="material-icons"
                  :class="product.isMissingBrandOrBarcode ? 'text-danger' : 'text-success'"
                >
                  {{ product.isMissingBrandOrBarcode ? 'close' : 'done' }}
                </span>
              </b-td>
              <b-td class="align-top">
                <span
                  class="material-icons"
                  :class="product.isMissingPrice ? 'text-danger' : 'text-success'"
                >
                  {{ product.isMissingPrice ? 'close' : 'done' }}
                </span>
              </b-td>
            </b-tr>
          </template>
          <b-tr
            v-if="loading"
            class="table-pre-scan-loader-wrapper"
          >
            <b-td
              colspan="7"
              class="table-pre-scan-loader"
            >
              <i class="ps_gs-table-products__spinner">loading</i>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <TablePageControls
        :total-pages="totalPage"
        :active-page="currentPage"
        :selected-filter-quantity-to-show="limit"
        :need-page-selector="false"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import TablePageControls from '../commons/table-page-controls.vue';

export default {
  name: 'ProductFeedPreScanTableStatusDetails',
  components: {
    TablePageControls,
  },
  data() {
    return {
      loading: false,
      fields: [
        {
          key: 'id',
          asc: true,
          sortable: true,
          baseName: 'productId',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderID'),
        },
        {
          key: 'name',
          sortable: false,
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderName'),
        },
        {
          key: 'language',
          sortable: false,
          label: this.$i18n.t('productFeedPage.preScan.fields.language'),
        },
        {
          key: 'image',
          label: this.$i18n.t('productFeedPage.preScan.fields.image'),
          asc: true,
          sortable: true,
          baseName: 'isMissingImage',
        },
        {
          key: 'description',
          label: this.$i18n.t('productFeedPage.preScan.fields.description'),
          asc: true,
          sortable: true,
          baseName: 'isMissingDescription',
        },
        {
          key: 'barcode',
          label: this.$i18n.t('productFeedPage.preScan.fields.barcode'),
          asc: true,
          sortable: true,
          baseName: 'isMissingBrandOrBarcode',
        },
        {
          key: 'price',
          label: this.$i18n.t('productFeedPage.preScan.fields.price'),
          asc: true,
          sortable: true,
          baseName: 'isMissingPrice',
        },
      ],
      apiError: false,
    };
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
    rows() {
      return this.$store.getters['productFeed/GET_PRESCAN_TOTAL_ERROR'];
    },
    items() {
      return this.$store.getters['productFeed/GET_PRESCAN_PRODUCTS'];
    },
    totalPage() {
      const totalPage = Math.ceil(this.$store.getters['productFeed/GET_PRESCAN_TOTAL_ERROR'] / this.limit);

      return totalPage < 1 ? 1 : totalPage;
    },
    langChosen: {
      get() {
        return this.$store.getters['productFeed/GET_PRESCAN_LANGUAGE_CHOSEN'];
      },
      set(value) {
        this.$store.commit('productFeed/SET_PRESCAN_LANGUAGE_CHOSEN', value);
        this.getPreScanProducts();
      },
    },
    limit: {
      get() {
        return this.$store.getters['productFeed/GET_PRESCAN_LIMIT_PAGE'];
      },
      set(value) {
        this.$store.commit('productFeed/SET_PRESCAN_LIMIT_PAGE', value);
      },
    },
    currentPage: {
      get() {
        return this.$store.getters['productFeed/GET_PRESCAN_NEXT_PAGE'];
      },
      set(value) {
        this.$store.commit('productFeed/SET_PRESCAN_NEXT_PAGE', value);
      },
    },
    countries() {
      return this.$store.getters['productFeed/GET_TARGET_COUNTRIES'];
    },
    getDefaultLang() {
      return this.$store.state.app.psxMtgWithGoogleDefaultShopCountry;
    },
  },
  methods: {
    filterByLang(row, filter) {
      this.langChosen = filter;
    },
    getProductName(products) {
      if (products.length === 0) {
        return '';
      }
      const findProductInCurrentLang = products.find(
        (k) => k.lang.toUpperCase() === this.getDefaultLang,
      );

      if (findProductInCurrentLang !== undefined) {
        return findProductInCurrentLang?.title;
      }
      return products[0].title;
    },
    sortBy(type) {
      const {baseName} = type;
      this.items.sort(
        (a, b) => (type.asc ? a[baseName] - b[baseName] : b[baseName] - a[baseName]),
      );
      type.asc = !type.asc;
    },
    getProductLangs(products) {
      return products.map((k) => k.lang);
    },
    getPreScanProducts() {
      this.loading = true;
      this.$store.dispatch('productFeed/GET_PREVALIDATION_PRODUCTS')
        .catch(() => {
          this.apiError = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    limitChanged(newLimit) {
      this.limit = newLimit;
      this.getPreScanProducts();
    },
    pageChanged(newPage) {
      this.currentPage = newPage;
      this.getPreScanProducts();
    },
  },
  mounted() {
    this.getPreScanProducts();
    this.$root.$on('changeLimit', this.limitChanged);
    this.$root.$on('changePage', this.pageChanged);
  },
};
</script>
