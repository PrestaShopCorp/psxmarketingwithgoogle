<template>
  <ps-modal
    id="SmartShoppingCampaignCreationPopinRecap"
    :title="'Summary of the campaign'"
    v-bind="$attrs"
    @close="cancel"
    ref="SmartShoppingCampaignCreationPopinRecap"
  >
    <dl>
      <dt>
        {{ $t('smartShoppingCampaingCreation.inputNameLabel') }}
      </dt>
      <dd class="text-secondary">
        {{ campaignDetails.name }}
      </dd>
      <dt>{{ $t('smartShoppingCampaingCreation.inputDurationLabel') }}</dt>
      <dd>
        <b-form-row>
          <b-col
            cols="12"
            md="4"
            class="mb-3 mb-md-0"
          >
            <span>
              {{ $t('smartShoppingCampaingCreation.inputDurationLabel1') }}
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
              {{ $t('smartShoppingCampaingCreation.inputDurationLabel2') }}
            </span><br>
            <span class="text-secondary">
              {{ campaignDetails.duration.endDate }}
            </span>
          </b-col>
        </b-form-row>
      </dd>
      <dt>
        {{ $t('smartShoppingCampaingCreation.inputCountryLabel') }}
      </dt>
      <dd class="text-secondary">
        {{ campaignDetails.targetCountry }}
      </dd>
      <dt>
        Products in Campaign
      </dt>
      <dd class="text-secondary">
        <template v-if="campaignDetails.filters.length === 0">
          All synced products approved by Google
        </template>
        <!-- TODO v-else -->
      </dd>
      <dt>
        {{ $t('smartShoppingCampaingCreation.inputBudgetFeedback') }}
      </dt>
      <dd class="text-secondary">
        {{ campaignBudgetString }}
      </dd>
    </dl>
    <p>
      Check the information of your campaign before validating it. You can always modify some parameters while the campaign is in progress.
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
      let campaignDetails = {
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
}
</script>
