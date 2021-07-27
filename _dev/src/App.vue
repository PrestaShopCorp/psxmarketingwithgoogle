<template>
  <div id="psxMktgWithGoogleApp">
    <div class="ps_gs-sticky-head">
      <Menu>
        <template v-if="productFeedIsConfigured">
          <MenuItem
            route="/product-feed"
            :active="this.$route.name === 'product-feed' ? 'active' : null"
          >
            {{ $t('general.tabs.productFeed') }}
          </MenuItem>
          <!-- <MenuItem
            route="/paid-marketing"
             :active="this.$route.name === 'paid-marketing' ? 'active' : null"
          >
            {{ $t('general.tabs.paidMarketing') }}
          </MenuItem> -->
        </template>
        <MenuItem
          route="/"
          :active="this.$route.name === 'configuration'
            ? 'active'
            : this.$route.name === 'onboarding'
              ? 'active'
              : null"
        >
          {{ $t('general.tabs.configuration') }}
        </MenuItem>
        <MenuItem
          route="/help"
          :active="this.$route.name === 'help' ? 'active' : null"
        >
          {{ $t('general.tabs.help') }}
        </MenuItem>
      </Menu>
      <b-toaster
        name="b-toaster-top-right"
        class="ps_gs-toaster-top-right"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import Menu from '@/components/menu/menu.vue';
import MenuItem from '@/components/menu/menu-item.vue';

export default {
  name: 'Home',
  components: {
    Menu,
    MenuItem,
  },
  computed: {
    productFeedIsConfigured() {
      return this.$store.getters['productFeed/GET_PRODUCT_FEED_IS_CONFIGURED'];
    },
  },
};
</script>
