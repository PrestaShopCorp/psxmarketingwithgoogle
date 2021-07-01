<template>
  <div id="googleShoppingApp">
    <div class="ps_gs-sticky-head">
      <Menu>
        <template v-if="productFeedIsConfigured">
          <MenuItem
            route="/product-feed"
          >
            {{ $t('general.tabs.productFeed') }}
          </MenuItem>
          <!-- <MenuItem
            route="/paid-marketing"
          >
            {{ $t('general.tabs.paidMarketing') }}
          </MenuItem> -->
        </template>
        <MenuItem :route="this.$route.name === 'configuration' ? '/onboarding' : '/configuration'">
          {{ $t('general.tabs.configuration') }}
        </MenuItem>
        <MenuItem
          route="/help"
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
