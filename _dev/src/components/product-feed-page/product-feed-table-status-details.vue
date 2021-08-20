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
      <p>
        {{ $t('productFeedPage.approvalTable.description') }}
      </p>
      <b-table-simple
        id="table-products"
        class="ps_gs-table-products mb-3"
        variant="light"
        responsive="md"
      >
        <b-thead>
          <b-tr>
            <b-th
              v-for="(field, index) in fields"
              :key="index"
            >
              {{ field.label }}
            </b-th>
          </b-tr>
        </b-thead>

        <b-tbody>
          <template v-for="(product) in items">
            <template v-for="(statusInfo) in product.statuses">
              <template v-for="(lang) in statusInfo.countries">
                <b-tr :key="lang.index">
                  <b-td class="align-top">
                    {{ product.id }}
                  </b-td>
                  <b-td class="align-top">
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
                  <b-td class="align-top">
                    {{ product.attribute > 0 ? product.attribute : '' }}
                  </b-td>
                  <b-td class="align-top">
                    {{ statusInfo.destination }}
                  </b-td>
                  <b-td class="align-top">
                    <b-badge
                      :variant="badgeColor(statusInfo.status)"
                      class="ps_gs-fz-12 text-capitalize"
                    >
                      {{ statusInfo.status }}
                    </b-badge>
                  </b-td>
                  <b-td class="align-top">
                    <b-badge
                      variant="primary"
                      class="ps_gs-fz-12"
                    >
                      {{ lang }}
                    </b-badge>
                  </b-td>
                  <b-td class="align-top">
                    <ul
                      class="list-unstyled mb-0"
                      v-if="statusInfo.status === ProductStatues.Disapproved"
                    >
                      <li
                        v-for="(issue, indexIssues) in getIssues(product)"
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
                </b-tr>
              </template>
            </template>
          </template>
        </b-tbody>
      </b-table-simple>
      <div
        class="psgoogleshopping-lazy-loading"
        v-if="loading"
      >
        <div id="spinner" />
      </div>

      <!-- OLD TABLE -->
      <!-- TO KEEP IF WE SWITCH BACK TO B-TABLE-LITE -->
      <!--
      <b-table-lite
        stacked="md"
        variant="light"
        class="ps_gs-table-products mb-3"
      >
        <b-thead>
          <b-tr class="ps_gs-fz-12">
            <b-th>
              <div>ID</div>
            </b-th>
            <b-th>
              <div>Name</div>
            </b-th>
            <b-th>
              <div class="d-flex align-items-center">
                <span>Google validation</span>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1 border-0"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="'placeholder'"
                >
                  <i class="material-icons ps_gs-fz-14 text-grey_darklight">info_outline</i>
                </b-button>
              </div>
            </b-th>
            <b-th>
              <div class="d-flex align-items-center">
                <span>Language</span>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1 border-0"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="'placeholder'"
                >
                  <i class="material-icons ps_gs-fz-14 text-grey_darklight">info_outline</i>
                </b-button>
              </div>
            </b-th>
            <b-th>
              <div class="d-flex align-items-center">
                <span>Issue</span>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1 border-0"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="'placeholder'"
                >
                  <i class="material-icons ps_gs-fz-14 text-grey_darklight">info_outline</i>
                </b-button>
              </div>
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="({
              id, name, status, issues, _id, lang, variant
            }) in items"
            :key="_id"
          >
            <b-td class="ps_gs-fz-12">
              {{ id }}
            </b-td>
            <b-td class="ps_gs-fz-12">
              <a
                href="#"
                :title="`Edit ${name}`"
              >{{ name }}</a>
              <template
                v-if="!!variant"
              >
                <span
                  v-for="(attribute, index) in variant.attributes"
                  :key="index"
                >
                  <span
                    v-for="(value, key, index) in attribute"
                    :key="index"
                  >
                    <br>
                    {{ key }} - {{ value }}
                  </span>
                </span>
              </template>
            </b-td>
            <b-td class="ps_gs-table-products__status">
              <b-badge
                :variant="badgeColor(status)"
                class="ps_gs-fz-12"
              >
                {{ status }}
              </b-badge>
            </b-td>
            <b-td>
              <b-badge
                variant="primary"
                class="ps_gs-fz-12"
              >
                {{ lang }}
              </b-badge>
            </b-td>
            <b-td class="ps_gs-table-products__issue ps_gs-fz-10">
              {{ issues.length > 0 ? issues.join(', ') : '' }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-lite> -->
      <!-- OLD TABLE PAGINATION -->

      <!-- TO KEEP IF WE SWITCH BACK TO B-TABLE-LITE -->
      <!-- <div class="ps_gs-table-controls d-flex flex-wrap flex-md-nowrap align-items-center">
        <span class="ps_gs-table-controls__total-products pl-md-1 mr-2 text-muted">
          {{ totalProducts }} results
        </span>
        <div class="ps_gs-table-controls__products-shown d-flex align-items-center">
          <span>Show:</span>
          <b-dropdown
            id="filterQuantityToShow"
            ref="filterQuantityToShow"
            :text="selectedFilterQuantityToShow"
            variant=" "
            class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered w-auto ml-2"
            menu-class="ps-dropdown"
            no-flip
            size="sm"
          >
            <b-dropdown-item
              v-for="(option, index) in ['10', '20', '50', '100']"
              :key="index"
              @click="selectedFilterQuantityToShow = option"
            >
              {{ option }}
            </b-dropdown-item>
          </b-dropdown>
        </div>
        <nav
          aria-label="Table pagination"
          class="ps_gs-table-controls__pagination mx-md-auto"
        >
          <ul class="pagination mb-0">
            <li class="page-item previous">
              <a
                class="page-link"
                href="#"
                aria-label="Previous"
              >
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li class="page-item">
              <a
                class="page-link"
                href="#"
              >1</a>
            </li>
            <li class="page-item disabled">
              <a
                class="page-link"
                href="#"
              >...</a>
            </li>
            <li class="page-item">
              <a
                class="page-link"
                href="#"
              >6</a>
            </li>
            <li
              class="page-item active"
              aria-current="page"
            >
              <a
                class="page-link"
                href="#"
              >7</a>
            </li>
            <li class="page-item">
              <a
                class="page-link"
                href="#"
              >8</a>
            </li>
            <li class="page-item">
              <a
                class="page-link"
                href="#"
              >9</a>
            </li>
            <li class="page-item disabled">
              <a
                class="page-link"
                href="#"
              >...</a>
            </li>
            <li class="page-item">
              <a
                class="page-link"
                href="#"
              >16</a>
            </li>
            <li class="page-item next">
              <a
                class="page-link"
                href="#"
                aria-label="Next"
              >
                <span class="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
        <div class="ps_gs-table-controls__go-to d-flex align-items-center">
          <span class="flex-shrink-0">Go to page:</span>
          <b-form-input
            class="ml-sm-2 maxw-sm-72 flex-grow-0"
            type="number"
            size="sm"
          />
        </div>
      </div> -->
    </b-card-body>
  </b-card>
</template>

<script>
import {ProductStatues} from '../../store/modules/product-feed/state';

export default {
  name: 'ProductFeedTableStatusDetails',
  components: {},
  data() {
    return {
      loading: false,
      nextToken: '',
      firstCall: false,
      items: null,
      ProductStatues,
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
          key: 'attribute',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderAttributeID'),
        },
        {
          key: 'destination',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderDestination'),
        },
        {
          key: 'status',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderGoogleValidation'),
        },
        {
          key: 'lang',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderLanguage'),
        },
        {
          key: 'issues',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderIssue'),
        },
      ],
    };
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
    },
  },
  mounted() {
    this.getItems();
    window.addEventListener('scroll', this.handleScroll);
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
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    getItems() {
      this.$store.dispatch('productFeed/REQUEST_REPORTING_PRODUCTS_STATUSES')
        .then((res) => { this.items = res.results; });
    },
    badgeColor(status) {
      if (status === ProductStatues.Approved) {
        return 'success';
      }
      if (status === ProductStatues.Pending) {
        return 'warning';
      }
      return 'danger';
    },
    getIssues(product) {
      const issues = [];
      if (!('issues' in product)) {
        return issues;
      }
      product.issues.forEach((el) => {
        if (el.resolution === 'merchant_action') {
          issues.push({
            description: el.description,
            documentation: el.documentation,
            detail: el.detail,
          });
        }
      });
      return issues;
    },
    handleScroll() {
      const de = document.documentElement;
      if (this.loading === false && de.scrollTop + window.innerHeight >= de.scrollHeight) {
        this.loading = true;
        this.$store
          .dispatch('productFeed/REQUEST_REPORTING_PRODUCTS_STATUSES', this.nextToken)
          .then((res) => {
            this.nextToken = res.nextToken;
            // case for end of product list
            if (this.nextToken === '' && this.firstCall === false && res.results.length > 0) {
              window.removeEventListener('scroll', this.handleScroll);
            }
            if (res.results.length === 0) {
              window.removeEventListener('scroll', this.handleScroll);
            }
            if (this.nextToken && res.results.length > 0) {
              this.firstCall = true;
            }
            this.items = this.items.concat(res.results);
            this.firstCall = false;
          })
          .catch((error) => {
            console.error(error);
            window.removeEventListener('scroll', this.handleScroll);
          })
          .then(() => {
            setTimeout(() => {
              this.loading = false;
            }, 500);
          });
      }
    },
  },

};
</script>
<style lang="scss" scoped>
.psgoogleshopping-lazy-loading {
  width: 100%;
  height: 40px;
  #spinner {
    color: #fff;
    background-color: #fff;
    width: 2rem !important;
    height: 2rem !important;
    border-radius: 2.5rem;
    border-right-color: #25b9d7;
    border-bottom-color: #25b9d7;
    border-width: 0.1875rem;
    border-style: solid;
    font-size: 0;
    outline: none;
    display: inline-block;
    border-left-color: #bbcdd2;
    border-top-color: #bbcdd2;
    -webkit-animation: rotating 2s linear infinite;
    animation: rotating 2s linear infinite;
    position: absolute;
    left: calc(50% - 0.6rem);
  }
}
</style>
