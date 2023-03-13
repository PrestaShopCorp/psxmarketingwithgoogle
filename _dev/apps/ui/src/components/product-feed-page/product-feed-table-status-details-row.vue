<template>
  <b-tr>
    <b-td
      class="align-top"
      :rowspan="product.statuses.length"
      v-if="!indexStatus"
    >
      {{ product.id }}{{ +product.attribute > 0 ? '&#8209;' + product.attribute : '' }}
    </b-td>
    <b-td
      class="align-top b-table-sticky-column"
      :rowspan="product.statuses.length"
      v-if="!indexStatus"
    >
      <a
        class="external_link-no_icon"
        :href="!isNaN(+product.id)
          ? getProductBaseUrl.replace('/1?', `/${product.id}?`) : undefined"
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
      :rowspan="countriesAndStatusAreTheSame ? product.statuses.length : 0"
      v-if="!indexStatus || !countriesAndStatusAreTheSame"
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
        v-if="getIssues(status.destination).length"
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
      <VueShowdown
        v-else
        tag="span"
        class="mb-0"
        :markdown="
          $t(
            'productFeedPage.approvalTable.noReasonFallback',
            [merchantCenterWebsitePageUrl.accountIssues],
          )
        "
        :extensions="['extended-link', 'no-p-tag']"
      />
    </b-td>
    <b-td>
      {{ renameDestination(status.destination) }}
    </b-td>
  </b-tr>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import {ProductStatus, ProductInfos, ProductInfosStatus} from '@/store/modules/product-feed/state';

export default defineComponent({
  name: 'ProductFeedTableStatusDetailsRow',
  components: {},
  data() {
    return {
      ProductStatus,
    };
  },
  props: {
    product: {
      type: Object as PropType<ProductInfos>,
      required: true,
    },
    status: {
      type: Object as PropType<ProductInfosStatus>,
      required: true,
    },
    indexStatus: {
      type: Number,
      required: true,
    },
  },
  computed: {
    getProductBaseUrl(): string {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
    getShoppingIssues(): contentApi.Schema$ProductStatusItemLevelIssue[] {
      if (!this.product.issues) {
        return [];
      }
      return this.product.issues.filter((issue) => issue.resolution === 'merchant_action' && issue.destination === 'Shopping');
    },
    getSurfacesAcrossGoogleIssues(): contentApi.Schema$ProductStatusItemLevelIssue[] {
      if (!this.product.issues) {
        return [];
      }
      return this.product.issues.filter((issue) => issue.resolution === 'merchant_action' && issue.destination === 'SurfacesAcrossGoogle');
    },
    countriesAndStatusAreTheSame(): boolean {
      return this.product.statuses
        .every((anotherStatus) => anotherStatus.status === this.status.status
          && JSON.stringify(anotherStatus.countries) === JSON.stringify(this.status.countries),
        );
    },
    merchantCenterWebsitePageUrl() {
      const {id} = this.$store.state.accounts.googleMerchantAccount;

      return {
        accountIssues: `hhttps://merchants.google.com/mc/products/diagnostics?a=${id}&tab=account_issues`,
      };
    },
  },
  methods: {
    badgeColor(status: ProductStatus): string {
      if (status === ProductStatus.Approved) {
        return 'success';
      }
      if (status === ProductStatus.Pending) {
        return 'warning';
      }
      return 'danger';
    },
    getIssues(destination: string): contentApi.Schema$ProductStatusItemLevelIssue[] {
      if (destination === 'Shopping') {
        return this.getShoppingIssues;
      }
      if (destination === 'SurfacesAcrossGoogle') {
        return this.getSurfacesAcrossGoogleIssues;
      }
      return [];
    },
    renameDestination(destination: string): string {
      if (destination === 'Shopping') {
        return this.$t('productFeedPage.destinations.shoppingAds');
      }
      if (destination === 'SurfacesAcrossGoogle') {
        return this.$t('productFeedPage.destinations.enhancedFreeListing');
      }
      return destination;
    },
  },
});
</script>
