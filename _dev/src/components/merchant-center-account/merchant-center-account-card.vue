<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled': !isEnabled }"
  >
    <div class="d-md-flex flex-wrap align-items-center justify-content-between mb-3">
      <div class="d-flex align-items-center">
        <img
          class="mr-3"
          :src="
            isEnabled
              ? require('@/assets/images/google-merchant-center-icon.svg')
              : require('@/assets/images/google-merchant-center-icon-grey.svg')
          "
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="flex-grow-1 ps_gs-onboardingcard__title text-left mb-0">
          {{ $t('mcaCard.title') }}
          <i
            v-if="mcaConfigured && !error"
            class="material-icons ps_gs-fz-22 ml-2 mr-3 mb-0 text-success align-bottom"
          >
            check_circle
          </i>
        </b-card-text>
      </div>
    </div>
    <VueShowdown
      v-if="selectedMcaDetails.id === null"
      class="ps_gs-fz-12 mb-3"
      :markdown="message"
      :extensions="['targetlink']"
    />
    <BadgeListRequirements
      v-if="!isEnabled"
      :badges="['googleAccount']"
    />
    <div v-if="isEnabled && selectedMcaDetails.id === null">
      <b-form class="mb-2">
        <legend
          class="mb-1 h4 font-weight-600 bg-transparent border-0"
        >
          {{ $t('mcaCard.labelSelect') }}
        </legend>
        <div class="d-md-flex text-center">
          <b-dropdown
            id="mcaSelection"
            ref="mcaSelection"
            :text="gmcLabel(selectedMcaIndex) || $t('cta.selectAccount')"
            variant=" "
            class="flex-grow-1 ps-dropdown ps_googleshopping-dropdown bordered"
            :toggle-class="{'ps-dropdown__placeholder' : selectedMcaIndex === null}"
            menu-class="ps-dropdown"
            no-flip
            size="sm"
            :disabled="isLinking || !!error"
          >
            <b-dropdown-item
              link-class="px-3"
              :disabled="true"
              v-if="mcaListLoading"
            >
              <i class="icon-busy icon-busy--dark" />
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
          <b-button
            size="sm"
            variant="primary"
            :disabled="selectedMcaIndex === null || isLinking"
            class="mt-3 mt-md-0 ml-md-3"
            @click="selectMerchantCenterAccount"
          >
            {{ $t('cta.connect') }}
          </b-button>
        </div>
        <VueShowdown
          class="text-muted ps_gs-fz-12 mt-3 mt-md-0"
          :markdown="$t('mcaCard.toUseGmcNeedsAdminAccess')"
        />
        <b-alert
          v-if="error === WebsiteClaimErrorReason.LinkingFailed"
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            {{ $t('mcaCard.linkingFailed') }}
          </p>
        </b-alert>
      </b-form>
      <div class="mt-3">
        <b-button
          variant="invisible"
          class="p-0 border-0 font-weight-normal mb-0 text-primary"
          @click="checkWebsiteRequirements"
        >
          <i
            class="left material-icons mr-2 ps_gs-fz-24"
            aria-hidden="true"
          >person_add</i><!--
          --><span class="align-middle">{{ $t('cta.createNewAccount') }}</span>
        </b-button>
        <VueShowdown
          v-if="isEU"
          class="mt-4 mb-0 text-muted ps_gs-fz-12"
          :markdown="$t('mcaCard.footerEU', [
            this.$options.googleUrl.comparisonShoppingServices,
            this.$options.googleUrl.findCssPartners
          ])"
          :extensions="['targetlink']"
        />
      </div>
    </div>
    <!--
      ToDo: Consider moving the "associated state" in a dedicated component
      As we only use data from the vuex store
    -->
    <p
      v-if="isEnabled && selectedMcaDetails.id !== null"
      class="mb-0"
    >
      {{ $t('mcaCard.googleMCA') }}
    </p>
    <div
      v-if="isEnabled && selectedMcaDetails.id !== null"
      class="d-flex flex-wrap flex-md-nowrap justify-content-between"
    >
      <div class="d-flex align-items-center">
        <strong>{{ selectedMcaDetails.name }} - {{ selectedMcaDetails.id }}</strong>
        <b-badge
          class="mx-3"
          :variant="mcaStatusBadge.color"
        >
          {{ $t(`badge.${mcaStatusBadge.text}`) }}
        </b-badge>
        <span
          v-if="isLinking"
          class="text-muted"
        >
          <i class="icon-busy icon-busy--dark mr-1" />
          {{ $t('badge.checkingSiteClaim') }}
        </span>
        <span
          v-if="displaySiteVerified"
          class="text-muted"
        >

          <i class="material-icons mr-1 ps_gs-fz-12 text-success">done</i>
          {{ $t('badge.siteVerified') }}
        </span>
      </div>
      <div
        class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center"
      >
        <b-button
          class="mx-1 mt-3 mt-md-0"
          size="sm"
          variant="outline-secondary"
          @click="checkWebsiteRequirements"
        >
          {{ $t("cta.checkRequirements") }}
        </b-button>
        <b-button
          class="mx-1 mt-3 mt-md-0 mr-md-0"
          size="sm"
          variant="outline-secondary"
          @click="dissociateMerchantCenterAccount"
        >
          {{ $t("cta.disconnect") }}
        </b-button>
      </div>
    </div>
    <b-alert
      v-if="error === WebsiteClaimErrorReason.Suspended"
      show
      variant="danger"
      class="mb-0 mt-3"
    >
      <VueShowdown
        :markdown="$t('mcaCard.alertSuspended', [
          $options.googleUrl.merchantCenterAccount,
          $options.googleUrl.requestiongReReview
        ])"
        :extensions="['targetlink']"
      />
      <div class="text-muted">
        <a
          :href="$options.googleUrl.learnAboutAccountSuspension"
          target="_blank"
          class="text-muted ps_gs-fz-12 font-weight-normal"
        >
          {{ $t('cta.learnAboutAccountSuspension') }}
        </a>
      </div>
    </b-alert>
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
        </span>
      </p>
      <div class="d-md-flex text-center align-items-center mt-2">
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
          variant="secondary"
          @click="overrideClaim"
        >
          {{ $t("cta.overwrite") }}
        </b-button>
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 mr-md-3"
          variant="outline-secondary"
          @click="dissociateMerchantCenterAccount"
        >
          {{ $t("cta.switchAccount") }}
        </b-button>
        <a
          :href="$options.googleUrl.learnAboutSiteClaiming"
          target="_blank"
          class="d-inline-block text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
        >
          {{ $t('cta.learnAboutSiteClaiming') }}
        </a>
      </div>
    </b-alert>
    <b-alert
      v-else-if="error === WebsiteClaimErrorReason.OverwriteNeededWithManualAction"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <strong>{{ $t('mcaCard.claimCollides') }}</strong><br>
        <span class="ps_gs-fz-12">
          {{ $t('mcaCard.claimOverwriteWithManualAction', [websiteUrl]) }}
        </span>
      </p>
      <div class="d-md-flex text-center align-items-center mt-2">
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1 text-white text-decoration-none"
          variant="secondary"
          :href="merchantCenterWebsitePageUrl"
          target="_blank"
        >
          {{ $t("cta.addWebsiteAddress") }}
        </b-button>
        <b-button
          size="sm"
          class="mx-1 mt-3 mt-md-0 mr-md-3"
          variant="outline-secondary"
          @click="dissociateMerchantCenterAccount"
        >
          {{ $t("cta.switchAccount") }}
        </b-button>
        <a
          :href="$options.googleUrl.learnAboutSiteClaiming"
          target="_blank"
          class="d-inline-block text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
        >
          {{ $t('cta.learnAboutSiteClaiming') }}
        </a>
      </div>
    </b-alert>
    <b-alert
      v-else-if="error === WebsiteClaimErrorReason.ShopInfoMissing"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <strong>{{ $t('mcaCard.shopInfoMissing') }}</strong><br>
        <span class="ps_gs-fz-12">
          {{ $t('mcaCard.shopInfoMissingDescription') }}
        </span><br>
        <a
          class="ps_gs-fz-12 text-muted"
          :href="$options.googleUrl.loginMCA"
          target="_blank"
        >
          {{ $options.googleUrl.loginMCA }}
        </a>
      </p>
    </b-alert>
    <b-alert
      v-else-if="error === WebsiteClaimErrorReason.AccountValidationFailed"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <strong>{{ $t('mcaCard.AccountValidationFailed') }}</strong><br>
        <span class="ps_gs-fz-12">
          {{ $t('mcaCard.tryAgainLater') }}
        </span>
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
      v-if="error === WebsiteClaimErrorReason.IneligibleForFreeListing"
      show
      variant="warning"
      class="mb-0 mt-3"
    >
      <p class="mb-0">
        <strong>{{ $t('mcaCard.ineligibleForFreeListing') }}</strong><br>
        <span class="ps_gs-fz-12">
          {{ $t('mcaCard.ineligibleForFreeListingDescription') }}
        </span>
      </p>
    </b-alert>
    <MerchantCenterAccountPopinOverwriteClaim
      ref="mcaPopinOverrideClaim"
    />
    <MerchantCenterAccountPopinWebsiteRequirements
      :new-mca="mcaIsConnected"
      ref="MerchantCenterAccountPopinNewMca"
    />
  </b-card>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import uniqBy from 'lodash.uniqby';
import {
  WebsiteClaimErrorReason,
} from '../../store/modules/accounts/state';
import MerchantCenterAccountPopinOverwriteClaim from './merchant-center-account-popin-overwrite-claim';
import BadgeListRequirements from '../commons/badge-list-requirements';
import MerchantCenterAccountPopinWebsiteRequirements from './merchant-center-account-popin-website-requirements.vue';

export default {
  name: 'MerchantCenterAccountCard',
  components: {
    MerchantCenterAccountPopinOverwriteClaim,
    BadgeListRequirements,
    MerchantCenterAccountPopinWebsiteRequirements,
  },
  data() {
    return {
      selectedMcaIndex: null,
      WebsiteClaimErrorReason,
      displaySiteVerified: false,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
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
      if (!this.mcaSelectionOptions) {
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
    mcaListLoading() {
      return this.mcaSelectionOptions === null;
    },
    mcaConfigured() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT_IS_CONFIGURED'];
    },
    selectedMcaDetails() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    mcaIsConnected() {
      return !(this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_IS_CONNECTED']);
    },
    error() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_WEBSITE_CLAIMING_OVERRIDE_STATUS'];
    },
    message() {
      return this.isEnabled
        ? this.$i18n.t('mcaCard.introEnabled', [this.$options.googleUrl.merchantCenterAccount])
        : this.$i18n.t('mcaCard.introDisabled');
    },
    mcaStatusBadge() {
      switch (this.error) {
        case WebsiteClaimErrorReason.Pending:
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
            text: 'urlUnclaimed',
          };
        case WebsiteClaimErrorReason.AccountValidationFailed:
          return {
            color: 'warning',
            text: 'urlUnverified',
          };
        case WebsiteClaimErrorReason.OverwriteNeededWithManualAction:
          return {
            color: 'warning',
            text: 'urlUnclaimed',
          };
        case WebsiteClaimErrorReason.IneligibleForFreeListing:
          return {
            color: 'warning',
            text: 'ineligibleForFreeListing',
          };
        default:
          return {
            color: 'success',
            text: 'active',
          };
      }
    },
    merchantCenterWebsitePageUrl() {
      const {id} = this.$store.state.accounts.googleMerchantAccount;
      return `https://merchants.google.com/mc/settings/website?a=${id}`;
    },
    websiteUrl() {
      return this.$store.state.accounts.googleMerchantAccount.websiteUrl;
    },
  },
  methods: {
    selectMerchantCenterAccount() {
      this.$emit('selectMerchantCenterAccount', this.mcaSelectionOptions[this.selectedMcaIndex]);
    },
    dissociateMerchantCenterAccount() {
      this.$emit('dissociateMerchantCenterAccount');
    },
    overrideClaim() {
      if (this.$refs.mcaPopinOverrideClaim) {
        this.$bvModal.show(
          this.$refs.mcaPopinOverrideClaim.$refs.modal.id,
        );
      }
    },
    gmcLabel(index) {
      // TODO : rework this if we use optgroups in dropdown
      if (this.mcaSelectionOptions && this.mcaSelectionOptions[index]) {
        const gmc = this.mcaSelectionOptions[index];
        const nameAndId = `${gmc.name} - ${gmc.id}`;
        return nameAndId;
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
        && this.$store.state.accounts.googleAccount.details.email !== user.emailAddress) {
          return;
        }

        isAdmin = user.admin || isAdmin;
      });
      return isAdmin;
    },
    setFocusOnSelectMCA() {
      if (this.$refs.mcaSelection) {
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
  },
  updated() {
    this.setFocusOnSelectMCA();
  },
  mounted() {
    this.setFocusOnSelectMCA();
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
