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
          Product status details
        </li>
      </ol>
    </b-card-header>
    <b-card-body
      body-class="p-3 mt-2"
    >
      <p>
        Products with problems that couldn't be synced are listed below.
      </p>
      <p class="font-weight-600 mb-1">
        Display by Google validation status
      </p>
      <b-dropdown
        id="filterProducts"
        ref="filterProducts"
        :text="selectedFilterStatus"
        variant=" "
        class="flex-grow-1 ps-dropdown ps_googleshopping-dropdown bordered maxw-sm-250 mb-4"
        menu-class="ps-dropdown"
        no-flip
        size="sm"
      >
        <b-dropdown-item
          v-for="(option, index) in filterProductsOptions"
          :key="index"
          @click="selectedFilterStatus = option"
        >
          {{ option }}
        </b-dropdown-item>
      </b-dropdown>
      <b-table-simple
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
                <span>Google validation status</span>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1 border-0"
                  v-b-tooltip:googleShoppingApp
                  :title="'placeholder'"
                >
                  <i class="material-icons ps_gs-fz-14 color-grey_darklight">info_outline</i>
                </b-button>
              </div>
            </b-th>
            <b-th>
              <div class="d-flex align-items-center">
                <span>Issue</span>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1 border-0"
                  v-b-tooltip:googleShoppingApp
                  :title="'placeholder'"
                >
                  <i class="material-icons ps_gs-fz-14 color-grey_darklight">info_outline</i>
                </b-button>
              </div>
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="({
              id, name, status, issues
            }, index) in productsShown"
            :key="index"
          >
            <b-td class="ps_gs-fz-12">
              {{ id }}
            </b-td>
            <b-td class="ps_gs-fz-12">
              <a href="#" :title="`Edit ${name}`">{{ name }}</a>
            </b-td>
            <b-td class="ps_gs-table-products__status">
              <b-badge
                :variant="badgeColor(status)"
                class="ps_gs-fz-12"
              >
                {{ status }}
              </b-badge>
            </b-td>
            <b-td class="ps_gs-table-products__issue ps_gs-fz-10">
              {{ issues }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <div class="ps_gs-table-controls d-flex flex-wrap flex-md-nowrap align-items-center">
        <span class="ps_gs-table-controls__total-products pl-md-1 mr-2 text-muted">{{ totalProducts }} results</span>
        <div class="ps_gs-table-controls__products-shown d-flex align-items-center">
          <span>Show:</span>
          <b-dropdown
            id="filterQuantityToShow"
            ref="filterQuantityToShow"
            :text="selectedFilterQuantityToShow"
            variant=" "
            class="flex-grow-1 ps-dropdown ps_googleshopping-dropdown bordered w-auto ml-2"
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
              <a class="page-link" href="#" aria-label="Previous">
                <span class="sr-only">Previous</span>
              </a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
            <li class="page-item"><a class="page-link" href="#">6</a></li>
            <li class="page-item active" aria-current="page"><a class="page-link" href="#">7</a></li>
            <li class="page-item"><a class="page-link" href="#">8</a></li>
            <li class="page-item"><a class="page-link" href="#">9</a></li>
            <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
            <li class="page-item"><a class="page-link" href="#">16</a></li>
            <li class="page-item next">
              <a class="page-link" href="#" aria-label="Next">
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
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {Products} from '@/../fixtures/products.js';

import {
  BTableSimple,
} from 'bootstrap-vue';

export default {
  name: 'ProductFeedTableStatusDetails',
  components: {
    BTableSimple,
  },
  data() {
    return {
      productsShown: Products.slice(0, 20),
      totalProducts: Products.length,
      selectedFilterStatus: 'All status',
      filterProductsOptions: [
        'All status',
        'Only approved',
        'Only pending',
        'Only not approved',
      ],
      selectedFilterQuantityToShow: '20',
    };
  },
  methods: {
    badgeColor(status) {
      if (status === 'approved') {
        return 'success';
      } if (status === 'pending') {
        return 'warning';
      }
      return 'danger';
    },
  },
};
</script>
