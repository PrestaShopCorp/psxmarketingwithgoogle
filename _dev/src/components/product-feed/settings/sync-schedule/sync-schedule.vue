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
          {{$t('productFeedSettings.syncSchedule.subTitle')}}
        </label>
        <b-form-radio
          v-model="selectedSyncSchedule"
          name="sync-schedule"
          value="syncNow"
        >
          {{$t('productFeedSettings.syncSchedule.radioLabel1')}}
        </b-form-radio>
        <b-form-radio
          v-model="selectedSyncSchedule"
          name="sync-schedule"
          value="syncDefault"
          class="mt-3"
        >
          {{$t('productFeedSettings.syncSchedule.radioLabel2')}}
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
import SettingsFooter from '@/components/product-feed/settings/commons/settings-footer.vue';
import ActionsButtons from '@/components/product-feed/settings/commons/actions-buttons.vue';

export default {
  components: {
    SettingsFooter,
    ActionsButtons,
  },
  data() {
    return {
      selectedSyncSchedule: 'syncDefault',
    };
  },
  computed: {
    disableContinue() {
      return false;
    },
  },
  methods: {
    previousStep() {
      localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 3);
      window.scrollTo(0, 0);
    },
    nextStep() {
      localStorage.setItem('productFeed-deliveryDetails', JSON.stringify(this.carriers));
      this.$store.commit('productFeed/SET_ACTIVE_CONFIGURATION_STEP', 5);
      window.scrollTo(0, 0);
    },
    cancel() {
      this.$emit('cancelProductFeedSettingsConfiguration');
    },
  },
};
</script>
