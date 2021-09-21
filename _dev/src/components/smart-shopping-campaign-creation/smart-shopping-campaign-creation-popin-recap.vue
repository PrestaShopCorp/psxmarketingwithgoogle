<template>
  <ps-modal
    id="SSCCreationPopinRecap"
    ref="modal"
    :title="$t('smartShoppingCampaignCreation.recapTitle')"
    v-bind="$attrs"
    @close="cancel"
  >
    <dl class="w-100 d-inline-block">
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputNameLabel') }}
      </dt>
      <dd class="text-secondary mb-3">
        {{ newCampaign.campaignName }}
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
              {{ newCampaign.startDate }}
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
              {{ newCampaign.endDate }}
            </span>
          </b-col>
        </b-form-row>
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputCountryLabel') }}
      </dt>
      <dd class="text-secondary mb-3">
        {{ newCampaign.targetCountry }}
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.recapFiltersLabel') }}
      </dt>
      <dd class="text-secondary mb-3">
        <template v-if="newCampaign.productFilters.length === 0">
          {{ $t('smartShoppingCampaignCreation.recapNoFiltersDescription') }}
        </template>
        <template v-else>
          <div
            v-for="(filter, index) in newCampaign.productFilters"
            :key="index"
          >
            <template>
              titre : {{ filter.dimension }}
              <div
                v-for="(oneValue, indexValue) in filter.values"
                :key="indexValue"
              >
                value : {{ oneValue }}
              </div>
            </template>
          </div>
        </template>
      </dd>
      <dt class="font-weight-600">
        {{ $t('smartShoppingCampaignCreation.inputBudgetFeedback') }}
      </dt>
      <dd class="text-secondary mb-2">
        {{ newCampaign.dailyBudget }} {{ newCampaign.currencyCode }}
      </dd>
    </dl>
    <p>
      {{ $t('smartShoppingCampaignCreation.recapFooter') }}
    </p>
    <template
      slot="modal-footer"
    >
      <b-button
        variant="outline-secondary"
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
  name: 'SSCCreationPopinRecap',
  components: {
    PsModal,
  },
  props: {
    newCampaign: {
      required: true,
      type: Object,
    },
  },

  methods: {
    cancel() {
      this.$refs.modal.hide();
    },
    ok() {
      const finalCampaign = {
        ...this.newCampaign,
        // API wants country code not name so we have to filter it
        targetCountry: this.$options.filters.changeCountriesNamesToCodes(
          [this.newCampaign.targetCountry],
        )[0],
        // Send default status
        status: 'eligible',
      };
      this.$store.dispatch('smartShoppingCampaigns/SAVE_NEW_SSC', finalCampaign).then(() => {
        this.$refs.modal.hide();
        this.$router.push({
          name: 'campaign',
        });
        this.$emit('openPopinSSCCreated');
      });
    },
  },
};
</script>
