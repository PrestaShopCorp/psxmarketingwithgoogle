<template>
  <b-alert
    v-if="gAdsAccountAlert !== null"
    :variant="gAdsAccountAlert.color"
    show
    class="mt-3 mb-0"
  >
    <div>
      <VueShowdown
        id="clickedSegment"
        tag="p"
        :class="!!gAdsAccountAlert.link && 'd-inline'"
        :markdown="gAdsAccountAlert.text"
        :extensions="['no-p-tag', 'extended-link']"
      />
      <b-link
        v-if="!!gAdsAccountAlert.link"
        class="text-muted"
        :href="gAdsAccountAlert.link.url"
        target="_blank"
        @click="segmentClicked"
      >
        {{ gAdsAccountAlert.link.label }}
      </b-link>
      <div
        v-if="gAdsAccountAlert.button"
        class="mt-2 text-center d-md-flex align-items-center"
      >
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
          variant="outline-secondary"
          :href="hrefAlert"
          :target="targetAlert"
          @click="onClickAlert"
        >
          {{ gAdsAccountAlert.button.label }}
        </b-button>
      </div>
    </div>
  </b-alert>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import {
  GoogleAdsErrorReason,
} from '../../store/modules/google-ads/state';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'GoogleAdsAccountAlert',
  props: {
    error: {
      type: String,
      default: null,
      validator(value) {
        if (value === null) {
          return true;
        }
        return [
          'CantConnect',
          'BillingSettingsMissing',
          'NeedRefreshAfterBilling',
          'NeedRefreshAfterInvitationLink',
          'NeedValidationFromEmail',
          'Suspended',
          'Cancelled',
        ].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      GoogleAdsErrorReason,

    };
  },
  methods: {
    refresh() {
      this.$router.go();
    },
    changeError(error) {
      if (error === 'billing') {
        this.$store.commit('googleAds/SET_GOOGLE_ADS_STATUS', 'NeedRefreshAfterBilling');
      } else if (error === 'link') {
        this.$store.commit('googleAds/SET_GOOGLE_ADS_STATUS', 'NeedRefreshAfterInvitationLink');
      }
    },
    onClickAlert() {
      if (this.gAdsAccountAlert.button.type === 'refresh') {
        this.refresh();
        this.$segment.track('[GGL] Create GAds Account Refresh Billing Settings Step', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,

        });
      } else if (this.gAdsAccountAlert.button.type === 'link') {
        this.changeError('billing');
        this.$segment.track('[GGL] Create GAds - Step 5 Billing Settings Step', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
        });
      } else if (this.gAdsAccountAlert.button.type === 'invitationLink') {
        this.changeError('link');
        this.$segment.track('[GGL] Create GAds - Step 4 Accept invitation', {
          module: 'psxmarketingwithgoogle',
          params: SegmentGenericParams,
        });
      }
    },
    segmentClicked() {
      this.$segment.track('[GGL] Reactivate GAds Account Canceled', {
        module: 'psxmarketingwithgoogle',
        error: this.error,
        params: SegmentGenericParams,
      });
    },
  },
  computed: {
    getInvitationLink() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN']?.invitationLink
      || this.$options.googleUrl.googleAdsAccount;
    },
    googleAdsChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    gAdsAccountAlert() {
      switch (this.error) {
        case GoogleAdsErrorReason.CantConnect:
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertCantConnect'),
            button: {
              type: 'refresh',
              label: this.$i18n.t('general.refreshPage'),
            },
          };
        case GoogleAdsErrorReason.BillingSettingsMissing:
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertBillingSettingsMissing'),
            button: {
              type: 'link',
              label: this.$i18n.t('cta.addBillingSettings'),
              url: this.$options.googleUrl.googleAdsAccountBillingSettings,
            },
          };
        case GoogleAdsErrorReason.NeedValidationFromEmail:
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertNeedValidationFromEmail'),
            button: {
              type: 'invitationLink',
              label: this.$i18n.t('cta.acceptInvitation'),
              url: this.getInvitationLink,
            },
          };
        case GoogleAdsErrorReason.NeedRefreshAfterInvitationLink:
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertNeedRefreshAfterInvitationLink'),
            button: {
              type: 'refresh',
              label: this.$i18n.t('general.refreshPage'),
            },
          };
        case GoogleAdsErrorReason.NeedRefreshAfterBilling:
          return {
            color: 'warning',
            text: this.$i18n.t('googleAdsAccountCard.alertNeedRefreshAfterBilling'),
            button: {
              type: 'refresh',
              label: this.$i18n.t('general.refreshPage'),
            },
          };
        case GoogleAdsErrorReason.Suspended:
          return {
            color: 'danger',
            text: this.$i18n.t('googleAdsAccountCard.alertSuspended',
              [googleUrl.googleAdsAccount]),
            link: {
              label: this.$i18n.t('googleAdsAccountCard.learnAboutAccountSuspension'),
              url: this.$options.googleUrl.googleAdsAccountSuspension,
            },
          };
        case GoogleAdsErrorReason.Cancelled:
          return {
            color: 'danger',
            text: this.$i18n.t('googleAdsAccountCard.alertCancelled',
              [googleUrl.googleAdsAccount]),
            link: {
              label: this.$i18n.t('googleAdsAccountCard.learnAboutAccountCancellation'),
              url: this.$options.googleUrl.googleAdsAccountCancellation,
            },
          };
        default:
          return null;
      }
    },
    hrefAlert() {
      if (this.gAdsAccountAlert.button.type === 'link' || this.gAdsAccountAlert.button.type === 'invitationLink') {
        return this.gAdsAccountAlert.button.url;
      }
      return null;
    },
    targetAlert() {
      if (this.gAdsAccountAlert.button.type === 'link' || this.gAdsAccountAlert.button.type === 'invitationLink') {
        return '_blank';
      }
      return null;
    },

  },
  watch: {
    googleAdsChosen: {
      handler() {
        // To link gAds after first creation
        if (this.googleAdsChosen?.isAdmin && this.googleAdsChosen?.invitationLink) {
          this.$store.dispatch('googleAds/SAVE_SELECTED_GOOGLE_ADS_ACCOUNT', this.googleAdsChosen);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  googleUrl,
};
</script>
