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
        :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
      >
        <div class="d-flex align-items-start align-items-md-center mb-3">
          <img
            class="mr-2"
            src="@/assets/images/google-merchant-center-icon.svg"
            width="32"
            height="32"
            alt=""
          >
          <b-card-text class="ps_gs-onboardingcard__title text-left mb-0">
            {{ $t('mcaCard.title') }}
          </b-card-text>
          <b-badge
            class="mx-3"
            :variant="mcaStatusBadge.color"
            v-if="mcaConfigured"
          >
            {{ $t(`badge.${mcaStatusBadge.text}`) }}
          </b-badge>
          <div
            class="flex-grow-1 d-flex-md flex-md-grow-1 flex-shrink-0 text-right"
            v-if="gmcAccountDetails.id === null"
          >
            <b-button
              size="sm"
              variant="primary"
              :disabled="selectedMcaIndex === null || isLinking || shopIsOnMaintenanceMode"
              class="mt-3 mt-md-0 ml-md-3"
              @click="selectMerchantCenterAccount"
            >
              {{ $t('cta.connectAccount') }}
            </b-button>
          </div>
          <div
            v-else
            class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
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
                @click="checkWebsiteRequirements"
              >
                {{ $t("cta.checkRequirements") }}
              </b-dropdown-item>
              <b-dropdown-item
                @click="dissociateMerchantCenterAccount"
              >
                {{ $t("cta.disconnect") }}
              </b-dropdown-item>
              <b-dropdown-item
                target="_blank"
                :href="merchantCenterWebsitePageUrl.businessInfo"
              >
                {{ $t("cta.editContact") }}
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <div
          v-if="isEnabled && gmcAccountDetails.id === null"
          class="ml-2 ps_gs-onboardingcard__content"
        >
          <VueShowdown
            @click.native="segmentClicked"
            class="mb-1"
            tag="p"
            :markdown="this.$i18n.t('mcaCard.introDisabled')"
            :extensions="['no-p-tag', 'extended-b-link']"
            v-if="gmcAccountDetails.id === null"
            :vue-template="true"
          />
          <b-form class="mb-2 mt-3">
            <div class="d-md-flex text-center">
              <b-dropdown
                id="mcaSelection"
                ref="mcaSelection"
                :text="gmcLabel(selectedMcaIndex) || $t('cta.selectAccount')"
                variant=" "
                class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
                :toggle-class="{'ps-dropdown__placeholder' : selectedMcaIndex === null}"
                menu-class="ps-dropdown"

                size="sm"
                :disabled="isLinking || !!error || shopIsOnMaintenanceMode"
              >
                <b-dropdown-item
                  link-class="px-3"
                  :disabled="true"
                  v-if="mcaListLoading"
                >
                  <i class="icon-busy icon-busy--dark" />
                </b-dropdown-item>
                <b-dropdown-item
                  v-if="!mcaListLoading && mcaSelectionOptionsAndGroups.length === 0"
                  :disabled="true"
                  variant="dark"
                  link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
                >
                  <span class="mr-2">
                    {{ $t('mcaCard.noExistingAccount') }}
                  </span>
                </b-dropdown-item>
                <b-dropdown-item
                  v-for="(option) in mcaSelectionOptionsAndGroups[0]"
                  :key="option.id"
                  @click="selectedMcaIndex = option.i"
                  :disabled="!isGmcUserAdmin(option.i)"
                  variant="dark"
                  link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
                >
                  <span class="mr-2">
                    {{ gmcLabel(option.i) }}
                  </span>
                  <span
                    v-if="option.subAccountNotManagedByPrestashop"
                    class="ps_gs-fz-12"
                  >
                    {{ $t('mcaCard.notManaged') }}
                  </span>
                  <span
                    v-if="!isGmcUserAdmin(option.i)"
                    class="ps_gs-fz-12 ml-auto"
                  >
                    {{ $t('mcaCard.userIsNotAdmin') }}
                  </span>
                </b-dropdown-item>
                <b-dropdown-group
                  header-classes="px-0"
                  v-for="(group, index) in mcaSelectionOptionsAndGroups[1]"
                  :key="index"
                >
                  <template #header>
                    <div class="text-muted px-3">
                      <span class="font-weight-600 ps_gs-fz-13 mr-2">
                        {{ group.mca.name }}
                      </span>
                      <span class="ps_gs-fz-12">
                        {{ group.mca.info }}
                      </span>
                    </div>
                  </template>

                  <b-dropdown-item
                    v-for="(option) in group.gmcs"
                    :key="option.id"
                    @click="selectedMcaIndex = option.i"
                    :disabled="!isGmcUserAdmin(option.i)"
                    variant="dark"
                    link-class="d-flex flex-wrap flex-md-nowrap align-items-center pl-4 pr-3"
                  >
                    <span class="mr-auto">{{ gmcLabel(option.i, true) }}</span>
                    <span
                      v-if="!isGmcUserAdmin(option.i)"
                      class="ps_gs-fz-12"
                    >
                      {{ $t('mcaCard.userIsNotAdmin') }}
                    </span>
                  </b-dropdown-item>
                </b-dropdown-group>
              </b-dropdown>
            </div>
          </b-form>
          <div class="mt-3">
            <i18n
              v-if="!hasGmcCreatedFromModule"
              path="general.createNewAccount"
              class="ps_gs-fz-12 mt-3 mt-md-0"
              tag="div"
            >
              <a
                rel="openPopin"
                class="with-hover text-decoration-underline"
                :class="shopIsOnMaintenanceMode ? 'bg-transparent text-secondary' : ''"
                :disabled="shopIsOnMaintenanceMode"
                role="button"
                @click.prevent="checkWebsiteRequirements"
              >
                {{ $t('general.createAccount') }}
              </a>
            </i18n>

            <b-alert
              v-if="shopIsOnMaintenanceMode"
              show
              variant="warning"
              class="mb-0 mt-2"
            >
              <VueShowdown
                class="mb-0"
                :markdown="$t('mcaCard.shopMaintenance')"
                :extensions="['no-p-tag']"
                tag="p"
              />
              <div class="d-md-flex text-center align-items-center mt-2">
                <b-button
                  class="btn mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1 btn-outline-secondary btn-sm"
                  size="sm"
                  variant="outline-secondary"
                  :href="this.$store.state.app.psxMktgWithGoogleMaintenanceSettingsUrl"
                  target="_blank"
                >
                  {{ $t("cta.shopMaintenanceBtn") }}
                </b-button>
              </div>
            </b-alert>

            <VueShowdown
              v-if="isEU"
              class="mt-4 mb-0 text-muted ps_gs-fz-12"
              :markdown="$t('mcaCard.footerEU', [
                this.$options.googleUrl.comparisonShoppingServices,
                this.$options.googleUrl.findCssPartners
              ])"
              :extensions="['extended-link']"
            />
          </div>
        </div>
        <!--
      ToDo: Consider moving the "associated state" in a dedicated component
      As we only use data from the vuex store
    -->
        <b-alert
          v-if="isLinkedGmcStillCreating"
          show
          variant="warning"
          class="mb-0 mt-2"
        >
          <p class="mb-0">
            <strong>{{ $t('mcaCard.newGmcNotListed') }}</strong><br>
            <span class="ps_gs-fz-12">
              {{ $t('mcaCard.newGmcNotListedDescription') }}
            </span>
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              class="btn mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1 btn-outline-secondary btn-sm"
              size="sm"
              variant="outline-secondary"
              @click="dissociateMerchantCenterAccount"
            >
              {{ $t("cta.disconnect") }}
            </b-button>
          </div>
        </b-alert>
        <div
          v-if="isLinkedGmcFullyFetched"
          class="d-flex flex-wrap flex-md-nowrap justify-content-between
            ml-2 ps_gs-onboardingcard__content"
        >
          <div>
            <div class="d-flex align-items-center">
              <a
                :href="merchantCenterWebsitePageUrl.overview"
                :title="$t('cta.goToYourX', [$t('badge.merchantCenterAccount')])"
                target="_blank"
                class="external_link-no_icon link-regular"
              >
                {{ gmcAccountDetails.name }} - {{ gmcAccountDetails.id }}
              </a>
              <span
                v-if="loaderText"
                class="text-muted ml-4"
              >
                <i class="icon-busy icon-busy--dark mr-1" />
                {{ $t(`badge.${loaderText}`) }}
              </span>
              <span
                v-if="displaySiteVerified"
                class="text-muted"
              >

                <i class="material-icons mr-1 ps_gs-fz-12 text-success">done</i>
                {{ $t('badge.siteVerified') }}
              </span>
            </div>
          </div>
        </div>
        <merchant-center-account-alert-suspended
          v-if="error === WebsiteClaimErrorReason.Suspended"
          :issues="gmcAccountDetails.isSuspended.issues"
          :account-overview-url="merchantCenterWebsitePageUrl.overview"
          class="mb-0 mt-3"
        />
        <b-alert
          v-else-if="error === WebsiteClaimErrorReason.OverwriteNeeded"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            <strong>{{ $t('mcaCard.claimCollides') }}</strong><br>
            <span class="ps_gs-fz-12">
              {{ $t('mcaCard.claimOverwrite') }}
            </span><br>
            <a
              :href="$options.googleUrl.learnAboutSiteClaiming"
              target="_blank"
              class="d-inline-block text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
            >
              {{ $t('cta.learnAboutSiteClaiming') }}
            </a>
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              size="sm"
              class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
              variant="outline-secondary"
              @click="overrideClaim"
            >
              {{ $t("cta.transferClaim") }}
            </b-button>
          </div>
        </b-alert>
        <b-alert
          v-else-if="error === WebsiteClaimErrorReason.OverwriteNeededWithManualAction
            && !needToRefresh"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            <strong>{{ $t('mcaCard.claimCollides') }}</strong><br>
            <span class="ps_gs-fz-12">
              {{ $t('mcaCard.claimOverwriteWithManualAction', [websiteUrl]) }}
            </span><br>
            <a
              :href="$options.googleUrl.learnAboutSiteClaiming"
              target="_blank"
              class="d-inline-block text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
            >
              {{ $t('cta.learnAboutSiteClaiming') }}
            </a>
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              @click="checkAgainForOverwriteNeededWithManualAction"
              size="sm"
              class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1 text-decoration-none"
              variant="outline-secondary"
              :href="merchantCenterWebsitePageUrl.website"
              target="_blank"
            >
              {{ $t("cta.addWebsiteAddress") }}
            </b-button>
          </div>
        </b-alert>
        <b-alert
          v-else-if="error === WebsiteClaimErrorReason.OverwriteNeededWithManualAction
            && needToRefresh"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            {{ $t('mcaCard.refreshAfterAddingWebsiteAddress') }}<br>
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              @click="refresh"
              variant="outline-secondary"
            >
              {{ $t("general.refreshPage") }}
            </b-button>
          </div>
        </b-alert>
        <b-alert
          v-else-if="error === WebsiteClaimErrorReason.ShopInfoMissing"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <div>
            <strong>{{ $t('mcaCard.shopInfoMissing') }}</strong>
            <VueShowdown
              class="mb-0 ps_gs-fz-12"
              tag="p"
              :markdown="$t('mcaCard.shopInfoMissingDescription', [
                merchantCenterWebsitePageUrl.businessInfo
              ])"
              :extensions="['extended-link', 'no-p-tag']"
            />
          </div>
        </b-alert>
        <b-alert
          v-else-if="error === WebsiteClaimErrorReason.AccountValidationFailed"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            <strong>{{ $t('mcaCard.AccountValidationFailed') }}</strong><br>
            <VueShowdown
              tag="p"
              class="ps_gs-fz-12"
              :markdown="$t('mcaCard.tryAgainLater')"
              :extensions="['no-p-tag']"
            />
          </p>
        </b-alert>
        <b-alert
          v-if="error === WebsiteClaimErrorReason.UnlinkFailed"
          show
          variant="danger"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            {{ $t('mcaCard.unlinkFailed') }}
          </p>
        </b-alert>
        <b-alert
          v-if="error === WebsiteClaimErrorReason.LinkingFailed"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            {{ $t('mcaCard.linkingFailed') }}
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              size="sm"
              class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
              variant="outline-secondary"
              @click="refresh"
            >
              {{ $t('general.refreshPage') }}
            </b-button>
          </div>
        </b-alert>
        <b-alert
          v-if="error === WebsiteClaimErrorReason.PhoneVerificationNeeded"
          show
          variant="warning"
          class="mb-0 mt-2"
        >
          <p class="mb-0">
            <strong>{{ $t('mcaCard.phoneVerificationNeeded') }}</strong><br>
            <span class="ps_gs-fz-12">
              {{ $t('mcaCard.phoneVerificationNeededDescription') }}
            </span>
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              class="btn mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1 btn-outline-secondary btn-sm"
              size="sm"
              variant="outline-secondary"
              @click="verifyPhoneNumber"
            >
              {{ $t('cta.verifyPhoneNumber') }}
            </b-button>
          </div>
        </b-alert>
        <MerchantCenterAccountPopinOverwriteClaim
          ref="mcaPopinOverrideClaim"
        />
        <MerchantCenterAccountPopinWebsiteRequirements
          :new-mca="mcaIsNotConnected"
          ref="MerchantCenterAccountPopinNewMca"
        />
        <PhoneVerificationPopin
          ref="PhoneVerificationPopin"
          @phoneNumberVerified="phoneNumberVerified"
        />
        <AlertModuleDisabled />
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script>
import uniqBy from 'lodash.uniqby';
import {VueShowdown} from 'vue-showdown';
import {BAlert} from 'bootstrap-vue';
import googleUrl from '@/assets/json/googleUrl.json';
import {
  WebsiteClaimErrorReason,
} from '../../store/modules/accounts/state';
import {getMerchantCenterWebsiteUrls} from './merchant-center-account-links';
import MerchantCenterAccountAlertSuspended from '@/components/merchant-center-account/merchant-center-account-alert-suspended.vue';
import MerchantCenterAccountPopinOverwriteClaim from './merchant-center-account-popin-overwrite-claim';
import MerchantCenterAccountPopinWebsiteRequirements from './merchant-center-account-popin-website-requirements.vue';
import PhoneVerificationPopin from './phone-verification/phone-verification-popin.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import AlertModuleDisabled from '@/components/commons/alert-module-disabled';

export default {
  name: 'MerchantCenterAccountCard',
  components: {
    MerchantCenterAccountAlertSuspended,
    MerchantCenterAccountPopinOverwriteClaim,
    MerchantCenterAccountPopinWebsiteRequirements,
    VueShowdown,
    PhoneVerificationPopin,
    BAlert,
    AlertModuleDisabled,
  },
  data() {
    return {
      selectedMcaIndex: null,
      WebsiteClaimErrorReason,
      displaySiteVerified: false,
      needToRefresh: false,
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
    isEU: {
      type: Boolean,
    },
    isLinking: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    mcaSelectionOptions() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_MCA_LIST'];
    },
    mcaSelectionOptionsAndGroups() {
      if (!this.mcaSelectionOptions?.length) {
        return [];
      }
      const list = this.mcaSelectionOptions
        .map((account) => {
          if (account.aggregatorName) {
            const managed = account.subAccountNotManagedByPrestashop ? this.$t('mcaCard.notManaged') : null;

            return {...account, aggregatorManagement: managed};
          }
          return account;
        })
        .map((account, i) => ({i, ...account}));
      const groups = uniqBy(
        list
          .filter((gmc) => !!gmc.aggregatorName)
          .map((account) => ({name: account.aggregatorName, info: account.aggregatorManagement})),
        'name',
      );

      return [
        list.filter((gmc) => !gmc.aggregatorName),
        groups.map((mca) => ({mca, gmcs: list.filter((gmc) => gmc.aggregatorName === mca.name)})),
      ];
    },
    shopIsOnMaintenanceMode() {
      return this.$store.getters['app/GET_STATUS_SHOP_MAINTENANCE']
       && !this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    mcaListLoading() {
      return this.mcaSelectionOptions === null;
    },
    mcaConfigured() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    gmcAccountDetails() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    mcaIsNotConnected() {
      return !(this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_IS_CONNECTED']);
    },
    error() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS'];
    },
    mcaStatusBadge() {
      switch (this.error) {
        case WebsiteClaimErrorReason.Pending:
        case WebsiteClaimErrorReason.PendingCheck:
          return {
            color: 'warning',
            text: 'pending',
          };
        case WebsiteClaimErrorReason.Expiring:
          return {
            color: 'warning',
            text: 'expiring',
          };
        case WebsiteClaimErrorReason.Suspended:
          return {
            color: 'danger',
            text: 'suspended',
          };
        case WebsiteClaimErrorReason.OverwriteNeeded:
          return {
            color: 'warning',
            text: 'pending',
          };
        case WebsiteClaimErrorReason.AccountValidationFailed:
          return {
            color: 'warning',
            text: 'pending',
          };
        case WebsiteClaimErrorReason.OverwriteNeededWithManualAction:
          return {
            color: 'warning',
            text: 'pending',
          };
        case WebsiteClaimErrorReason.PendingCreation:
        case WebsiteClaimErrorReason.StillPendingCreation:
          return {
            color: 'warning',
            text: 'pendingCreation',
          };
        case WebsiteClaimErrorReason.PhoneVerificationNeeded:
          this.$store.dispatch('accounts/REQUEST_SHOP_INFORMATIONS');
          return {
            color: 'warning',
            text: 'pending',
          };
        default:
          return {
            color: 'success',
            text: 'connected',
          };
      }
    },
    merchantCenterWebsitePageUrl() {
      return getMerchantCenterWebsiteUrls(this.gmcAccountDetails.id);
    },
    websiteUrl() {
      return this.$store.state.accounts.googleMerchantAccount.websiteUrl;
    },
    loaderText() {
      if (this.isLinking) {
        return 'checkingSiteClaim';
      }
      switch (this.error) {
        case WebsiteClaimErrorReason.StillPendingCreation:
          return 'creatingGmcTakingTime';
        case WebsiteClaimErrorReason.PendingCreation:
          return 'creatingGmc';
        case WebsiteClaimErrorReason.PendingCheck:
          return 'pendingCheck';
        default:
          return null;
      }
    },
    isLinkedGmcStillCreating() {
      return this.isEnabled
        && this.gmcAccountDetails.id !== null
        && !this.mcaListLoading
        && (this.gmcAccountDetails.name === null || this.gmcAccountDetails.name === undefined);
    },
    isLinkedGmcFullyFetched() {
      return this.isEnabled
        && this.gmcAccountDetails.id !== null
        && !this.mcaListLoading
        && this.gmcAccountDetails.name !== null
        && this.gmcAccountDetails.name !== undefined;
    },
    hasGmcCreatedFromModule() {
      const isFromModule = this.mcaSelectionOptions?.findIndex((option) => 'aggregatorId' in option && option.aggregatorId === this.$store.state.accounts.mcaPrestashopId);

      return isFromModule >= 0;
    },
  },
  methods: {
    selectMerchantCenterAccount() {
      this.$segment.track('[GGL] Connect my existing GMC', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$emit('selectMerchantCenterAccount', this.mcaSelectionOptions[this.selectedMcaIndex]);
      this.$store.commit('accounts/SAVE_MCA_CONNECTED_AUTOMATICALLY', false);
    },
    dissociateMerchantCenterAccount() {
      this.$segment.track('[GGL] Disconnect Gmc Account', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.$emit('dissociateMerchantCenterAccount');
    },
    overrideClaim() {
      if (this.$refs.mcaPopinOverrideClaim) {
        this.$bvModal.show(
          this.$refs.mcaPopinOverrideClaim.$refs.modal.id,
        );
      }
    },
    checkAgainForOverwriteNeededWithManualAction() {
      this.needToRefresh = true;
    },
    gmcLabel(index) {
      if (this.mcaSelectionOptions && this.mcaSelectionOptions[index]) {
        const gmc = this.mcaSelectionOptions[index];

        return `${gmc.id} - ${gmc.name}`;
      }
      return null;
    },
    isGmcUserAdmin(index) {
      if (!this.mcaSelectionOptions || !this.mcaSelectionOptions[index]) {
        return false;
      }
      let isAdmin = false;
      this.mcaSelectionOptions[index].users.forEach((user) => {
        // Only continue if the user email matches the onboarded Google Account one
        if (this.$store.state.accounts.googleAccount.details.email
        && user.emailAddress
        && this.$store.state.accounts.googleAccount.details.email.toUpperCase()
        !== user.emailAddress.toUpperCase()) {
          return;
        }

        isAdmin = user.admin || isAdmin;
      });
      return isAdmin;
    },
    setFocusOnSelectMCA() {
      if (this.$refs.mcaSelection?.$refs?.toggle) {
        this.$refs.mcaSelection.$refs.toggle.focus();
      }
    },
    checkWebsiteRequirements() {
      if (this.$refs.MerchantCenterAccountPopinNewMca) {
        this.$bvModal.show(
          this.$refs.MerchantCenterAccountPopinNewMca.$refs.modal.id,
        );
      }
    },
    refresh() {
      this.$router.go();
    },
    verifyPhoneNumber() {
      if (this.$refs.PhoneVerificationPopin) {
        this.$bvModal.show(
          this.$refs.PhoneVerificationPopin.$refs.modal.id,
        );
      }
    },
    segmentClicked() {
      this.$segment.track('[GGL] Visit GMC info link', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    phoneNumberVerified() {
      this.$emit('phoneNumberHasBeenVerified');
    },
  },
  updated() {
    this.setFocusOnSelectMCA();
  },
  mounted() {
    this.setFocusOnSelectMCA();
    this.$root.$on('startGmcAccountCreation', this.checkWebsiteRequirements);
  },
  beforeDestroy() {
    this.$root.$off('startGmcAccountCreation', this.checkWebsiteRequirements);
  },
  watch: {
    mcaConfigured(newVal, oldVal) {
      if (oldVal === false && newVal === true) {
        this.displaySiteVerified = true;
        setTimeout(() => {
          this.displaySiteVerified = false;
        }, 2000);
      }
    },
  },
  googleUrl,
};
</script>
