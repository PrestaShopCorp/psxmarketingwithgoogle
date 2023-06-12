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
              :to="{name: 'product-feed'}"
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
                  />
                </b-td>
              </b-tr>
            </template>

            <template v-else-if="apiFailed">
              <tr>
                <td
                  :colspan="filtersHeaderList.length"
                  class="py-5 text-center text-secondary"
                >
                  <div>
                    <i class="material-icons ps_gs-fz-48">error</i>
                  </div>
                  <div
                    class="ps_gs-fz-16 font-weight-600"
                  >
                    {{ $t('general.unableToFetchData') }}
                  </div>
                </td>
              </tr>
            </template>

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
      </b-card-body>
    </b-card>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import NonCompliantProductsDetailsRow from './non-compliant-products-details-row.vue';
import {ProductVerificationIssue, ProductVerificationIssueProduct, ProductVerificationIssueTranslation} from '@/store/modules/product-feed/state';

export default defineComponent({
  name: 'NonCompliantProductsDetailsPage',
  components: {
    NonCompliantProductsDetailsRow,
  },
  data() {
    return {
      loading: false as boolean,
      apiFailed: false as boolean,
      pageSize: 50 as number,
      offset: 0 as number,
      ProductVerificationIssueTranslation,
    };
  },
  computed: {
    verificationIssueName(): ProductVerificationIssue {
      return ProductVerificationIssue.MISSING_DESCRIPTION;
    },
    issueProducts(): ProductVerificationIssueProduct[]|null {

      return ({"products":[{
        "id":"8047",
        "variationCount":"2",
        "name":"Rhyhorn",
        "langs":["en","fr"]
      },{
        "id":"8048",
        "variationCount":"2",
        "name":"Rhydon",
        "langs":["en","fr"]
      },{"id":"8049","variationCount":"2","name":"Chansey","langs":["en","fr"]},{"id":"8050","variationCount":"2","name":"Tangela","langs":["en","fr"]},{"id":"8051","variationCount":"2","name":"Kangaskhan","langs":["en","fr"]},{"id":"8052","variationCount":"2","name":"Horsea","langs":["en","fr"]},{"id":"8053","variationCount":"2","name":"Seadra","langs":["en","fr"]},{"id":"8054","variationCount":"2","name":"Goldeen","langs":["en","fr"]},{"id":"8055","variationCount":"2","name":"Seaking","langs":["en","fr"]},{"id":"8056","variationCount":"2","name":"Staryu","langs":["en","fr"]},{"id":"8057","variationCount":"2","name":"Starmie","langs":["en","fr"]},{"id":"8058","variationCount":"2","name":"Mr-mime","langs":["en","fr"]},{"id":"8059","variationCount":"2","name":"Scyther","langs":["en","fr"]},{"id":"8060","variationCount":"2","name":"Jynx","langs":["en","fr"]},{"id":"8061","variationCount":"2","name":"Electabuzz","langs":["en","fr"]},{"id":"8062","variationCount":"2","name":"Magmar","langs":["en","fr"]},{"id":"8063","variationCount":"2","name":"Pinsir","langs":["en","fr"]},{"id":"8064","variationCount":"2","name":"Tauros","langs":["en","fr"]},{"id":"8065","variationCount":"2","name":"Magikarp","langs":["en","fr"]},{"id":"8066","variationCount":"2","name":"Gyarados","langs":["en","fr"]},{"id":"8067","variationCount":"2","name":"Lapras","langs":["en","fr"]},{"id":"8068","variationCount":"2","name":"Ditto","langs":["en","fr"]},{"id":"8069","variationCount":"2","name":"Eevee","langs":["en","fr"]},{"id":"8070","variationCount":"2","name":"Vaporeon","langs":["en","fr"]},{"id":"8071","variationCount":"2","name":"Jolteon","langs":["en","fr"]},{"id":"8072","variationCount":"2","name":"Flareon","langs":["en","fr"]},{"id":"8073","variationCount":"2","name":"Porygon","langs":["en","fr"]},{"id":"8074","variationCount":"2","name":"Omanyte","langs":["en","fr"]},{"id":"8075","variationCount":"2","name":"Omastar","langs":["en","fr"]},{"id":"8076","variationCount":"2","name":"Kabuto","langs":["en","fr"]},{"id":"8077","variationCount":"2","name":"Kabutops","langs":["en","fr"]},{"id":"8078","variationCount":"2","name":"Aerodactyl","langs":["en","fr"]},{"id":"8079","variationCount":"2","name":"Snorlax","langs":["en","fr"]},{"id":"8080","variationCount":"2","name":"Articuno","langs":["en","fr"]},{"id":"8081","variationCount":"2","name":"Zapdos","langs":["en","fr"]},{"id":"8082","variationCount":"2","name":"Moltres","langs":["en","fr"]},{"id":"8083","variationCount":"2","name":"Dratini","langs":["en","fr"]},{"id":"8084","variationCount":"2","name":"Dragonair","langs":["en","fr"]},{"id":"8085","variationCount":"2","name":"Dragonite","langs":["en","fr"]},{"id":"8086","variationCount":"2","name":"Mewtwo","langs":["en","fr"]},{"id":"8088","variationCount":"2","name":"Chikorita","langs":["en","fr"]},{"id":"8089","variationCount":"2","name":"Bayleef","langs":["en","fr"]},{"id":"8090","variationCount":"2","name":"Meganium","langs":["en","fr"]},{"id":"8091","variationCount":"2","name":"Cyndaquil","langs":["en","fr"]},{"id":"8092","variationCount":"2","name":"Quilava","langs":["en","fr"]},{"id":"8093","variationCount":"2","name":"Typhlosion","langs":["en","fr"]},{"id":"8094","variationCount":"2","name":"Totodile","langs":["en","fr"]},{"id":"8095","variationCount":"2","name":"Croconaw","langs":["en","fr"]},{"id":"8096","variationCount":"2","name":"Feraligatr","langs":["en","fr"]},{"id":"8097","variationCount":"2","name":"Sentret","langs":["en","fr"]}],"totalCount":"707"}).products;
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

      this.$store.dispatch('productFeed/REQUEST_VERIFICATION_ISSUES')
        .catch(() => {
          this.apiFailed = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getIssues();
  },
});
</script>
