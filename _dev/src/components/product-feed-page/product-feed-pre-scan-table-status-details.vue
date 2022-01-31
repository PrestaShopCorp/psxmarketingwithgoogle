<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <b-card-header
      header-tag="nav"
      header-class="px-3 py-1"
    >
      <ol class="list-inline mb-0 d-flex align-items-center ps_gs-breadcrumb">
        <li class="list-inline-item ps_gs-breadcrumb__item">
          <a
            href=""
            class="d-flex align-items-center ps_gs-breadcrumb__link"
          >
            {{ $t('productFeedSettings.breadcrumb1') }}
          </a>
        </li>
        <li class="list-inline-item ps_gs-breadcrumb__item">
          {{ $t('productFeedPage.breadcrumb') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body body-class="p-3 mt-2">
    <div class="d-flex  align-items-center pr-3">
      <p class="w-75">
        {{rows}} {{ $t('productFeedPage.preScan.description') }}
      </p>
      <b-dropdown
        v-if="countries.length > 1"
        id="filterByCountryDropdown"
        variant=" "
        menu-class="ps-dropdown"
        :text="langSelected ? $options.filters.changeCountriesCodesToNames([langSelected])[0]
          : $t('productFeedSettings.shipping.filterTitle')"
        class="mb-2 ps-dropdown psxmarketingwithgoogle-dropdown bordered maxw-sm-250"
      >
        <b-dropdown-item
          :disabled="!langSelected"
          variant="dark"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
          @click="langSelected = null"
        >
          {{ $t('productFeedSettings.shipping.filterTitle') }}
        </b-dropdown-item>
        <b-dropdown-item
          :disabled="country === langSelected"
          v-for="(country, index) in countries"
          :key="index"
          @click="langSelected = country"
          variant="dark"
          link-class="flex-wrap px-3 d-flex flex-md-nowrap align-items-center"
        >
          {{ $options.filters.changeCountriesCodesToNames([country])[0] }}
        </b-dropdown-item>
      </b-dropdown>
    </div>
      <b-table
        striped
        :items="items"
        :fields="fields"
        :filter-function="filterByLang"
        :filter="langSelected"
        :per-page="perPage"
        :current-page="currentPage"
        :busy="loading"
        id="table-products"
        class="ps_gs-table-products mb-3"
        variant="light"
        responsive="xl"
      >
        <template #cell(name)="data">
          <a
            class="external_link-no_icon"
            :href="!isNaN(data.item.id)
              ? getProductBaseUrl.replace('/1?', `/${data.item.id}?`) : null"
            target="_blank"
          >
            {{ data.item.name }}
          </a>
        </template>
        <template
          #cell(language)="data"
        >
          <b-badge
            variant="primary"
            class="ps_gs-fz-12 text-capitalize"
          >
            {{ data.item.language }}
          </b-badge>
        </template>
        <template #cell(image)="data">
          <span
            class="material-icons"
            :class="data.item.image ? 'text-success': 'text-danger'"
          >
            {{ data.item.image ? 'done' : 'close' }}
          </span>
        </template>
        <template #cell(description)="data">
          <span
            class="material-icons"
            :class="data.item.description ? 'text-success': 'text-danger'"
          >
            {{ data.item.description ? 'done' : 'close' }}
          </span>
        </template>
        <template #cell(barcode)="data">
          <span
            class="material-icons"
            :class="data.item.barcode ? 'text-success': 'text-danger'"
          >
            {{ data.item.barcode ? 'done' : 'close' }}
          </span>
        </template>
        <template #cell(price)="data">
          <span
            class="material-icons"
            :class="data.item.price ? 'text-success': 'text-danger'"
          >
            {{ data.item.price ? 'done' : 'close' }}
          </span>
        </template>
      </b-table>
      <div class="overflow-auto">
        <div class="mt-3">
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="table-products"
            align="center"
          ></b-pagination>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  name: 'ProductFeedPreScanTableStatusDetails',
  components: {},
  data() {
    return {
      // use a method for filtering with the actif lang
      countries: ['EN', 'FR'],
      langSelected: null,
      perPage: 10,
      currentPage: 1,
      loading: false,
      items: [
      ],
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
          key: 'language',
          label: this.$i18n.t('productFeedPage.preScan.fields.language'),
        },
        {
          key: 'image',
          label: this.$i18n.t('productFeedPage.preScan.fields.image'),
        },
        {
          key: 'description',
          label: this.$i18n.t('productFeedPage.preScan.fields.description'),
        },
        {
          key: 'barcode',
          label: this.$i18n.t('productFeedPage.preScan.fields.barcode'),
        },
        {
          key: 'price',
          label: this.$i18n.t('productFeedPage.preScan.fields.price'),
        },
      ],
    };
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
    rows() {
      return this.items.length;
    },
  },
  methods: {
    filterByLang(row, filter) {
      return row.language === filter;
    },
    getPreScanProducts() {
      this.loading = true;
      this.$store.dispatch('productFeed/GET_PREVALIDATION_PRODUCTS')
        .then((res) => {
          this.loading = false;
          this.items = res;
          // update currentPage
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    this.getPreScanProducts();
  },
};
</script>
