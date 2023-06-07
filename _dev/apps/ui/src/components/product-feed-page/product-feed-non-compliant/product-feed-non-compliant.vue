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
          {{ $t('productFeedPage.nonCompliant.breadcrumb') }}
        </li>
      </ol>
    </b-card-header>
    <b-card-body>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="w-70 mb-0">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure maiores incidunt,
          eum ratione voluptatibus repellendus cum alias voluptate minus consectetur.
        </div>
        <b-dropdown
          :text="$t('productFeedPage.nonCompliant.selectPlaceholder')"
          variant=" "
          class="min-w-25 psxmarketingwithgoogle-dropdown border rounded"
        >
          <b-dropdown-item
            v-for="item in items"
            :key="item"
          >
            {{ item }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <b-card
        no-body
      >
      <pre>{{ items }}</pre>
        <b-card-header class="container">
          <div class="row">
            <div class="col">
              First
            </div>
            <div class="col-5">
              Second
            </div>
            <div class="col">
              Third
            </div>
            <div class="col">
              Fourth
            </div>
          </div>
        </b-card-header>
        <b-skeleton-wrapper :loading="loading">
          <template #loading>
            <div
              v-for="index in 7"
              :key="index"
              class="d-flex justify-content-between align-items-center py-3
              border-right border-bottom border-left"
            >
              <b-skeleton
                class="mb-0 mx-1"
                width="20%"
              />
              <b-skeleton
                class="mb-0 mx-1"
                width="40%"
              />
              <b-skeleton
                class="mb-0 mx-1"
                width="20%"
              />
              <b-skeleton
                class="mb-0 mx-1"
                width="20%"
              />
            </div>
          </template>
          <b-card-body class="container p-0">
            <template v-if="!products.length">
              <div>
                No data
              </div>
            </template>
            <template v-else>
              <div
                v-for="product in items"
                :key="product.attribute"
                class="row align-items-center m-0 py-3 border-right border-bottom border-left"
              >
                <div class="col mb-0 px-3">
                  {{ product.id }}
                </div>
                <div class="col-5 mb-0 px-3">
                  <pre>{{ product.issues }}</pre>
                </div>
                <div class="col mb-0 px-3">
                  <a>View product</a>
                </div>
                <div class="col mb-0 px-3">
                  <span
                    v-for="lang in product.affected"
                    :key="lang"
                    class="p-1 border"
                  >
                    {{ product.language }}
                  </span>
                </div>
              </div>
            </template>
          </b-card-body>
        </b-skeleton-wrapper>
      </b-card>
    </b-card-body>
  </b-card>
</template>

id: string;
 name: string;
 attribute: string;
 language: string;
 statuses: ProductInfosStatus[];
 issues?: contentApi.Schema$ProductStatusItemLevelIssue[];

<script>
import {changeCountryCodeToName} from '@/utils/Countries';

export default {
  name: 'ProductFeedNonCompliant',
  data() {
    return {
      loading: false,
      nextToken: null,
      langs: ['first', 'second', 'third'],
      issues: [
        {
          affected: {
            en: 5,
          },
          name: 'MISSING_NAME',
        },
        {
          affected: {
            en: 5,
            fr: 11,
          },
          name: 'MISSING_DESCRIPTION',
        },
        {
          affected: {
            en: 5,
          },
          name: 'MISSING_IMAGE',
        },
        {
          affected: {
            fr: 3,
          },
          name: 'MISSING_LINK',
        },
        {
          affected: {
            en: 5,
          },
          name: 'MISSING_PRICE',
        },
      ],
    };
  },
  computed: {
    items() {
      console.log(this.$store.state.productFeed.productsDatas.items);
      return this.$store.state.productFeed.productsDatas.items
    },
  },
  methods: {
    getItems(token) {
      this.loading = true;
      this.$store.dispatch('productFeed/REQUEST_REPORTING_PRODUCTS_STATUSES', token)
        .then((res) => {
          if (res.nextToken) {
            this.nextToken = res.nextToken;
          }
        }).catch((error) => {
          console.error(error);
        })
        .then(() => {
          setTimeout(() => {
            this.loading = false;
          }, 500);
        });
    },
    onlyDisapproved(product) {
      return product.filter((stat) => stat.status === ProductsStatusType.DISAPPROVED);
    },
  },
  mounted() {
    if (!this.items.length) {
      this.getItems(null);
    }
  },
};
</script>
