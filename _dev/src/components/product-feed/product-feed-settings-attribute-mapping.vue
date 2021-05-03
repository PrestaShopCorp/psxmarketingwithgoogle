<template>
  <div>
    <p>
      Products that are eligible for enhanced listings will appear in content-rich formats on the Shopping tab, which may boost traffic and drive sales.
    </p>
    <p class="text-muted">
      <a class="ps_gs-fz-12" href="//google.com" target="_blank">Learn more about attribute mapping</a>
    </p>
    <p class="text-muted ps_gs-fz-12">
      In addition to the attributes required for standard free listings, the following attributes are required to participate in enhanced listings. Performance may be limited unless you provide all attributes available in your region:
    </p>
    <section class="mt-4 pt-2">
      <h2>1. Generic</h2>
      <p>
        To describe my product attributes, please use:
      </p>
      <b-table-simple
        borderless
        variant="light"
        responsive="sm"
        class="mx-n1"
      >
        <b-thead>
          <b-tr>
            <b-th class="border-0 font-weight-600 text-decoration-underline">
              Google product attribute
            </b-th>
            <b-th class="border-0 font-weight-600 text-decoration-underline">
              PrestaShop product attribute
            </b-th>
          </b-tr>
        </b-thead>
        <b-tr>
          <b-td class="align-top">
            <span class="font-weight-bold d-flex align-items-center">
              Description
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
              <b-form-radio plain
                name="descriptionRadio"
                value="Long"
                class="mb-2"
              >
                Long description
              </b-form-radio>
              <b-form-radio plain
                name="descriptionRadio"
                value="Short"
              >
                Short description
              </b-form-radio>
            </b-form-group>
          </b-td>
        </b-tr>
      </b-table-simple>
    </section>
    <section class="mt-4">
      <h2>2. Specific</h2>
      <div style="display: -ms-grid; display: grid; -ms-grid-columns: max-content 1fr; grid-template-columns: max-content 1fr">
        <div
          class="font-weight-600 font-italic"
        >
          Do you sell refurbished products
        </div>
        <b-form-checkbox
          switch
          size="lg"
          class="ml-4 mb-3 ps_gs-switch"
          v-model="sellRefurbished"
        >
          <span class="ps_gs-fz-14">
            {{ sellRefurbished ? 'Yes' : 'No' }}
          </span>
        </b-form-checkbox>
        <div
          class="font-weight-600 font-italic"
        >
          Do you sell apparel and accessories ?
        </div>
        <b-form-checkbox
          v-model="sellApparel"
          switch
          size="lg"
          class="ml-4 mb-3 ps_gs-switch"
        >
         <span class="ps_gs-fz-14">
           {{ sellApparel ? 'Yes' : 'No' }}
         </span>
        </b-form-checkbox>
      </div>
      <template
        v-if="sellRefurbished || sellApparel"
      >
        <p>
          To describe my product attributes, please use:
        </p>
        <b-table-simple
          responsive="sm"
          class="mx-n1"
          table-class="border-bottom-0"
        >
          <b-thead>
            <b-tr>
              <b-th class="border-0 font-weight-600 text-decoration-underline">
                Google product attribute
              </b-th>
              <b-th class="border-0 font-weight-600 text-decoration-underline">
                PrestaShop product attribute
              </b-th>
            </b-tr>
          </b-thead>
          <template v-if="sellRefurbished">
            <b-tr>
              <b-td class="align-top border-top-0">
                <span class="font-weight-bold d-flex align-items-center">
                  Condition
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
              <b-td class="align-top border-top-0">
                <b-form-group class="mb-0 text-left">
                  <b-form-radio plain
                    name="conditionRadio"
                    value="default"
                    class="mb-2"
                  >
                    The "Condition" field
                  </b-form-radio>
                  <div class="d-flex align-items-center">
                    <b-form-radio plain
                      name="conditionRadio"
                      value="custom"
                      class="flex-shrink-0 pr-5"
                    >
                      This custom field
                    </b-form-radio>
                    <b-select
                      class="mb-3 mb-md-0"
                      disabled
                    >
                      <b-form-select-option
                        v-for="(option, index) in ['Option 1', 'Option 2']"
                        :key="index"
                        :value="index"
                      >
                        {{ option }}
                      </b-form-select-option>
                    </b-select>
                  </div>
                </b-form-group>
              </b-td>
            </b-tr>
          </template>
          <template v-if="sellApparel">
            <b-tr>
              <b-td class="align-top">
                <span class="font-weight-bold d-flex align-items-center">
                  Color
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
                  <b-form-radio plain
                    name="colorRadio"
                    value="default"
                    class="mb-2"
                  >
                    The "Color" field
                  </b-form-radio>
                  <div class="d-flex align-items-center">
                    <b-form-radio plain
                      name="colorRadio"
                      value="custom"
                      class="flex-shrink-0 pr-5"
                    >
                      This custom field
                    </b-form-radio>
                    <b-select
                      class="mb-3 mb-md-0"
                      disabled
                    >
                      <b-form-select-option
                        v-for="(option, index) in ['Option 1', 'Option 2']"
                        :key="index"
                        :value="index"
                      >
                        {{ option }}
                      </b-form-select-option>
                    </b-select>
                  </div>
                </b-form-group>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td class="align-top">
                <span class="font-weight-bold d-flex align-items-center">
                  Size
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
                  <b-form-radio plain
                    name="sizeRadio"
                    value="default"
                    class="mb-2"
                  >
                    The "Size" field
                  </b-form-radio>
                  <div class="d-flex align-items-center">
                    <b-form-radio plain
                      name="sizeRadio"
                      value="custom"
                      class="flex-shrink-0 pr-5"
                    >
                      This custom field
                    </b-form-radio>
                    <b-select
                      class="mb-3 mb-md-0"
                      disabled
                    >
                      <b-form-select-option
                        v-for="(option, index) in ['Option 1', 'Option 2']"
                        :key="index"
                        :value="index"
                      >
                        {{ option }}
                      </b-form-select-option>
                    </b-select>
                  </div>
                </b-form-group>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td class="align-top">
                <span class="font-weight-bold d-flex align-items-center">
                  Age group
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
                  <b-form-radio plain
                    name="ageRadio"
                    value="default"
                    class="mb-2"
                  >
                    The "Age group" field
                  </b-form-radio>
                  <div class="d-flex align-items-center">
                    <b-form-radio plain
                      name="ageRadio"
                      value="custom"
                      class="flex-shrink-0 pr-5"
                    >
                      This custom field
                    </b-form-radio>
                    <b-select
                      class="mb-3 mb-md-0"
                      disabled
                    >
                      <b-form-select-option
                        v-for="(option, index) in ['Option 1', 'Option 2']"
                        :key="index"
                        :value="index"
                      >
                        {{ option }}
                      </b-form-select-option>
                    </b-select>
                  </div>
                </b-form-group>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td class="align-top">
                <span class="font-weight-bold d-flex align-items-center">
                  Gender
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
                  <b-form-radio plain
                    name="genderRadio"
                    value="default"
                    class="mb-2"
                  >
                    The "Gender" field
                  </b-form-radio>
                  <div class="d-flex align-items-center">
                    <b-form-radio plain
                      name="genderRadio"
                      value="custom"
                      class="flex-shrink-0 pr-5"
                    >
                      This custom field
                    </b-form-radio>
                    <b-select
                      class="mb-3 mb-md-0"
                      disabled
                    >
                      <b-form-select-option
                        v-for="(option, index) in ['Option 1', 'Option 2']"
                        :key="index"
                        :value="index"
                      >
                        {{ option }}
                      </b-form-select-option>
                    </b-select>
                  </div>
                </b-form-group>
              </b-td>
            </b-tr>
          </template>
        </b-table-simple>
      </template>
      <div class="text-muted ps_gs-fz-12 mt-4">
        <p class="mb-3">
          Note that you must provide shipping costs for enhanced listings on surfaces across Google. You can set up shipping by using the shipping attribute in the feed or define shipping settings on the account level.<br>
          <a href="//google.com" target="_blank">Learn more about shipping settings</a>
          <a href="//google.com" target="_blank" class="ml-2">Learn how to set up shipping</a>
        </p>
        <p>
          We encourage submitting as many applicable attributes as possible to ensure accurate and comprehensive data.<br>
          <a href="//google.com" target="_blank">Learn more about requirements for the Shopping product data specification</a>
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

export default {
  name: 'ProductFeedSettingsAttributeMapping',
  components: {
    BTable,
    BIconExclamationCircle,
  },
  data() {
    return {
      disableContinue: true,
      sellRefurbished: false,
      sellApparel: false,
    };
  },
  methods: {
  },
  computed: {
  },
  mounted() {
  },
};
</script>
