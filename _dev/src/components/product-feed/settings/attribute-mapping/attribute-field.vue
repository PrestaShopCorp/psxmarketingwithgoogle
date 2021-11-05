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
    <!-- add translations -->
    <b-dropdown
      :id="field.label | slugify"
      :text="formatToDisplay || $t('general.notAvailable') "
      variant=" "
      class="maxw-sm-250 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
      :toggle-class="{'ps-dropdown__placeholder' : true}"
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
            v-for="option in options"
            :key="option.name | slugify"
            :value="option"
          >
            <span class="line-height-15">
              {{ option.displayName ? $t(option.displayName) : option.name }}
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
    options() {
      return this.$store.getters['productFeed/GET_SHOP_ATTRIBUTES'];
    },
    attributesChecked: {
      get() {
        const availableAttr = [];
        if (this.field.mapped !== null) {
          this.options.forEach((el) => {
            this.field.mapped.forEach((mapped) => {
              if (el.name === mapped.name) {
                availableAttr.push(el);
              }
            });
          });
        } else {
          this.options.forEach((el) => {
            this.field.recommended.forEach((recommended) => {
              if (el.name === recommended.name) {
                availableAttr.push(el);
              }
            });
          });
        }
        return availableAttr;
      },
      set(value) {
        this.field.mapped = value;
      },
    },
    formatToDisplay() {
      return this.attributesChecked.map((e) => e.name).join(', ');
    },
  },
  methods: {
    selectNotAvailable() {
      this.attributesChecked = [];
      this.notAvailableSelected = true;
    },
    findAttribute(attr) {
      return !!this.attributesChecked.find((e) => e.name === attr);
    },
    getAttribute() {
      this.$store.commit('productFeed/SET_ATTRIBUTE_MAPPING_SELECTION', {
        label: this.field.label,
        elements: this.attributesChecked,
      });
    },
  },
  googleUrl,
};
</script>
