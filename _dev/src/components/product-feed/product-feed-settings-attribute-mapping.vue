<template>
  <div>
    <p>
      {{ $t('productFeedSettings.attributeMapping.intro') }}
    </p>
    <p class="text-muted">
      <a class="ps_gs-fz-12" href="//google.com" target="_blank">
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
        <product-feed-settings-attribute-mapping-tablehead />
        <b-tbody>
          <b-tr>
            <b-td class="align-top">
              <span class="font-weight-bold d-flex align-items-center">
                {{ $t('productFeedSettings.attributeMapping.description') }}
                <b-button
                  v-b-tooltip
                  title="Tooltip!"
                  variant="invisible"
                  class="ml-1 p-0 border-0 ps_gs-fz-12"
                >
                  <b-icon-exclamation-circle />
                  <span class="sr-only">Tooltip!</span>
                </b-button>
              </span>
            </b-td>
            <b-td class="align-top">
              <b-form-group class="mb-0 text-left">
                <b-form-radio
                  v-model="selectedDescriptionLength"
                  name="descriptionRadio"
                  value="long"
                  class="mb-2"
                >
                  {{ $t('productFeedSettings.attributeMapping.longDescription') }}
                </b-form-radio>
                <b-form-radio
                  v-model="selectedDescriptionLength"
                  name="descriptionRadio"
                  value="short"
                >
                  {{ $t('productFeedSettings.attributeMapping.shortDescription') }}
                </b-form-radio>
              </b-form-group>
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
          class="ml-sm-4 mb-3 ps_gs-switch"
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
          class="ml-sm-4 mb-3 ps_gs-switch"
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
        <p>
          {{ $t('productFeedSettings.attributeMapping.toDescribeProducts') }}
        </p>
        <b-table-simple
          stacked="md"
          class="mx-n1"
          table-class="border-bottom-0 table-firstline-borderless"
        >
          <product-feed-settings-attribute-mapping-tablehead />
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
        <p class="mb-3">
          {{ $t('productFeedSettings.attributeMapping.footerNotice1') }}
          <br>
          <a href="//google.com" target="_blank">
            {{ $t('productFeedSettings.attributeMapping.learnAboutShippingSettings') }}
          </a>
          <a href="//google.com" target="_blank" class="ml-2">
            {{ $t('productFeedSettings.attributeMapping.learnHowToSetupShippingSettings') }}
          </a>
        </p>
        <p>
          {{ $t('productFeedSettings.attributeMapping.footerNotice2') }}
          <br>
          <a href="//google.com" target="_blank">
            {{ $t('productFeedSettings.attributeMapping.learnRequirementsProductSpeficifacion') }}
          </a>
        </p>
      </div>
    </section>
    <div class="d-md-flex text-center justify-content-end mt-3">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.back") }}
      </b-button>
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        size="sm"
        :disabled="disableContinue"
        class="mx-1 mt-3 mt-md-0 mr-md-0"
        variant="primary"
      >
        {{ $t("cta.saveAndContinue") }}
      </b-button>
    </div>
    <div class="text-muted ps_gs-fz-12 mb-0 mt-2 d-flex align-items-start align-items-sm-center justify-content-end">
      <b-button
        v-b-tooltip
        title="Tooltip!"
        variant="invisible"
        class="mr-1 text-muted p-0 border-0"
      >
        <b-icon-exclamation-circle />
        <span class="sr-only">Tooltip!</span>
      </b-button>
      <p>
        {{ $t("productFeedSettings.noticeDataStored") }}
      </p>
    </div>
  </div>
</template>

<script>

import {
  BTable,
  BIconExclamationCircle,
} from 'bootstrap-vue';
import ProductFeedSettingsAttributeMappingTablehead from './product-feed-settings-attribute-mapping-tablehead';
import ProductFeedSettingsAttributeMappingTablerowSpecific from './product-feed-settings-attribute-mapping-tablerow-specific';

export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    BTable,
    BIconExclamationCircle,
    ProductFeedSettingsAttributeMappingTablerowSpecific,
    ProductFeedSettingsAttributeMappingTablehead,
  },
  data() {
    return {
      disableContinue: true,
      sellRefurbished: false,
      sellApparel: false,
      refurbishedInputs: ['condition'],
      apparelInputs: ['color', 'size', 'ageGroup', 'gender'],
      selectedDescriptionLength: 'long',
    };
  },
};
</script>
