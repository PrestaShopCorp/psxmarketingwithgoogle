<template>
  <ps-modal
    id="SmartShoppingCampaignCreationPopinRecap"
    :title="$t('smartShoppingCampaignCreation.recapTitle')"
    v-bind="$attrs"
    @close="cancel"
    ref="SmartShoppingCampaignCreationPopinRecap"
  >
    <dl class="w-100 d-inline-block">
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputNameLabel') }}
      </dt>
      <dd class="text-secondary mb-3">
        {{ campaignDetails.name }}
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputDurationLabel') }}
      </dt>
      <dd class="mb-3">
        <b-form-row>
          <b-col
            cols="12"
            md="4"
            class="mb-2 mb-md-0"
          >
            <span>
              {{ $t('smartShoppingCampaignCreation.inputDurationLabel1') }}
            </span><br>
            <span class="text-secondary">
              {{ campaignDetails.duration.startDate }}
            </span>
          </b-col>
          <b-col
            cols="12"
            md="4"
          >
            <span>
              {{ $t('smartShoppingCampaignCreation.inputDurationLabel2') }}
            </span><br>
            <span class="text-secondary">
              {{ campaignDetails.duration.endDate }}
            </span>
          </b-col>
        </b-form-row>
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputCountryLabel') }}
      </dt>
      <dd class="text-secondary mb-3">
        {{ campaignDetails.targetCountry }}
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.recapFiltersLabel') }}
      </dt>
      <dd class="text-secondary mb-3">
        <template v-if="campaignDetails.filters.length === 0">
          {{ $t('smartShoppingCampaignCreation.recapNoFiltersDescription') }}
        </template>
        <!-- TODO v-else -->
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputBudgetFeedback') }}
      </dt>
      <dd class="text-secondary mb-2">
        {{ campaignBudgetString }}
      </dd>
    </dl>
    <p>
      {{ $t('smartShoppingCampaignCreation.recapFooter') }}
    </p>
    <template
      slot="modal-footer"
    >
      <b-button
        variant="invisible"
        class="text-secondary"
        @click="cancel"
      >
        {{ $t("cta.cancel") }}
      </b-button>
      <b-button
        variant="primary"
        @click="ok()"
      >
        {{ $t("cta.validate") }}
      </b-button>
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'SmartShoppingCampaignCreationPopinRecap',
  components: {
    PsModal,
  },
  computed: {
    campaignDetails() {
      const campaignDetails = {
        // TODO: get details from store
        name: 'foo bar',
        duration: {
          startDate: '08/30/2021',
          endDate: '11/30/2021',
        },
        targetCountry: 'France',
        filters: [],
        dailyBudget: 125,
        currency: {
          symbol: '$',
          abbreviation: 'USD',
        },
      };
      return campaignDetails;
    },
    campaignBudgetString() {
      const {
        dailyBudget,
        currency: {
          symbol,
          abbreviation,
        },
      } = this.campaignDetails;
      return `${dailyBudget}${symbol} ${abbreviation}`;
    },
  },
  methods: {
    cancel() {

    },
    ok() {

    },
  },
};
</script>
