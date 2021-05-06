<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
  >
    <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="
            isEnabled
              ? require('@/assets/images/product-feed-icon.svg')
              : require('@/assets/images/product-feed-icon-grey.svg')
          "
          width="40"
          height="40"
          alt=""
        />
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          {{ $t("productFeedCard.title") }}
        </b-card-text>
      </div>
      <div
        v-if="!toConfigure && isEnabled"
        class="form-group ml-auto mb-0"
      >
        <span class="ps-switch ps-switch-sm">
          <input
            type="radio"
            name="switchEnable"
            v-model="enabledProductFeed"
            :value="false"
          >
          <label for="example_off_3">{{ $t('cta.disabled') }}</label>
          <input
            type="radio"
            name="switchEnable"
            v-model="enabledProductFeed"
            :value="true"
            checked
          >
          <label for="example_on_3">{{ $t('cta.enabled') }}</label>
          <span class="slide-button" />
        </span>
      </div>
    </div>
    <p class="ps_gs-fz-12">
      {{ $t("productFeedCard.intro") }}
    </p>
    <div v-if="!isEnabled" class="d-flex mt-2">
      <span class="mr-2">
        <b-icon-exclamation-circle />
      </span>
      <ul class="list-inline mb-0">
        <li class="list-inline-item" v-b-tooltip.hover title="Tooltip directive content">
          <b-badge variant="muted">
            {{ $t("badge.mca") }}
          </b-badge>
        </li>
        <li class="list-inline-item" v-b-tooltip.hover title="Tooltip directive content">
          <b-badge variant="muted">
            {{ $t("badge.productFeedSettings") }}
          </b-badge>
        </li>
      </ul>
    </div>
    <div v-if="isEnabled && toConfigure">
      <p>
        {{ $t("productFeedCard.introToConfigure") }}<br />
        <a
          class="ps_gs-fz-12 text-muted"
          :href="$options.googleUrl.productConfiguration"
          target="_blank"
        >
          {{ $t("cta.learnAboutProductConfiguration") }}
        </a>
      </p>
      <stepper class="mt-2" :steps="steps" :active-step="1" />
      <div
        class="d-flex justify-content-center justify-content-md-end mt-n1"
        v-if="isEnabled"
      >
        <b-button size="sm" variant="primary">
          {{ $t("cta.configureAndExportProductFeed") }}
        </b-button>
      </div>
    </div>
    <div v-if="isEnabled && !toConfigure">
      <b-alert
        :variant="alertVariant"
        :show="!!alert"
      >
        <VueShowdown
          :markdown="!!alert && $t(`productFeedCard.alert${alert}`, alertLink)"
          :extensions="['targetlink']"
        />
        <div
          v-if="alert === 'ProductFeedExists'"
          class="mt-1"
        >
          <b-button variant="outline-secondary">{{ $t('cta.overwriteProductFeed') }}</b-button>
        </div>
      </b-alert>
      <h3
        class="font-weight-600 ps_gs-fz-14"
        :class="syncStatus === 'error' ? 'mb-0' : 'mb-3'"
      >
        <i
          v-if="syncStatus === 'busy'"
          class="icon-busy icon-busy--dark mr-1 align-middle"
        />
        <b-icon-exclamation-circle
          v-if="syncStatus === 'error'"
          variant="danger"
          class="d-inline-block align-middle mr-1"
        />
        <b-icon-exclamation-triangle-fill
          v-if="syncStatus === 'warning'"
          variant="warning"
          class="d-inline-block align-middle mr-1"
        />
        <b-iconstack
          v-if="syncStatus === 'success'"
          font-scale="1.5"
          class="mr-1 fixed-size color-green align-center"
          width="16"
          height="16"
        >
          <b-icon-circle-fill stacked />
          <b-icon-check stacked variant="white" />
        </b-iconstack>
        <span class="align-middle">
          {{ syncStatusMessage }}
        </span>
      </h3>
      <div class="d-sm-flex align-items-end mb-1">
        <p class="ps_gs-fz-12 text-muted mb-0">
          {{ $t("productFeedCard.nextSync", [nextSyncTime]) }}
        </p>
        <a
          href=""
          class="font-weight-600 ps_gs-fz-13 text-right ml-auto"
        >
          {{ $t('cta.trackProductStatus') }}
        </a>
        <b-button
          v-if="syncStatus === 'error'"
          variant="primary"
          class="d-block mx-auto my-2 my-sm-0 ml-sm-3 mr-sm-0"
        >
          <span class="material-icons">
            autorenew
          </span>
          {{ $t('cta.forceSync') }}
        </b-button>
      </div>
      <b-container fluid class="p-0 mb-2">
        <b-row no-gutters class="mx-n1">
          <b-col cols class="ps_gs-productfeed-report-card">
            <div class="px-3 py-2">
              <div class="d-flex align-items-center ml-n1 mt-n1 mb-2">
                <b-badge variant="success">
                  {{ $t("badge.readyToSync") }}
                </b-badge>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1"
                  v-b-tooltip.hover
                  title="Tooltip directive content"
                >
                  <b-icon-exclamation-circle
                    font-scale="0.75"
                    width="14"
                    height="14"
                    class="align-middle d-inline-block"
                  />
                </b-button>
              </div>
              <i
                v-if="syncStatus === 'busy'"
                class="icon-busy icon-busy--dark d-block"
              />
              <div
                v-else
                class="d-flex justify-content-between"
              >
                <span class="ps_gs-fz-12 font-weight-600">{{ nbProductsReadyToSync }}</span>
              </div>
            </div>
          </b-col>
          <b-col cols class="ps_gs-productfeed-report-card">
            <div class="px-3 py-2">
              <div class="d-flex align-items-center ml-n1 mt-n1 mb-2">
                <b-badge variant="warning">
                  {{ $t("badge.cantSync") }}
                </b-badge>
                <b-button
                  variant="invisible"
                  class="p-0 mt-0 ml-1"
                  v-b-tooltip.hover
                  title="Tooltip directive content"
                >
                  <b-icon-exclamation-circle
                    width="14"
                    height="14"
                    class="align-middle d-inline-block"
                  />
                </b-button>
              </div>
              <i
                v-if="syncStatus === 'busy'"
                class="icon-busy icon-busy--dark d-block"
              />
              <div
                v-else
                class="d-flex justify-content-between"
              >
                <span class="ps_gs-fz-12 font-weight-600">{{ nbProductsCantSync }}</span>
                <a href="" class="ps_gs-fz-12 font-weight-600">
                  {{ $t('cta.whyDidntWork') }}
                </a>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
      <div class="d-flex justify-content-between align-items-center mb-3 mt-3">
        <h3 class="font-weight-600 ps_gs-fz-14 mb-0">
          {{ $t("productFeedSettings.breadcrumb") }}
        </h3>
      </div>
      <b-container fluid class="p-0 mb-2">
        <b-row no-gutters class="mx-n1">
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.shipping.targetCountries')"
            :description="targetCountries.join(', ')"
            :link="$t('cta.editCountries')"
            linkTo="#"
          />
          <product-feed-card-report-card
            status="warning"
            :title="$t('productFeedSettings.shipping.shippingSettings')"
            :description="shippingSettings"
            :link="$t('cta.editSettings')"
            linkTo="#"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.shipping.taxSettings')"
            :description="taxSettings"
            :link="$t('cta.editSettings')"
            linkTo="#"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.steps.exportRules')"
            :description="exportRules.join(', ')"
            :details="exportRulesDetails.join(', ')"
            :link="$t('cta.editRules')"
            linkTo="#"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedCard.excludedProducts')"
            :description="`${$t('productFeedCard.excludedProducts')} (${excludedProductsDetails.length})`"
            :details="excludedProductsDetails.join(', ')"
            :link="$t('cta.editRules')"
            linkTo="#"
          />
          <product-feed-card-report-card
            status="success"
            :title="$t('productFeedSettings.steps.attributeMapping')"
            :description="attributeMapping.join(', ') + '...'"
            :link="$t('cta.editAttributeMapping')"
            linkTo="#"
          />
          <b-col
            cols
            class="ps_gs-productfeed-report-card ps_gs-productfeed-report-card--full"
          >
            <div class="px-3 py-2">
              <div class="ps_gs-fz-13 font-weight-600">
                <b-iconstack
                  v-if="hasMapping"
                  font-scale="1.5"
                  class="mr-1 fixed-size color-green"
                  width="16"
                  height="16"
                >
                  <b-icon-circle-fill stacked />
                  <b-icon-check stacked variant="white" />
                </b-iconstack>
                {{ $t('productFeedCard.googleTaxonomyAssociation') }}
                <span class="text-muted font-italic font-weight-normal"
                  >-&nbsp;{{ $t('productFeedCard.optional') }}</span
                >
              </div>
              <div
                v-if="hasMapping"
                class="mt-3 d-sm-flex align-items-end text-center"
              >
                <div class="flex-grow-1">
                  <span class="text-success ps_gs-fz-16 font-weight-600">
                    {{
                      $t("productFeedCard.mappedCategories", [
                        categoriesMapped,
                        categoriesTotal,
                      ])
                    }}
                  </span>
                  <b-progress
                    :value="categoriesMapped"
                    :max="categoriesTotal"
                    variant="success"
                    class="mt-2 w-75 mx-auto"
                  />
                </div>
                <b-button class="mt-3 ml-sm-4 mt-sm-0" variant="outline-secondary">
                  {{ $t("cta.modifyMapping") }}
                </b-button>
              </div>
              <div
                v-else
                class="d-sm-flex align-items-end"
              >
                <p class="ps_gs-fz-12 mb-0 flex-grow-1">
                  {{ $t('productFeedCard.attributeDescription') }}<br />
                  <a href="//google.com" target="_blank" class="text-muted">
                    {{ $t('cta.aboutProductCategory') }}
                  </a>
                </p>
                <b-button
                  class="mx-auto mt-3 ml-sm-4 mr-sm-0 mt-sm-0 d-block"
                  variant="outline-secondary"
                >
                  {{ $t("cta.addMapping") }}
                </b-button>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </b-card>
</template>

<script>
import googleUrl from "@/assets/json/googleUrl.json";

import {
  BIconstack,
  BIconCheck,
  BIconCircleFill,
  BIconExclamationCircle,
  BIconExclamationTriangleFill,
} from "bootstrap-vue";
import Stepper from "../commons/stepper";
import ProductFeedCardReportCard from "./product-feed-card-report-card";

export default {
  name: "ProductFeedCard",
  components: {
    BIconstack,
    BIconCheck,
    BIconCircleFill,
    BIconExclamationCircle,
    BIconExclamationTriangleFill,
    Stepper,
    ProductFeedCardReportCard,
  },
  data() {
    return {
      enabledProductFeed: true,
      nextSyncTime: "06/12/21 02:00",
      lastSync: {
        day: "today",
        time: "02:00",
        totalProducts: 200,
      },
      steps: [
        {
          title: this.$i18n.t("productFeedSettings.steps.shippingSettings"),
        },
        {
          title: this.$i18n.t("productFeedSettings.steps.exportRules"),
        },
        {
          title: this.$i18n.t("productFeedSettings.steps.attributeMapping"),
        },
        {
          title: this.$i18n.t("productFeedSettings.steps.categoryMapping"),
        },
        {
          title: this.$i18n.t("productFeedSettings.steps.exportFeed"),
        },
      ],
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    toConfigure: {
      type: Boolean,
      default: true,
    },
    syncStatus: {
      type: String,
      default: null,
      validator: function (value) {
        return [null, "success", "warning", "error", "busy"].indexOf(value) !== -1;
      },
    },
    categoriesTotal: {
      type: Number,
    },
    categoriesMapped: {
      type: Number,
      default: 0,
    },
    alert: {
      type: String,
      default: null,
      validator: function (value) {
        return [null, "Success", "Failed", "ShippingSettingsMissing", "ProductFeedDeactivated", "ProductFeedExists"].indexOf(value) !== -1;
      },
    },
    nbProductsReadyToSync: {
      type: Number,
    },
    nbProductsCantSync: {
      type: Number,
    },
    targetCountries: {
      type: Array,
    },
    shippingSettings: {
      type: String,
    },
    taxSettings: {
      type: String,
    },
    exportRules: {
      type: Array,
    },
    exportRulesDetails: {
      type: Array,
    },
    excludedProductsDetails: {
      type: Array,
    },
    attributeMapping: {
      type: Array,
    },
  },
  computed: {
    syncStatusMessage() {
      let message;
      switch (this.syncStatus) {
        case null:
          break;
        case "busy":
          message = this.$i18n.t("productFeedCard.syncBusy");
          break;
        case "warning":
          message = this.$i18n.t("productFeedCard.syncCantPerform");
          break;
        case "error":
          message = this.$i18n.t("productFeedCard.syncFailedAt", [
            this.lastSync.day,
            this.lastSync.time,
          ]);
          break;
        case "success":
          message = this.$i18n.t("productFeedCard.syncSuccess", [
            this.lastSync.totalProducts,
            this.lastSync.day,
            this.lastSync.time,
          ]);
          break;
        default:
          break;
      }
      return message;
    },
    alertVariant() {
      return this.alert === 'Success' ? 'success' : 'warning';
    },
    alertLink() {
      if (this.alert === 'Failed') {
        return [this.$options.googleUrl.syncFailed];
      } else if (this.alert === 'ShippingSettingsMissing') {
        return [this.$options.googleUrl.shippingSettingsMissing];
      } else {
        return null;
      };
    },
    hasMapping() {
      return this.categoriesMapped > 0
    }
  },
  googleUrl,
};
</script>
