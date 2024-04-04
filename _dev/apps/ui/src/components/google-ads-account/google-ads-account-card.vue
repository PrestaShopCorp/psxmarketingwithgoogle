<template>
  <section>
    <b-skeleton-wrapper
      :loading="loading"
      class="mb-3"
    >
      <template #loading>
        <b-card>
          <b-skeleton width="85%" />
          <b-skeleton width="55%" />
          <b-skeleton width="70%" />
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3"
        :class="{ 'ps_gs-onboardingcard--disabled' : !isEnabled }"
      >
        <template
          v-if="!isEnabled"
        >
          <div
            class="d-inline-flex align-items-start align-items-md-center mb-3"
          >
            <img
              class="mr-2"
              src="@/assets/images/Google-Commercial-icon.svg"
              width="32"
              height="32"
              alt=""
            >
            <b-card-text class="ps_gs-onboardingcard__title text-left mb-0">
              {{ $t('googleAdsAccountCard.title') }}
            </b-card-text>
            <div class="ml-auto">
              <b-button
                size="sm"
                variant="primary"
                disabled
              >
                {{ $t('cta.connectAccount') }}
              </b-button>
            </div>
          </div>
        </template>
        <template
          v-else
        >
          <div
            class="d-flex align-items-start align-items-md-center"
          >
            <img
              class="mr-2"
              src="@/assets/images/Google-Commercial-icon.svg"
              width="32"
              height="32"
              alt=""
            >
            <b-card-text class="ps_gs-onboardingcard__title  text-left mb-0">
              {{ $t('googleAdsAccountCard.title') }}
            </b-card-text>
            <div v-if="googleAdsAccountConfigured && isGoogleAdsAccountFullyFetched">
              <b-badge
                v-if="gAdsAccountStatusBadge !== null"
                :variant="gAdsAccountStatusBadge.color"
                class="mx-3"
              >
                {{ $t(`badge.${gAdsAccountStatusBadge.text}`) }}
              </b-badge>
              <b-badge
                v-if="testAccountBadge !== null"
                :variant="testAccountBadge.color"
                class="mx-1"
              >
                {{ $t(`badge.${testAccountBadge.text}`) }}
              </b-badge>
            </div>
            <div
              class="ml-auto"
              v-if="googleAdsAccountConfigured"
            >
              <b-dropdown
                no-caret
                size="sm"
                right
                variant="primary"
                menu-class="ps-dropdown__menu-small rounded"
                toggle-class="px-1"
                boundary="window"
                :toggle-attrs="{title: $t('cta.moreActions')}"
              >
                <template #button-content>
                  <i class="material-icons">
                    more_horiz
                  </i>
                  <span class="sr-only" />
                </template>
                <b-dropdown-item
                  :disabled="accountAwaitsValidation()"
                  data-test-id="btn-disconnect"
                  @click="disconnectGoogleAdsAccount()"
                >
                  {{ $t('cta.disconnect') }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </div>

          <div class="ml-2 ps_gs-onboardingcard__content">
            <div
              v-if="isEnabled && !googleAdsAccountConfigured"
            >
              <b-form class="mt-3 mb-2">
                <p
                  class="mb-2 w-75 ps_gs-fz-14"
                >
                  {{ $t('googleAdsAccountCard.labelSelect') }}
                </p>
                <div class="d-md-flex text-center mb-2 w-90">
                  <b-dropdown
                    :disabled="error === GoogleAdsErrorReason.CantConnect"
                    id="googleAdsAccountSelection"
                    ref="googleAdsAccountSelection"
                    :text="googleAdsLabel(selectedIndex) || $t('cta.selectAccount')"
                    variant=" "
                    class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown"
                    :toggle-class="{'ps-dropdown__placeholder' : selectedIndex === null}"
                    menu-class="ps-dropdown"
                    size="sm"
                  >
                    <!-- START > SPINNER -->
                    <b-dropdown-item
                      link-class="px-3"
                      :disabled="true"
                      v-if="listLoading"
                    >
                      <i class="icon-busy icon-busy--dark" />
                    </b-dropdown-item>
                    <!-- END > SPINNED -->
                    <!-- START > NO EXISTING ACCOUNT -->
                    <b-dropdown-item
                      v-if="!listLoading && googleAdsAccountSelectionOptions.length === 0"
                      :disabled="true"
                      variant="dark"
                      data-test-id="message-empty-list"
                    >
                      <span class="mr-2">
                        {{ $t('mcaCard.noExistingAccount') }}
                      </span>
                    </b-dropdown-item>
                    <!-- END > NO EXISTING ACCOUNT -->
                    <!-- START > REGULAR LIST -->
                    <b-dropdown-item
                      v-for="(option, index) in googleAdsAccountSelectionOptions"
                      :key="option.id"
                      @click="selectedIndex = index"
                      :disabled="isShownAsDisabled(option)"
                      variant="dark"
                    >
                      <span class="mr-2">
                        {{ displayIdName(option) }}
                      </span>
                      <span
                        v-if="isAccountCancelled(option) || isAccountSuspended(option)"
                        class="ps_gs-fz-12 ml-auto"
                      >
                        {{ $t('mcaCard.alertSuspended') }}
                      </span>
                      <span
                        v-else-if="!isAdmin(option)"
                        class="ps_gs-fz-12 ml-auto"
                      >
                        {{ $t('mcaCard.userIsNotAdmin') }}
                      </span>
                      <span
                        v-if="isTestAccount(option)"
                        class="ps_gs-fz-12 ml-auto"
                      >
                        {{ $t('mcaCard.userIsTestAccount') }}
                      </span>
                    </b-dropdown-item>
                  <!-- END > REGULAR LIST -->
                  </b-dropdown>
                  <b-button
                    size="sm"
                    variant="primary"
                    :disabled="selectedIndex === null"
                    class="mt-3 mt-md-0 ml-md-3 flex-shrink-0"
                    @click="selectGoogleAdsAccount"
                  >
                    <template v-if="!isConnecting">
                      {{ $t('cta.connect') }}
                    </template>
                    <template v-else>
                      {{ $t('cta.connecting') }}
                      <span class="ml-1 icon-busy" />
                    </template>
                  </b-button>
                </div>
                <i18n
                  path="general.createNewAccount"
                  class="ps_gs-fz-12 mt-3 mt-md-0"
                  tag="div"
                >
                  <a
                    rel="openPopin"
                    class="with-hover text-decoration-underline"
                    role="button"
                    @click.prevent="openPopinNewAccount"
                  >
                    {{ $t('general.createAccount') }}
                  </a>
                </i18n>
              </b-form>
              <GoogleAdsAccountAlert
                v-if="error === GoogleAdsErrorReason.CantConnect"
                :error="error"
              />
            </div>
            <div
              v-if="googleAdsAccountConfigured && isGoogleAdsAccountFullyFetched"
              class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3"
            >
              <div class="d-flex align-items-center">
                {{ displayIdName(accountChosen) }}
              </div>
              <div
                v-if="!googleAdsAccountConfigured"
                class="flex-grow-1 d-flex-md flex-md-grow-0 flex-shrink-0 text-center"
              >
                <b-button
                  size="sm"
                  variant="primary"
                  class="mx-1 mt-3 mt-md-0 mr-md-0"
                  target="_blank"
                >
                  <template v-if="!isConnecting">
                    {{ $t('cta.connect') }}
                  </template>
                  <template v-else>
                    {{ $t('cta.connecting') }}
                    <span class="ml-1 icon-busy" />
                  </template>
                </b-button>
              </div>
            </div>
          </div>
        </template>
        <GoogleAdsAccountAlert
          v-if="error !== 'CantConnect'"
          :error="error"
        />
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import GoogleAdsAccountAlert from './google-ads-account-alert.vue';
import {
  GoogleAdsErrorReason,
} from '../../store/modules/google-ads/state';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'GoogleAdsAccountCard',
  components: {
    GoogleAdsAccountAlert,
  },
  data() {
    return {
      selectedIndex: null,
      GoogleAdsErrorReason,
      isConnecting: false,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    async selectGoogleAdsAccount() {
      this.$segment.track('[GGL] Connect GAds', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.isConnecting = true;
      try {
        await this.$store.dispatch('googleAds/SAVE_SELECTED_GOOGLE_ADS_ACCOUNT', this.googleAdsAccountSelectionOptions[this.selectedIndex]);
        await new Promise((resolve) => { setTimeout(resolve, 4000); });
        await this.$store.dispatch('googleAds/GET_GOOGLE_ADS_ACCOUNT');
        if (this.accountChosen) {
          this.$emit('selectGoogleAdsAccount');
        }
      } catch (err) {
        this.$store.commit('googleAds/SET_GOOGLE_ADS_STATUS', 'CantConnect');
        console.error(err);
      } finally {
        this.isConnecting = false;
      }
    },
    googleAdsLabel(index) {
      if (this.googleAdsAccountSelectionOptions && this.googleAdsAccountSelectionOptions[index]) {
        const ga = this.googleAdsAccountSelectionOptions[index];
        const name = ga.name || '';

        return name ? `${ga.id} - ${name}` : ga.id;
      }
      return null;
    },
    isShownAsDisabled(account) {
      return !this.isAdmin(account)
        || this.isAccountCancelled(account)
        || this.isAccountSuspended(account);
    },
    isAdmin(account) {
      // !! MIGHT NEED REFACTO if no isAdmin is sent by the API
      // !! CF merchand center account card isGmcUserAdmin
      return account.isAdmin === true;
    },
    isAccountCancelled(account) {
      return account.isAccountCancelled === true;
    },
    isAccountSuspended(account) {
      return account.isAccountSuspended === true;
    },
    isTestAccount(account) {
      return account.isTestAccount === true;
    },
    refresh() {
      this.$router.go();
    },
    disconnectGoogleAdsAccount() {
      this.$segment.track('[GGL] Disconnect GAds Account', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.$emit('disconnectionGoogleAdsAccount');
    },
    openPopinNewAccount() {
      this.$segment.track('[GGL] Create GAds', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,

      });
      this.$emit('creationGoogleAdsAccount');
    },
    displayIdName(option) {
      return option.name
        ? `${option.id} - ${option.name}` : option.id;
    },
    accountAwaitsValidation() {
      return this.error === GoogleAdsErrorReason.NeedValidationFromEmail
       || this.error === GoogleAdsErrorReason.NeedRefreshAfterInvitationLink;
    },
  },
  computed: {
    accountChosen() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_ACCOUNT_CHOSEN'];
    },
    googleAdsAccountConfigured() {
      return this.accountChosen !== null;
    },
    googleAdsAccountSelectionOptions() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_LIST_OPTIONS'];
    },
    listLoading() {
      return this.googleAdsAccountSelectionOptions === null;
    },
    error() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_STATUS'];
    },
    gAdsAccountStatusBadge() {
      switch (this.error) {
        case GoogleAdsErrorReason.Suspended:
          return {
            color: 'danger',
            text: 'suspended',
          };
        case GoogleAdsErrorReason.Cancelled:
          return {
            color: 'danger',
            text: 'canceled',
          };
        case GoogleAdsErrorReason.CantConnect:
        case GoogleAdsErrorReason.NeedValidationFromEmail:
        case GoogleAdsErrorReason.BillingSettingsMissing:
        case GoogleAdsErrorReason.NeedRefreshAfterBilling:
        case GoogleAdsErrorReason.NeedRefreshAfterInvitationLink:
          return null;
        default:
          return {
            color: 'success',
            text: 'connected',
          };
      }
    },
    testAccountBadge() {
      if (this.accountChosen && this.isTestAccount(this.accountChosen)) {
        return {
          color: 'warning',
          text: 'testAccount',
        };
      }
      return null;
    },
    isGoogleAdsAccountFullyFetched() {
      return this.isEnabled
        && !this.listLoading
        && this.accountChosen.id !== null
        && this.accountChosen.id !== undefined;
    },

  },

  googleUrl,
};
</script>
