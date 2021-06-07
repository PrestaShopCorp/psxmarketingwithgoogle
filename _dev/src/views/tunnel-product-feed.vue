<template>
  <div>
    <ProductFeedCard
      :is-enabled="true"
      :configuration-started="true"
    />
  </div>
</template>

<script>
import ProductFeedCard from '../components/product-feed/product-feed-card';

export default {
  name: 'TunnelProductFeed',
  components: {
    ProductFeedCard,
  },

};
</script>

<style>

</style>
