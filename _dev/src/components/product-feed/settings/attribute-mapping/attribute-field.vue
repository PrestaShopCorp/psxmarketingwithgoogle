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
        :title="tooltipFormat(field.name)"
      >
        <span class="material-icons-round mb-0 ps_gs-fz-16 w-16 text-secondary">
          info_outlined
        </span>
      </b-button>
    </template>

    <b-dropdown
      :id="field.label | slugify"
      :html="`<span class='text-truncate d-inline-block'>
        ${formatToDisplay || $t('general.notAvailable')}</span>`"
      variant=" "
      class="maxw-sm-250 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
      :toggle-class="[{'ps-dropdown__placeholder' : !formatToDisplay}, 'w-100']"
      menu-class="ps-dropdown"
      size="sm"
    >
      <b-dropdown-form
        form-class="dropdown-form-with-checkbox text-dark"
      >
        <b-form-checkbox-group
          :name="`dropdown-attribute-${field.label}`"
          v-model="attributesChecked"
          @change="getAttribute"
          stacked
        >
          <b-form-checkbox
            class="ps_gs-checkbox"
            v-for="(option, index) in options"
            :key="index"
            :value="option"
          >
            <span class="line-height-15">
              {{ displayTranslation(option) }}
            </span>
          </b-form-checkbox>
        </b-form-checkbox-group>
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
        :markdown="markdown"
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
      markdown: this.$t('productFeedSettings.attributeMapping.requiredForSomeCategories', [this.$options.googleUrl.learnRequirementsProductSpecification]),
    };
  },
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
  computed: {
    options() {
      return this.$store.getters['productFeed/GET_SHOP_ATTRIBUTES'];
    },
    attributesChecked: {
      get() {
        if (this.field.mapped !== null) {
          return this.field.mapped;
        }
        return this.field.recommended;
      },
      set(value) {
        this.field.mapped = value;
      },
    },

    formatToDisplay() {
      return this.attributesChecked.map((e) => this.displayTranslation(e)).join(', ');
    },
  },
  methods: {
    selectNotAvailable() {
      if (this.field.label === 'Description') {
        this.attributesChecked = [];
      } else if (this.field.label === 'Maximum energy efficient class'
      || this.field.label === 'Energy class'
      || this.field.label === 'Minimum energy efficient class') {
        this.attributesChecked = [];
        this.markdown = this.$t('productFeedSettings.attributeMapping.requiredForSomeCategories', [this.$options.googleUrl.learnRequirementsEnergyClass]);
        this.notAvailableSelected = true;
      } else {
        this.attributesChecked = [];
        this.notAvailableSelected = true;
      }
    },
    displayTranslation(option) {
      switch (option.name) {
        case 'description':
          return this.$t('attributesMapping.description');
        case 'shortDescription':
          return this.$t('attributesMapping.shortDescription');
        default:
          return option.name;
      }
    },
    findAttribute(attr) {
      return !!this.attributesChecked.find((e) => e.name === attr);
    },
    getAttribute() {
      this.$store.commit('productFeed/SET_ATTRIBUTE_MAPPING_SELECTION', {
        name: this.field.name,
        elements: this.attributesChecked,
      });
    },
    tooltipFormat(name) {
      return this.$t(`tooltip.attributeMapping.${name}`);
    },
  },
  googleUrl,
};
</script>
