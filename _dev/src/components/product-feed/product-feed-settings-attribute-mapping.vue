<template>
  <div>
    <p>
      {{ $t('productFeedSettings.attributeMapping.intro') }}
    </p>
    <p class="text-muted">
      <a
        class="ps_gs-fz-12"
        href="//google.com"
        target="_blank"
      >
        {{ $t('productFeedSettings.attributeMapping.learnAboutAttributeMapping') }}
      </a>
    </p>
    <p class="text-muted ps_gs-fz-12">
      {{ $t('productFeedSettings.attributeMapping.introNotice') }}
    </p>
    <section class="mt-4 pt-2">
      <h2>1. {{ $t('productFeedSettings.attributeMapping.genericTitle') }}</h2>
      <p>
        {{ $t('productFeedSettings.attributeMapping.toDescribeProducts') }}
      </p>
      <b-table-simple
        stacked="md"
        variant="light"
        borderless
        class="mx-n1"
      >
        <b-thead>
          <b-tr>
            <b-th class="border-0 font-weight-600 text-decoration-underline">
              {{ $t('productFeedSettings.attributeMapping.googleAttribute') }}
            </b-th>
            <b-th class="border-0 font-weight-600 text-decoration-underline">
              {{ $t('productFeedSettings.attributeMapping.prestashopAttribute') }}
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr>
            <b-td class="align-top">
              <span class="font-weight-bold d-flex align-items-center">
                {{ $t('productFeedSettings.attributeMapping.description') }}
                <b-button
                  v-b-tooltip
                  title="Tooltip!"
                  variant="invisible"
                  class="ml-1 p-0 border-0 ps_gs-fz-12 color-grey_darklight"
                >
                  <span class="material-icons-round mb-0 ps_gs-fz-12 align-middle">
                    error_outline
                  </span>
                  <span class="sr-only">Tooltip!</span>
                </b-button>
              </span>
            </b-td>
            <b-td class="align-top">
              {{ $t('productFeedSettings.attributeMapping.longDescription') }}
              <!-- Not in batch 1 -->
              <!-- <b-form-group class="mb-0 text-left">
                <b-form-radio
                  v-model="selectedDescriptionLength"
                  name="descriptionRadio"
                  :value="false"
                  class="mb-2"
                  :checked="!selectedDescriptionLength"
                >
                  {{ $t('productFeedSettings.attributeMapping.longDescription') }}
                </b-form-radio>
                <b-form-radio
                  v-model="selectedDescriptionLength"
                  name="descriptionRadio"
                  :value="true"
                  :checked="selectedDescriptionLength"
                >
                  {{ $t('productFeedSettings.attributeMapping.shortDescription') }}
                </b-form-radio>
              </b-form-group> -->
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </section>
    <section class="mt-4">
      <h2>2. {{ $t('productFeedSettings.attributeMapping.specificTitle') }}</h2>
      <div class="ps_gs-attribute-mapping-questions">
        <div
          class="font-weight-600 font-italic"
        >
          {{ $t('productFeedSettings.attributeMapping.sellRefurbished') }}
        </div>
        <b-form-checkbox
          switch
          size="lg"
          class="ml-sm-4 ps_gs-switch"
          v-model="sellRefurbished"
        >
          <span class="ps_gs-fz-14">
            {{
              sellRefurbished
                ? $t('cta.yes')
                : $t('cta.no')
            }}
          </span>
        </b-form-checkbox>
        <div
          class="font-weight-600 font-italic"
        >
          {{ $t('productFeedSettings.attributeMapping.sellApparel') }}
        </div>
        <b-form-checkbox
          v-model="sellApparel"
          switch
          size="lg"
          class="ml-sm-4 ps_gs-switch"
        >
          <span class="ps_gs-fz-14">
            {{
              sellApparel
                ? $t('cta.yes')
                : $t('cta.no')
            }}
          </span>
        </b-form-checkbox>
      </div>
      <template
        v-if="sellRefurbished || sellApparel"
      >
        <p class="mt-3 mb-2 pt-2">
          {{ $t('productFeedSettings.attributeMapping.weWillRecoverTheseAttributes') }}
        </p>
        <b-table-simple
          stacked="md"
          class="mx-n1"
          table-class="border-bottom-0 table-firstline-borderless ps_gs-table-attribute-mapping"
        >
          <b-thead>
            <b-tr>
              <b-th class="border-0 font-weight-600 text-decoration-underline">
                {{ $t('productFeedSettings.attributeMapping.googleAttribute') }}
              </b-th>
              <b-th class="border-0 font-weight-600 text-decoration-underline">
                {{ $t('productFeedSettings.attributeMapping.prestashopAttribute') }}
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-if="sellRefurbished">
              <product-feed-settings-attribute-mapping-tablerow-specific
                v-for="input in refurbishedInputs"
                :key="input"
                :input="input"
              />
            </template>
            <template v-if="sellApparel">
              <product-feed-settings-attribute-mapping-tablerow-specific
                v-for="input in apparelInputs"
                :key="input"
                :input="input"
              />
            </template>
          </b-tbody>
        </b-table-simple>
      </template>
      <div class="text-muted ps_gs-fz-12 mt-4">
        <p class="mb-3 ps_gs-required">
          {{ $t('productFeedSettings.attributeMapping.footerNotice1') }}
        </p>
        <p>
          {{ $t('productFeedSettings.attributeMapping.footerNotice2') }}
          <br>
          <a
            href="//google.com"
            target="_blank"
          >
            {{ $t('productFeedSettings.attributeMapping.learnRequirementsProductSpeficifacion') }}
          </a>
        </p>
      </div>
    </section>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        @click="goBack"
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.back") }}
      </b-button>

      <b-button
        @click="cancel"
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        @click="nextStep"
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.saveAndContinue") }}
      </b-button>
    </div>
    <product-feed-settings-footer />
  </div>
</template>

<script>
import {
  BTableSimple,
} from 'bootstrap-vue';

import ProductFeedSettingsAttributeMappingTablerowSpecific from './product-feed-settings-attribute-mapping-tablerow-specific';
import ProductFeedSettingsFooter from './product-feed-settings-footer';

export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    BTableSimple,
    ProductFeedSettingsAttributeMappingTablerowSpecific,
    ProductFeedSettingsFooter,
  },
  data() {
    return {
      refurbishedInputs: ['condition'],
      apparelInputs: ['color', 'size', 'ageGroup', 'gender'],

    };
  },
  computed: {
    disableContinue() {
      return false;
    },
    selectedDescriptionLength: {
      get() {
        return this.$store.state.productFeed.productFeed.settings.exportProductsWithShortDescription
        || null;
      },
      set(value) {
        this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
          name: 'exportProductsWithShortDescription',
          data: value,
        });
      },
    },
    sellApparel: {
      get() {
        return !!this.$store.state.productFeed.productFeed.settings.sellApparel.color;
      },
      set(value) {
        if (value === false) {
          return this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
            name: 'sellApparel',
            data: {},
          });
        }
        return this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
          name: 'sellApparel',
          data: {color: ['red']},
        });
      },
    },
    sellRefurbished: {
      get() {
        return !!this.$store.state.productFeed.productFeed.settings.sellRefurbished.length;
      },
      set(value) {
        if (value === false) {
          return this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
            name: 'sellRefurbished',
            data: [],
          });
        }
        return this.$store.commit('productFeed/SET_SELECTED_PRODUCT_FEED_SETTINGS', {
          name: 'sellRefurbished',
          data: ['new'],
        });
      },
    },
  },
  methods: {
    goBack() {
      this.$store.commit('productFeed/UPDATE_STEPPER', 2);
    },
    nextStep() {
      this.$store.commit('productFeed/UPDATE_STEPPER', 4);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
};
</script>
