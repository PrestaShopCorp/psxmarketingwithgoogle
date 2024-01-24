<template>
  <b-tr>
    <b-td
      class="align-top"
    >
      {{ product.id }}{{ +product.attribute > 0 ? '&#8209;' + product.attribute : '' }}
    </b-td>
    <b-td
      class="align-top"
    >
      <a
        v-if="!isNaN(+product.id)"
        class="external_link-no_icon"
        :href="getProductBaseUrl.replace('/1?', `/${product.id}?`)"
        target="_blank"
        :title="$t('productFeedPage.approvalTable.editX', [product.name])"
      >
        {{ product.name }}
      </a>
      <span v-else>
        {{ product.name }}
      </span>
    </b-td>

    <b-td
      class="align-top"
    >
      <b-card
        border-variant="primary"
        class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13 font-weight-500"
      >
        {{ product.currency }}
      </b-card>
    </b-td>

    <b-td
      class="align-top"
    >
      <b-card
        border-variant="primary"
        class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13 font-weight-500"
      >
        {{ product.language }}
      </b-card>
    </b-td>

    <b-td
      class="align-top"
    >
      <b-card
        v-for="(country) in allAffectedCountries"
        :key="country"
        border-variant="primary"
        class="mx-1 d-inline-flex ps_gs-productfeed__badge ps_gs-fz-13 font-weight-500 mb-2"
      >
        {{ changeCountryCodeToName(country) }}
      </b-card>
    </b-td>

    <b-td
      class="align-top"
    >
      <ul
        class="pl-0 mb-0 ml-3"
        v-if="allIssues.length"
      >
        <li
          v-for="(issue, indexIssues) in allIssues"
          :key="indexIssues"
        >
          {{ issue }}
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
      <b-button
        variant="primary"
        class="text-nowrap"
        @click="learnMore"
      >
        {{ $t('cta.learnMore') }}
      </b-button>
    </b-td>
  </b-tr>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import {BButton} from 'bootstrap-vue';
import {ProductStatus, ProductInfos} from '@/store/modules/product-feed/state';
import {changeCountryCodeToName} from '@/utils/Countries';
import {ProductIdentifier} from './types';

export default defineComponent({
  name: 'ProductFeedTableStatusDetailsRow',
  components: {BButton},
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
    merchantCenterWebsitePageUrl() {
      const {id} = this.$store.state.accounts.googleMerchantAccount;

      return {
        accountIssues: `https://merchants.google.com/mc/products/diagnostics?a=${id}&tab=account_issues`,
      };
    },
    allAffectedCountries(): string[] {
      return [...new Set(
        ...this.product.statuses.map((status) => status.countries),
      )];
    },
    allIssues(): string[] {
      const issues: string[] = [];

      this.product.issues?.forEach((issue) => {
        if (!issue.description) {
          return;
        }

        if (issues.includes(issue.description)) {
          return;
        }
        issues.push(issue.description);
      });

      return issues;
    },
  },
  methods: {
    learnMore(): void {
      this.$emit('renderProductIssues', {
        idProduct: this.product.id,
        idAttribute: this.product.attribute,
        currency: this.product.currency,
        languageCode: this.product.language,
      } as ProductIdentifier);
    },
    changeCountryCodeToName,
  },
});
</script>
