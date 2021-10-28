<template>
  <b-form-group
    :label="field.label"
    :label-for="field.label | slugify"
    label-class="font-weight-600"
  >
    <b-dropdown
      :id="field.label | slugify"
      :text="field.default"
      variant=" "
      class="maxw-sm-250 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
      :toggle-class="{'ps-dropdown__placeholder' : true}"
      menu-class="ps-dropdown"
      size="sm"
    >
      <b-dropdown-item-button
        button-class="rounded-0 text-dark"
      >
        <span
          class="px-2"
        >
          Not available
        </span>
      </b-dropdown-item-button>
      <b-dropdown-form
        v-for="option in options"
        :key="option.label | slugify"
        form-class="dropdown-item dropdown-form-with-checkbox text-dark"
      >
        <b-form-checkbox
          class="ps_gs-checkbox"
        >
          <span class="line-height-15">
            "{{ option.label }}"
          </span>
        </b-form-checkbox>
      </b-dropdown-form>
    </b-dropdown>
  </b-form-group>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // TODO: Have the real list of possible value
    options(){
      return [
        {
          label: 'Size',
          value: 'size',
        },
        {
          label: 'ISBN',
          value: 'isbn',
        },
        {
          label: 'Long description',
          value: 'longDescription',
        },
        {
          label: 'Fabric color',
          value: 'fabricColor',
        },
        {
          label: 'Shoe size',
          value: 'shoeSize',
        },
        {
          label: 'Womens/Mens',
          value: 'womensMens',
        },
      ]
    },
  },
}
</script>
