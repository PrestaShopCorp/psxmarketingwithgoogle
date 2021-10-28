<template>
  <b-form-group
    :label-for="field.label | slugify"
    label-class="d-flex align-items-center"
  >
    <template #label>
      <span class="font-weight-600">
        {{ field.label }}
        <span
          v-if="field.required"
          class=""
        >
          *
        </span>
      </span>
      <b-button
        v-if="field.tooltip"
        class="ml-1 p-0 d-flex"
        variant="text"
        v-b-tooltip:psxMktgWithGoogleApp
        :title="'placholder to do todo'"
      >
        <span class="material-icons-round mb-0 ps_gs-fz-16 w-16 text-secondary">
          info_outlined
        </span>
      </b-button>
    </template>
    <b-dropdown
      :id="field.label | slugify"
      :text="field.default"
      variant=" "
      class="maxw-sm-250 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
      :toggle-class="{'ps-dropdown__placeholder' : true}"
      menu-class="ps-dropdown"
      size="sm"
    >
      <b-dropdown-form
        v-for="option in options"
        :key="option.label | slugify"
        form-class="dropdown-item dropdown-form-with-checkbox text-dark"
      >
        <b-form-checkbox
          class="ps_gs-checkbox"
        >
          <span class="line-height-15">
            {{ option.label }}
          </span>
        </b-form-checkbox>
      </b-dropdown-form>
      <b-dropdown-item-button
        button-class="rounded-0 text-dark"
        @click="selectNotAvailable"
      >
        <span
          class="px-2"
        >
          {{ $t('general.notAvailable') }}
        </span>
      </b-dropdown-item-button>
    </b-dropdown>
    <div
      v-if="notAvailableSelected"
      class="maxw-sm-250 d-flex text-muted ps_gs-fz-12 mt-1"
    >
      <i class="material-icons-round ps_gs-fz-16 font-weight-normal mr-1">warning_amber</i>
      <VueShowdown
        :markdown="$t('productFeedSettings.attributeMapping.requiredForSomeCategories',
                      [$options.googleUrl.learnRequirementsProductSpecification])"
        :extensions="['extended-link']"
      />
    </div>
  </b-form-group>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';

export default {
  data() {
    return {
      notAvailableSelected: false,
    };
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // TODO: Have the real list of possible value
    options() {
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
      ];
    },
  },
  methods: {
    selectNotAvailable() {
      // TODO: handle uncheck all
      this.notAvailableSelected = true;
    },
  },
  googleUrl,
};
</script>
