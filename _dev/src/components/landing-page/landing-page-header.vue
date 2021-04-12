<template>
  <header class="ps_gs-landingpage-header d-flex flex-column flex-md-row">
    <figure class="ps_gs-landingpage-header__figure order-md-2 flex-shrink-0 ml-md-3">
      <b-img src="https://via.placeholder.com/276x178" fluid  class="mx-auto d-block" alt="" />
    </figure>
    <div>
      <h2 class="ps_gs-landingpage-header__title">
        <b-img src="https://via.placeholder.com/56x56" class="mr-3" alt="" />
        <span>PrestaShop</span> <span>Google Shopping</span>
      </h2>
      <p class="ps_gs-landingpage-header__text w-100">
        PrestaShop Google Shopping makes it easy to connect your store with Google, so you can showcase your products to millions of shoppers across Google Search, Shopping, Gmail, YouTube, and the Display Network.
      </p>
      <b-button variant="primary" class="my-2">Button</b-button>
      <ul class="ps_gs-landingpage-header__benefits list-inline mb-0 text-muted">
        <li class="list-inline-item">Easy setup</li>
        <li class="list-inline-item">Cancel anytime</li>
      </ul>
    </div>
  </header>
</template>

<script>

export default {
  name: 'LandingPageHeader',
  data: function(){
    return {
    }
  },
}
</script>

<style>
</style>