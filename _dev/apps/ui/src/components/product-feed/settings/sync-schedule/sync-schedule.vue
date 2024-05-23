<template>
  <div>
    <b-form
      class="mb-5"
    >
      <b-form-group
        :label="$t('productFeedSettings.syncSchedule.title')"
        label-class="h4 font-weight-600 mb-2 d-block p-0 bg-transparent border-0"
      >
        <label class="mb-4">
          {{ $t('productFeedSettings.syncSchedule.subTitle') }}
        </label>
        <b-form-radio
          v-model="selectedSyncSchedule"
          name="sync-schedule"
          :value="true"
        >
          {{ $t('productFeedSettings.syncSchedule.radioLabel1') }}
        </b-form-radio>
        <b-form-radio
          v-model="selectedSyncSchedule"
          name="sync-schedule"
          :value="false"
          class="mt-3"
        >
          {{ $t('productFeedSettings.syncSchedule.radioLabel2') }}
        </b-form-radio>
      </b-form-group>
    </b-form>
    <actions-buttons
      :next-step="nextStep"
      :previous-step="previousStep"
      :disable-continue="disableContinue"
      @cancelProductFeedSettingsConfiguration="cancel()"
    />
    <settings-footer />
  </div>
</template>
<script>
import ProductFeedSettingsPages from '@/enums/product-feed/product-feed-settings-pages';
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  components: {
    SettingsFooter,
    ActionsButtons,
  },
  data() {
    return {
    };
  },
  computed: {
    disableContinue() {
      return false;
    },
    selectedSyncSchedule: {
      get() {
        return this.$store.getters['productFeed/GET_SYNC_SCHEDULE'];
      },
      set(value) {
        this.$store.commit('productFeed/SET_SYNC_SCHEDULE', value);
      },
    },
  },
  methods: {
    previousStep() {
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 4);
      this.$router.push({
        params: {
          name: 'product-feed-settings',
          step: ProductFeedSettingsPages.ATTRIBUTE_MAPPING,
        },
      });
      window.scrollTo(0, 0);
    },
    nextStep() {
      localStorage.setItem('productFeed-requestSynchronizationNow', this.selectedSyncSchedule);
      this.$segment.track('[GGL] Product feed config - Step 5', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 6);
      this.$router.push({
        name: 'product-feed-settings',
        params: {
          step: ProductFeedSettingsPages.SUMMARY,
        },
      });
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
};
</script>
