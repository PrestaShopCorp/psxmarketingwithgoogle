<template>
  <b-form-checkbox
    class="ps_gs-product-category-checkbox"
    :value="category.value"
    plain
    @change="changed"
  >
    <i class="material-icons ps_gs-product-category-checkbox__icon">
      {{ category.icon }}
    </i>
    <div class="ps_gs-product-category-checkbox__text">
      <p class="ps_gs-product-category-checkbox__title">
        {{ category.title }}
      </p>
      <p
        class="ps_gs-product-category-checkbox__subtitle"
        v-if="category.subtitle"
      >
        {{ category.subtitle }}
      </p>
    </div>
  </b-form-checkbox>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  methods: {
    changed(event) {
      this.$emit('categoryProductsChanged', this.category.value, event.includes(this.category.value));
    },
  },
};
</script>
