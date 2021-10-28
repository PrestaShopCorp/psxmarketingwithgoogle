<template>
  <b-form-checkbox
    class="ps_gs-product-category-checkbox"
    :value="category.value"
    plain
  >
    <i class="material-icons ps_gs-product-category-checkbox__icon">
      {{category.icon}}
    </i>
    <div class="ps_gs-product-category-checkbox__text">
      <p class="ps_gs-product-category-checkbox__title">{{category.title}}</p>
      <p class="ps_gs-product-category-checkbox__subtitle">{{category.subtitle}}</p>
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
};
</script>
