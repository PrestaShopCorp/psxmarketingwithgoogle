<template>
  <b-tr v-if="getIssues(status.destination).length">
    <b-td
      class="align-top"
      :rowspan="product.statuses.length"
      v-if="!indexStatus"
    >
      {{ product.id }}{{ product.attribute > 0 ? '&#8209;' + product.attribute : '' }}
    </b-td>
    <b-td
      class="align-top b-table-sticky-column"
      :rowspan="product.statuses.length"
      v-if="!indexStatus"
    >
      <a
        class="external_link-no_icon"
        :href="!isNaN(product.id)
          ? getProductBaseUrl.replace('/1?', `/${product.id}?`) : null"
        target="_blank"
        :title="$t('productFeedPage.approvalTable.editX', [product.name])"
      >
        {{ product.name }}
      </a>
    </b-td>
    <b-td
      class="align-top"
      :rowspan="countriesAndStatusAreTheSame ? product.statuses.length : 0"
      v-if="!indexStatus || !countriesAndStatusAreTheSame"
    >
      <span
        v-for="(country, indexCountry) in status.countries"
        :key="indexCountry"
      >
        <b-badge
          variant="primary"
          class="ps_gs-fz-12 mb-1 mr-1"
        >
          {{ country }}
        </b-badge>
      </span>
    </b-td>
    <b-td
      class="align-top"
    >
      <span>
        <b-badge
          variant="primary"
          class="ps_gs-fz-12"
        >
          {{ product.language }}
        </b-badge>
      </span>
    </b-td>

    <b-td
      class="align-top"
      :rowspan="countriesAndStatusAreTheSame ? product.statuses.length : 0"
      v-if="!indexStatus || !countriesAndStatusAreTheSame"
    >
      <b-badge
        data-test-id="statusOfProduct"
        :variant="badgeColor(status.status)"
        class="ps_gs-fz-12 text-capitalize"
      >
        {{ status.status }}
      </b-badge>
    </b-td>

    <b-td
      class="align-top"
    >
      <ul
        class="pl-0 mb-0 ml-3"
        v-if="status.status === ProductStatues.Disapproved"
      >
        <li
          v-for="(issue, indexIssues) in getIssues(status.destination)"
          :key="indexIssues"
        >
          <a
            class="text-decoration-none"
            :href="issue.documentation"
            :title="issue.detail"
            target="_blank"
          >
            {{ issue.description }}
          </a>
        </li>
      </ul>
    </b-td>
    <b-td>
      {{ renameDestination(status.destination) }}
    </b-td>
  </b-tr>
  <!-- Needed for the rowspan -->
  <b-tr v-else />
</template>

<script>
import {ProductStatues} from '../../store/modules/product-feed/state';

export default {
  name: 'ProductFeedTableStatusDetailsRow',
  components: {},
  data() {
    return {
      ProductStatues,
    };
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    status: {
      type: Object,
      required: true,
    },
    indexStatus: {
      type: Number,
      required: true,
    },
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
    getShoppingIssues() {
      if (!this.product.issues) {
        return [];
      }
      return this.product.issues.filter((issue) => issue.resolution === 'merchant_action' && issue.destination === 'Shopping');
    },
    getSurfacesAcrossGoogleIssues() {
      if (!this.product.issues) {
        return [];
      }
      return this.product.issues.filter((issue) => issue.resolution === 'merchant_action' && issue.destination === 'SurfacesAcrossGoogle');
    },
    countriesAndStatusAreTheSame() {
      return this.product.statuses
        .every((anotherStatus) => anotherStatus.status === this.status.status
          && JSON.stringify(anotherStatus.countries) === JSON.stringify(this.status.countries),
        );
    },
  },
  methods: {
    badgeColor(status) {
      if (status === ProductStatues.Approved) {
        return 'success';
      }
      if (status === ProductStatues.Pending) {
        return 'warning';
      }
      return 'danger';
    },
    getIssues(destination) {
      if (destination === 'Shopping') {
        return this.getShoppingIssues;
      }
      if (destination === 'SurfacesAcrossGoogle') {
        return this.getSurfacesAcrossGoogleIssues;
      }
      return [];
    },
    renameDestination(destination) {
      if (destination === 'Shopping') {
        return this.$t('productFeedPage.destinations.shoppingAds');
      }
      if (destination === 'SurfacesAcrossGoogle') {
        return this.$t('productFeedPage.destinations.enhancedFreeListing');
      }
      return destination;
    },
  },
};
</script>
