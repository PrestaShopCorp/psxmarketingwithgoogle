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
        class="mb-3 ps_gs-table-products"
        :table-class="{'border-bottom-0': loading}"
        variant="light"
        responsive="xl"
      >
        <b-thead>
          <b-tr>
            <b-th
              v-for="(field, indexField) in fields"
              :key="indexField"
              :class="{'b-table-sticky-column': indexField === 1}"
            >
              {{ field.label }}
              <b-button
                v-if="field.tooltip"
                variant="invisible"
                v-b-tooltip:psxMktgWithGoogleApp
                class="p-0 mt-0 ml-0 border-0 "
                :title="$t(`productFeedPage.approvalTable.${field.tooltip}`)"
              >
                <span class="material-icons-round ps_gs-fz-16 text-primary">
                  info_outlined
                </span>
              </b-button>
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-for="(productsById, index) in items">
            <b-tr :key="index">
              <b-td class="align-top">
                {{ productsById[0].id }}
                {{ productsById[0].attribute > 0 ? '&#8209;' + productsById[0].attribute : '' }}
              </b-td>
              <b-td class="align-top b-table-sticky-column">
                <a
                  class="external_link-no_icon"
                  :href="!isNaN(productsById[0].id)
                    ? getProductBaseUrl.replace('/1?', `/${productsById.id}?`) : null"
                  target="_blank"
                  :title="$t('productFeedPage.approvalTable.editX', [productsById[0].name])"
                >
                  {{ productsById[0].name }}
                </a>
              </b-td>

              <b-td class="align-top">
                <b-badge
                  :variant="badgeColor(productsById[0].statuses.status)"
                  class="ps_gs-fz-12 text-capitalize"
                >
                  {{ productsById[0].statuses.status }}
                </b-badge>
              </b-td>
              <b-td
                class="align-top"
              >
                <section
                  v-for="(oneProduct, indexLang) in productsById"
                  :key="indexLang"
                  class="d-flex"
                >
                  <section
                    v-for="(oneCountry, indexCountry) in oneProduct.statuses.countries"
                    :key="indexCountry"
                  >
                    <b-badge
                      variant="primary"
                      class="ps_gs-fz-12  m-1"
                    >
                      {{ oneCountry }}
                    </b-badge>
                  </section>
                </section>
              </b-td>
              <b-td
                class="align-top"
                colspan="2"
              >
                <section
                  v-for="(productIssues, indexIssue) in productsById"
                  :key="indexIssue"
                >
                  <ul
                    class="pl-0 mb-0 ml-3"
                    v-if="productIssues.statuses.status === ProductStatues.Disapproved"
                  >
                    <li
                      v-for="(issue, indexIssues) in getIssues(productIssues)"
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
                    <!-- <hr v-if="indexIssue +1 < productIssues.issues.length"> -->
                  </ul>
                </section>

                <section
                  v-for="(oneProduct, indexDesti) in productsById"
                  :key="indexDesti"
                >
                  {{ oneProduct.statuses.destination }}
                  <!-- <hr v-if="indexDesti +1 < productsById.length"> -->
                </section>
              </b-td>
            </b-tr>
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
      <!-- OLD TABLE -->
      <!-- TO KEEP IF WE SWITCH BACK TO B-TABLE-LITE -->
      <!--
      <b-table-lite
        stacked="md"
        variant="light"
        class="mb-3 ps_gs-table-products"
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
      <!-- <div class="flex-wrap ps_gs-table-controls d-flex flex-md-nowrap align-items-center">
        <span class="mr-2 ps_gs-table-controls__total-products pl-md-1 text-muted">
          {{ totalProducts }} results
        </span>
        <div class="ps_gs-table-controls__products-shown d-flex align-items-center">
          <span>Show:</span>
          <b-dropdown
            id="filterQuantityToShow"
            ref="filterQuantityToShow"
            :text="selectedFilterQuantityToShow"
            variant=" "
            class="w-auto ml-2 flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
            menu-class="ps-dropdown"

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
          <ul class="mb-0 pagination">
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
            class="flex-grow-0 ml-sm-2 maxw-sm-72"
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
import {mapItemsSameId} from '@/utils/MapItemsSameId';

export default {
  name: 'ProductFeedTableStatusDetails',
  components: {},
  data() {
    return {
      loading: false,
      nextToken: null,
      items: mapItemsSameId(this.$store.state.productFeed.productsDatas.items),
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
          tooltip: '',
        },
        {
          key: 'status',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderGoogleValidation'),
          tooltip: '',
        },
        {
          key: 'lang',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderCountry'),
          tooltip: '',
        },
        {
          key: 'issues',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderIssue'),
          tooltip: '',
        },
        {
          key: 'destination',
          label: this.$i18n.t('productFeedPage.approvalTable.tableHeaderDestination'),
          tooltip: 'tooltipDestination',
        },
      ],
    };
  },
  computed: {
    getProductBaseUrl() {
      return this.$store.getters['app/GET_PRODUCT_DETAIL_BASE_URL'];
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
          // In any case, we add to our items array the last results the API sent us
          this.mapResults(res);
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
    mapResults(res) {
      return res.results.map((result) => result.statuses.forEach((status) => {
        this.$store.commit('productFeed/SAVE_ALL_PRODUCTS', {
          id: result.id,
          issues: result.issues || [],
          attribute: result.attribute,
          name: result.name,
          statuses: status,
        });
      }));
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

      if (this.loading === false && de.scrollTop + window.innerHeight >= de.scrollHeight - 1) {
        this.getItems(this.nextToken);
      }
    },
  },

};
</script>
