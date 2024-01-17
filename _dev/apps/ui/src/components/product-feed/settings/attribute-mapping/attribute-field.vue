<template>
  <b-form-group
    :label-for="field.label | slugify"
    label-class="d-flex align-items-center"
  >
    <b-dropdown
      :id="field.label"
      :html="`<span class='text-truncate d-inline-block'>
        ${formatToDisplay}</span>`"
      variant=" "
      class="ps-dropdown psxmarketingwithgoogle-dropdown bordered"
      :toggle-class="[{'ps-dropdown__placeholder' : !formatToDisplay}, 'w-100']"
      menu-class="ps-dropdown"
      size="sm"
      ref="attributeToMap"
    >
      <b-dropdown-form
        form-class="dropdown-form-with-checkbox text-dark"
      >
        <b-form-checkbox-group
          :name="`dropdown-attribute-${field.label}`"
          v-model="attributesChecked"
          stacked
        >
          <b-form-checkbox
            class="ps_gs-checkbox"
            v-for="(option, index) in options"
            :key="index"
            :value="option"
          >
            <span
              class="line-height-15 text-truncate"
              :data-test-id="setDataId(option)"
            >
              {{ displayAttributeOption(option) }}
            </span>
          </b-form-checkbox>
        </b-form-checkbox-group>
      </b-dropdown-form>
      <b-dropdown-item-button
        button-class="rounded-0 text-dark"
        @click="attributesChecked = []"
      >
        <span
          class="px-2"
        >
          {{ $t('general.notAvailable') }}
        </span>
      </b-dropdown-item-button>
    </b-dropdown>
    <div
      v-if="displayEventuallyRequiredMessage"
      class="maxw-sm-250 d-flex text-muted ps_gs-fz-12 mt-1 attribute-field__warning"
    >
      <i class="material-icons-round ps_gs-fz-16 font-weight-normal mr-1">warning_amber</i>
      <VueShowdown
        :markdown="markdown"
        :extensions="['extended-link']"
      />
    </div>
  </b-form-group>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';
import {FieldsContent, RecommendedFieldType, arrayEquals} from '@/utils/AttributeMapping';

export default defineComponent({
  data() {
    return {
      notAvailableSelected: false,
      markdown: this.$t('productFeedSettings.attributeMapping.requiredForSomeCategories', [this.$options.googleUrl.learnRequirementsProductSpecification]),
    };
  },
  props: {
    field: {
      type: Object as PropType<FieldsContent>,
      required: true,
    },
    category: {
      type: String,
      required: false,
      default: null,
    },
    isFocus: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    options() {
      return this.$store.getters['productFeed/GET_SHOP_ATTRIBUTES'];
    },
    attributesChecked: {
      get(): RecommendedFieldType[] {
        if (this.field.mapped !== null) {
          return this.field.mapped;
        }
        return this.field.recommended;
      },
      set(value: RecommendedFieldType[]) {
        this.$emit('valueMapped', value);
      },
    },
    formatToDisplay() {
      const result = this.attributesChecked
        // Backward compatibility with old local storage data
        .filter((e) => e.name)
        .map((e) => this.displayAttributeOption(e));

      return result.length ? result.join(', ') : this.$t('attributesMapping.options.notAvailable');
    },
    displayEventuallyRequiredMessage() {
      return !this.attributesChecked.length && this.field.name !== 'description';
    },
  },
  methods: {
    findAttribute(attr) {
      return !!this.attributesChecked.find((e) => e.name === attr);
    },
    displayAttributeOption(option) {
      return option.name.map((name) => (this.$te(`attributesMapping.options.${name}`)
        ? this.$t(`attributesMapping.options.${name}`) : name),
      ).join(', ');
    },
    setDataId(option) {
      return this.attributesChecked.some((e) => arrayEquals(e.name, option.name))
        ? 'attribute-is-mapped' : null;
    },
  },
  mounted() {
    if (this.isFocus) {
      this.$refs.attributeToMap.$refs.toggle.focus();
    }
  },
  googleUrl,
});
</script>
