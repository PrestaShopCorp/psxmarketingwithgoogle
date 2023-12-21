<template>
  <div>
    <b-form>
      <section>
        <h3
          class="mb-2 ps_gs-fz-20 font-weight-600"
        >
          {{ $t('productFeedSettings.attributeMapping.title1') }}
        </h3>
        <p>
          {{ $t('productFeedSettings.attributeMapping.description1') }}
        </p>
        <b-form-checkbox-group
          id="categoryProducts"
          v-model="selectedProductCategories"
          name="categoryProducts"
          class="py-2 mb-4"
          plain
        >
          <category-button
            v-for="category in categories"
            :key="category.value"
            :category="category"
            @categoryProductsChanged="categoryProductsChanged"
          />
        </b-form-checkbox-group>
      </section>
      <section
        class="mb-2"
        v-if="mappingSectionVisible"
        data-test-id="section-attribute-field"
      >
        <h3
          class="mb-2 ps_gs-fz-20 font-weight-600"
        >
          {{ $t('productFeedSettings.attributeMapping.title2') }}
        </h3>
        <p>
          {{ $t('productFeedSettings.attributeMapping.description2') }}
        </p>
        <div
          class="mt-3 text-center"
          v-if="loading"
        >
          <div
            class="spinner"
          />
        </div>
        <b-container
          v-else
          class=" maxw-sm-800"
        >
          <div
            class="d-flex justify-content-around
          flex-md-row flex-column
          ps-ps-header-attribute-mapping
          mb-2"
          >
            <div class="text-center mt-4">
              <img
                class="rounded-circle mb-1"
                src="@/assets/images/google-icon-grey.svg"
                width="20"
                height="20"
              >
              <p>
                {{ $t('productFeedSettings.summary.tableHeader1') }}
              </p>
            </div>
            <div />
            <div class="text-center mt-4">
              <img
                src="@/assets/images/table-chart.svg"
                class="mb-1"
                width="20"
                height="20"
              >
              <p>
                {{ $t("productFeedSettings.summary.tableHeader2") }}
              </p>
            </div>
          </div>
          <template
            v-for="group in mappingAttributes"
          >
            <div
              v-for="field in group.fields"
              :key="field.label + group.category"
              class="row"
            >
              <div class="d-flex col-12 col-md-6">
                <span> {{ field.label }}</span>

                <b-button
                  v-if="field.tooltip"
                  class="ml-1 p-0 d-flex"
                  variant="text"
                  v-b-tooltip:psxMktgWithGoogleApp
                  :title="tooltipFormat(field.name)"
                >
                  <span class="material-icons-round mb-0 ps_gs-fz-16 w-16 text-secondary">
                    help_outline
                  </span>
                </b-button>
              </div>

              <div
                class="d-flex col-12 col-md-6 text-center"
              >
                <attribute-field
                  :id="field.name"
                  :is-focus="attributeToEdit
                    && field.name.toUpperCase() === attributeToEdit"
                  :field="field"
                  :category="group.category"
                  @valueMapped="field.mapped = $event"
                />
              </div>
            </div>
          </template>
        </b-container>
      </section>
      <p class="ps_gs-fz-12 text-primary">
        <a
          :href="$options.googleUrl.learnRequirementsProductSpecification"
          target="_blank"
        >
          {{ $t('productFeedSettings.attributeMapping.learnRequirementsProductSpecification') }}
        </a>
      </p>
      <p class="ps_gs-fz-12 text-muted">
        {{ $t('productFeedSettings.attributeMapping.footerNotice') }}
      </p>
    </b-form>

    <div
      class="text-primary"
    >
      <a
        class="mb-0 ps_gs-fz-12"
        :href="$store.getters['app/GET_ATTRIBUTES_URL']"
        target="_blank"
      >
        {{ $t('productFeedSettings.attributeMapping.addNewAttributes') }}
      </a>
      <span class="ps_gs-fz-12 text-dark">
        |
      </span>
      <b-button
        size="sm"
        variant="link"
        class="p-0 text-left border-0 ps_gs-fz-12 font-weight-normal text-decoration-underline"
        @click="refreshComponent"
      >
        {{ $t('productFeedSettings.attributeMapping.refreshAttributes') }}
        <i class="material-icons ps_gs-fz-12">refresh</i>
      </b-button>
    </div>

    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableContinue"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
    <settings-footer />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import AttributeField from './attribute-field.vue';
import CategoryButton from './category-button.vue';
import googleUrl from '@/assets/json/googleUrl.json';
import Categories, {SelectedProductCategories} from '@/enums/product-feed/attribute-mapping-categories';
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import {getDataFromLocalStorage} from '@/utils/LocalStorage';
import {AttributeToMap, mergeAttributeMappings} from '@/utils/AttributeMapping';

export default defineComponent({
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    SettingsFooter,
    ActionsButtons,
    AttributeField,
    CategoryButton,
  },
  data() {
    return {
      loading: false,
      selectedProductCategories: [Categories.NONE] as SelectedProductCategories,
      mappingAttributes: [] as AttributeToMap[],
    };
  },
  computed: {
    mappingSectionVisible() {
      return this.selectedProductCategories.length;
    },
    attributeToEdit() {
      return this.$route.hash.substring(1).toUpperCase();
    },
    disableContinue() {
      return this.selectedProductCategories.length === 0;
    },
    previouslySelectedProductCategories(): SelectedProductCategories {
      return getDataFromLocalStorage('productFeed-selectedProductCategories') || this.$store.getters['productFeed/GET_PRODUCT_CATEGORIES_SELECTED'];
    },
    categories() {
      return [
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.apparelAndAccessoriesTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.apparelAndAccessoriesSubtitle'),
          icon: 'checkroom',
          value: Categories.APPAREL_AND_ACCESSORIES,
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.electronicsTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.electronicsSubtitle'),
          icon: 'blender_black',
          value: Categories.ELECTRONICS,
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.variantSetsTitle'),
          subtitle: this.$i18n.t('productFeedSettings.attributeMapping.variantSetsSubtitle'),
          icon: 'filter_3',
          value: Categories.VARIANT_SETS,
        },
        {
          title: this.$i18n.t('productFeedSettings.attributeMapping.commonsTitle'),
          icon: 'select_all',
          value: Categories.NONE,
        },
      ];
    },
    existingAttributes() {
      return mergeAttributeMappings(
        this.$store.getters['productFeed/GET_FREE_LISTING_ATTRIBUTES_TO_MAP'],
        getDataFromLocalStorage('productFeed-attributeMapping'),
      );
    },
    attributesToMap() {
      return this.existingAttributes
        .filter(
          (attr: AttributeToMap) => this.selectedProductCategories.includes(attr.category)
            || attr.category === Categories.COMMONS,
        );
    },
  },
  methods: {
    previousStep() {
      // Merchants used to be able to configure their carriers later on GMC.
      // For backward compatibility, we need to send them back to the first step
      // if they haven't swtiched on the new version yet.
      if (this.$store.getters['productFeed/GET_PRODUCT_FEED_REQUIRED_RECONFIGURATION']) {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 1);
        this.$router.push({
          name: 'product-feed-settings',
          params: {
            step: ProductFeedSettingsPages.SHIPPING_SETUP,
          },
        });
      } else {
        this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 2);
        this.$router.push({
          name: 'product-feed-settings',
          params: {
            step: ProductFeedSettingsPages.SHIPPING_SETTINGS,
          },
        });
      }
      window.scrollTo(0, 0);
    },
    tooltipFormat(name) {
      return this.$t(`tooltip.attributeMapping.${name}`);
    },
    nextStep() {
      this.$segment.track('[GGL] Product feed config - Step 3', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      localStorage.setItem('productFeed-attributeMapping', JSON.stringify(this.mappingAttributes));
      localStorage.setItem('productFeed-selectedProductCategories', JSON.stringify(this.selectedProductCategories));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SYNC_SCHEDULE,
        },
      });
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
    categoryProductsChanged(clickedCategory: Categories, isSelected: boolean) {
      if (!isSelected) {
        return;
      }
      // At this moment, we can have all the possible values in the array
      let getSelectedCtg = this.selectedProductCategories;

      if (clickedCategory === Categories.NONE) {
        getSelectedCtg = getSelectedCtg.filter((cat: Categories) => cat === Categories.NONE);
      }
      if (clickedCategory !== Categories.NONE) {
        getSelectedCtg = getSelectedCtg.filter((cat: Categories) => cat !== Categories.NONE);
      }
      this.selectedProductCategories = getSelectedCtg;
    },
    refreshComponent() {
      this.$store.dispatch('productFeed/REQUEST_SHOP_TO_GET_ATTRIBUTE');
    },
  },
  watch: {
    previouslySelectedProductCategories: {
      handler(newValue: SelectedProductCategories): void {
        this.selectedProductCategories = newValue;
      },
      immediate: true,
    },
    attributesToMap: {
      handler(newValue): void {
        // Reload previously saved data each time the selected categories are updated.
        // If the merchant mapped a field, then updates the category on products,
        // configuration will be reset.
        this.mappingAttributes = JSON.parse(JSON.stringify(newValue));
      },
      immediate: true,
    },
  },
  mounted() {
    this.loading = true;
    this.$store.dispatch('productFeed/REQUEST_SHOP_TO_GET_ATTRIBUTE').then(() => {
      this.$store.dispatch('productFeed/REQUEST_ATTRIBUTE_MAPPING').finally(() => {
        this.loading = false;
      });
    });
  },
  googleUrl,
});
</script>
