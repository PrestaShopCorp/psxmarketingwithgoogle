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
              {{
                $t('smartShoppingCampaignCreation.inputDurationLabel1')
              }} </span><br>
            <span class="text-secondary">
              {{ newCampaign.startDate | timeConverterToDate }}
            </span>
          </b-col>
          <b-col
            cols="12"
            md="4"
          >
            <span>
              {{
                $t('smartShoppingCampaignCreation.inputDurationLabel2')
              }} </span><br>
            <span class="text-secondary">
              {{ endDate }}
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
        {{ $t('smartShoppingCampaignCreation.inputFiltersLegend') }}
      </dt>
      <dd class="text-secondary mb-3">
        <template v-if="filtersExist">
          {{ $tc(
            'smartShoppingCampaignCreation.filtersWithxValues',
            this.totalProducts,
            [
              $t(`smartShoppingCampaignCreation.${dimensionName}`),
              this.totalProducts,
            ],
          ),
          }}
        </template>
        <template v-else>
          {{ $t('smartShoppingCampaignCreation.recapNoFiltersDescription') }}
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
    <template slot="modal-footer">
      <b-button
        variant="outline-secondary"
        class="text-secondary"
        @click="cancel"
      >
        {{ $t('cta.cancel') }}
      </b-button>
      <b-button
        variant="primary"
        @click="editionMode ? editCampaign() : ok()"
      >
        <template v-if="!isValidating">
          {{ $t('cta.validate') }}
        </template>
        <template v-else>
          {{ $t('cta.validating') }}
          <span class="ml-1 icon-busy" />
        </template>
      </b-button>
    </template>
  </ps-modal>
</template>

<script>
import CampaignStatus, {
  CampaignStatusToggle, CampaignTypes,
} from '@/enums/reporting/CampaignStatus';
import PsModal from '../../commons/ps-modal';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import compareYears from '../../../utils/CompareYears';

export default {
  name: 'SSCCreationPopinRecap',
  components: {
    PsModal,
  },
  props: {
    newCampaign: {
      required: true,
      type: Object,
      default: () => null,
    },
    filtersExist: {
      required: false,
      type: Boolean,
      default: false,
    },
    editionMode: {
      required: false,
      type: Boolean,
      default: false,
    },
    totalProducts: {
      required: false,
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      isValidating: false,
    };
  },
  computed: {
    dimensionName() {
      return this.$store.state.campaigns.dimensionChosen.name;
    },
    endDate() {
      if (this.newCampaign.endDate) {
        const isThereAnEndDate = compareYears(this.newCampaign.endDate);

        return isThereAnEndDate
          ? this.$options.filters.timeConverterToDate(this.newCampaign.endDate)
          : null;
      }
      return '-';
    },
  },

  methods: {
    cancel() {
      this.$refs.modal.hide();
    },
    ok() {
      this.$segment.track('[GGL] Create SSC Validation Step', {
        module: 'psxmarketingwithgoogle',
        remarketing_conversion_value:
          this.$store.state.campaigns.tracking,
        params: SegmentGenericParams,
      });
      this.isValidating = true;
      const finalCampaign = {
        ...this.newCampaign,
        // API wants country code not name so we have to filter it
        targetCountry: this.$options.filters.changeCountriesNamesToCodes([
          this.newCampaign.targetCountry,
        ])[0],
        // Send default status
        status: CampaignStatus.ELIGIBLE,
        type: CampaignTypes.PERFORMANCE_MAX,
      };
      this.$store
        .dispatch('campaigns/SAVE_NEW_CAMPAIGN', finalCampaign)
        .then((resp) => {
          this.$refs.modal.hide();
          if (resp && resp.error) {
            this.isValidating = false;
            this.$emit('displayErrorApiWhenSavingSSC');
          } else {
            this.$router.push({
              name: 'campaign-list',
            });
            this.$emit('openPopinSSCCreated');
            this.isValidating = false;
          }
        });
    },
    editCampaign() {
      this.isValidating = true;
      const payload = {
        ...this.newCampaign,
        // API wants country code not name so we have to filter it
        targetCountry: this.$options.filters.changeCountriesNamesToCodes([
          this.newCampaign.targetCountry,
        ])[0],
        status: CampaignStatusToggle.ENABLED,
      };
      this.$store
        .dispatch('campaigns/UPDATE_CAMPAIGN', payload)
        .then((resp) => {
          this.$refs.modal.hide();
          if (resp && resp.error) {
            this.isValidating = false;
            this.$emit('displayErrorApiWhenSavingSSC');
          } else {
            this.$router.push({
              name: 'campaign-list',
            });
            this.isValidating = false;
          }
        });
    },
  },
};
</script>
