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
      <b-table
        :items="items"
        :fields="fields"
        :filter-function="filterByLang"
        :filter="langChosen"
        :per-page="limit"
        :current-page="currentPage"
        :busy="loading"
        id="table-products"
        class="mb-3 ps_gs-table-products"
        table-class="border-bottom-0"
        variant="light"
        responsive="xl"
      >
        <template #cell(id)="data">
          {{ data.item.productId }}
        </template>

        <template #cell(id_attribute)="data">
          {{ data.item.attributeId || '-' }}
        </template>

        <template #cell(name)="data">
          <a
            class="external_link-no_icon"
            :href="(!isNaN(data.item.id) && data.item.id)
              ? getProductBaseUrl.replace('/1?', `/${data.item.productId}?`) : null"
            target="_blank"
          >
            {{ getProductName(data.item.titleByLang) }}
          </a>
        </template>
        <template
          #cell(language)="data"
        >
          <b-badge
            variant="primary"
            class="mr-1 ps_gs-fz-12 text-capitalize"
            v-for="(language, index) in getProductLangs(data.item.titleByLang)"
            :key="index"
          >
            {{ language.toUpperCase() }}
          </b-badge>
        </template>

        <template #cell(image)="data">
          <span
            class="material-icons"
            :class="data.item.isMissingImage ? 'text-danger' : 'text-success'"
          >
            {{ data.item.isMissingLink ? 'close' : 'done' }}
          </span>
        </template>

        <template #cell(description)="data">
          <span
            class="material-icons"
            :class="data.item.isMissingDescription ? 'text-danger' : 'text-success'"
          >
            {{ data.item.isMissingDescription ? 'close' : 'done' }}
          </span>
        </template>

        <template #cell(barcode)="data">
          <span
            class="material-icons"
            :class="data.item.isMissingBrandOrBarcode ? 'text-danger' : 'text-success'"
          >
            {{ data.item.isMissingBrandOrBarcode ? 'close' : 'done' }}
          </span>
        </template>

        <template #cell(price)="data">
          <span
            class="material-icons"
            :class="data.item.isMissingPrice ? 'text-danger' : 'text-success'"
          >
            {{ data.item.isMissingPrice ? 'close' : 'done' }}
          </span>
        </template>
      </b-table>
      <p
        v-if="apiError"
        class="text-center font-weight-bold text-danger"
      >
        {{ $t('productFeedSettings.preScan.apiError') }}
      </p>
      <p
        v-if="!apiError && items.length === 0"
        class="text-center"
      >
        {{ $t('productFeedSettings.preScan.noElement') }}
      </p>
      <div class="overflow-auto">
        <TablePageControls
          :total-pages="totalPage"
          :active-page="currentPage"
          :selected-filter-quantity-to-show="limit"
          :need-page-selector="false"
        />
      </div>
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
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderID'),
          thClass: 'font-weight-600',
        },
        {
          key: 'id_attribute',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderAttributeID'),
          thClass: 'font-weight-600',
        },
        {
          key: 'name',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderName'),
          thClass: 'font-weight-600',
        },
        {
          key: 'language',
          label: this.$i18n.t('productFeedPage.preScan.fields.language'),
          thClass: 'font-weight-600',
        },
        {
          key: 'image',
          label: this.$i18n.t('productFeedPage.preScan.fields.image'),
          sortable: true,
          thClass: 'font-weight-600',
        },
        {
          key: 'description',
          label: this.$i18n.t('productFeedPage.preScan.fields.description'),
          sortable: true,
          thClass: 'font-weight-600',
        },
        {
          key: 'barcode',
          label: this.$i18n.t('productFeedPage.preScan.fields.barcode'),
          sortable: true,
          thClass: 'font-weight-600',
        },
        {
          key: 'price',
          label: this.$i18n.t('productFeedPage.preScan.fields.price'),
          sortable: true,
          thClass: 'font-weight-600',
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
