<template>
  <b-card
    body-class="p-0"
  >
    <template #header>
      <h1 class="mb-0 ps_gs-onboardingcard__title">
        {{ $t('productFeedSettings.breadcrumb1') }}
      </h1>
    </template>
    <div class="d-sm-flex">
      <div class="flex-shrink-0 d-flex flex-column p-3">
        <SyncHistory
          v-slot="{ syncStates }"
        >
          <SyncState
            v-for="syncState, i in syncStates"
            :key="i"
            :sync-state="syncState"
          />
        </SyncHistory>
        <i18n
          path="cta.visitThe"
          tag="div"
          class="mt-4 ps_gs-fz-13 text-right text-muted"
        >
          <b-link
            :to="{name: 'help'}"
            class="text-muted text-decoration-underline"
          >
            {{ $t('general.helpPage') }}
          </b-link>
        </i18n>
      </div>
      <div class="flex-grow-1 p-3 border-top border-sm-top-0 border-sm-left">
        <SubmittedProducts
          v-slot="{ productStatuses }"
        >
          <ProductsStatusCard
            v-for="productStatus, i in productStatuses"
            :key="i"
            :product-status="productStatus"
          />
        </SubmittedProducts>
        <div class="mt-4 ps_gs-fz-13 text-right">
          <a
            :href="$options.googleUrl.learnRequirementsProductSpecification"
            target="_blank"
            class="text-muted d-inline-block"
          >{{ $t('cta.googleProductStatusDefinitions') }}</a>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import SubmittedProducts from './submitted-products/submitted-products';
import ProductsStatusCard from './submitted-products/products-status-card.vue';
import SyncHistory from './sync-history/sync-history.vue';
import SyncState from './sync-history/sync-state.vue';
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  components: {
    SubmittedProducts,
    ProductsStatusCard,
    SyncHistory,
    SyncState,
  },
  googleUrl,
};
</script>
