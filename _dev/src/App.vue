<template>
  <div id="googleShoppingApp">
    <Menu>
      <MenuItem route="/configuration">
        {{ $t('general.tabs.configuration') }}
      </MenuItem>
      <MenuItem
        route="/help"
      >
        {{ $t('general.tabs.help') }}
      </MenuItem>
    </Menu>
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
  props: {
  },
  created() {
  },
  methods: {
  },
  watch: {
  },
};
</script>

<style lang="scss">
  .nobootstrap {
    background-color: unset !important;
    padding: 100px 0 100px;
    min-width: unset !important;
  }
  .nobootstrap .form-group>div {
    float: unset;
  }

  @media screen and (min-width: 1024px) {
    .nobootstrap {
      background-color: unset !important;
      padding: 100px 0 100px;
      min-width: unset !important;
    }
  }

  .nobootstrap fieldset {
    background-color: unset;
    border: unset;
    color: unset;
    margin: unset;
    padding: unset;
  }
  .nobootstrap label {
    color: unset;
    float: unset;
    font-weight: unset;
    padding: unset;
    text-align: unset;
    text-shadow: unset;
    width: unset;
  }
  .nobootstrap .table tr th {
    background-color: unset;
    color: unset;
    font-size: unset;
  }
  .nobootstrap .table.table-hover tbody tr:hover {
      color: #fff;
  }
  .nobootstrap .table.table-hover tbody tr:hover a {
      color: #fff !important;
  }
  .nobootstrap .table tr td {
      border-bottom: unset;
      color: unset;
  }
  .nobootstrap .table {
    background-color: unset;
    border: unset;
    border-radius: unset;
    padding: unset;
  }
  .page-sidebar.mobile #content.nobootstrap {
    margin-left: unset;
  }
  .page-sidebar-closed:not(.mobile) #content.nobootstrap {
    padding-left: 50px;
  }
  .page-sidebar:not(.page-sidebar-closed) .nobootstrap {
    margin-left: 210px;
  }
  .material-icons.js-mobile-menu {
    display: none !important
  }

</style>
