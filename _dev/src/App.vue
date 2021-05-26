<template>
  <div id="googleShoppingApp">
    <div class="ps_gs-sticky-head">
      <Menu>
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
};
</script>
