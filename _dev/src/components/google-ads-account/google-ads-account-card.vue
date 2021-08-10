<!-- NOTHING DONE YET -->
<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard p-3"
    :class="{ 'ps_gs-onboardingcard--disabled-grey' : !isEnabled }"
  >
    <template
      v-if="!isEnabled"
    >
      <div
        class="d-flex align-items-center"
      >
        <img
          class="mr-3 rounded-circle"
          src="@/assets/images/Google-Commercial-icon-grey.svg"
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="text-left mb-0">
          {{ $t('googleAdsAccountCard.intro') }}
        </b-card-text>
      </div>
    </template>
    <template
      v-else
    >
      <div
        class="d-flex align-items-center"
      >
        <img
          class="mr-3 rounded-circle"
          src="@/assets/images/Google-Commercial-icon.svg"
          width="40"
          height="40"
          alt=""
        >
        <b-card-text class="ps_gs-onboardingcard__title  text-left mb-0">
          {{ $t('googleAdsAccountCard.title') }}
        </b-card-text>
        <i
          v-if="googleAdsAccountConfigured && !error"
          class="material-icons ps_gs-fz-22 ml-2 mr-3 mb-0 text-success align-bottom"
        >
          check_circle
        </i>
      </div>
      <div v-if="isEnabled && !googleAdsAccountConfigured">
        <b-form class="mt-3 mb-2">
          <legend
            class="mb-1 h4 font-weight-600 border-0 bg-transparent"
          >
            {{ $t('googleAdsAccountCard.labelSelect') }}
          </legend>
          <div class="d-md-flex text-center">
            <b-dropdown
              :disabled="error === 'CantConnect'"
              id="googleAdsAccountSelection"
              ref="googleAdsAccountSelection"
              :text="googleAdsLabel(selected) || $t('cta.selectAccount')"
              variant=" "
              class="flex-grow-1 ps-dropdown psxmarketingwithgoogle-dropdown bordered"
              :toggle-class="{'ps-dropdown__placeholder' : !selected}"
              menu-class="ps-dropdown"
              no-flip
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
                link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
              >
                <span class="mr-2">
                  {{ $t('mcaCard.noExistingAccount') }}
                </span>
              </b-dropdown-item>
              <!-- END > NO EXISTING ACCOUNT -->
              <!-- START > REGULAR LIST -->
              <b-dropdown-item
                v-for="(option) in googleAdsAccountSelectionOptions"
                :key="option.id"
                @click="selected = option"
                :disabled="isAdmin(option)"
                variant="dark"
                link-class="d-flex flex-wrap flex-md-nowrap align-items-center px-3"
              >
                <span class="mr-2">
                  {{ option.id }} - {{ option.name }}
                </span>
                <span
                  v-if="isAdmin(option)"
                  class="ps_gs-fz-12 ml-auto"
                >
                  {{ $t('mcaCard.userIsNotAdmin') }}
                </span>
              </b-dropdown-item>
              <!-- END > REGULAR LIST -->
            </b-dropdown>
            <b-button
              size="sm"
              variant="primary"
              :disabled="!selected"
              class="mt-3 mt-md-0 ml-md-3"
              @click="selectGoogleAdsAccount"
            >
              {{ $t('cta.connect') }}
            </b-button>
          </div>
          <VueShowdown
            class="text-muted ps_gs-fz-12 mt-3 mt-md-0"
            :markdown="$t('googleAdsAccountCard.toUseGAdsNeedsAdminAccess')"
          />
        </b-form>
        <div class="mt-3">
          <a href="#">
            <i
              class="left material-icons mr-2"
              aria-hidden="true"
            >person_add</i>
            <span class="align-middle">
              {{ $t('cta.createNewGoogleAdsAccount') }}
            </span>
          </a>
        </div>
      </div>
      <div
        v-if="googleAdsAccountConfigured"
        class="d-flex flex-wrap flex-md-nowrap justify-content-between mt-3"
      >
        <div class="d-flex align-items-center">
          <a
            :href="'//google.com'"
            :title="$t('cta.goToYourX', [$t('badge.googleAdsAccount')])"
            target="_blank"
            class="external_link-no_icon link-regular"
          >
            <strong>{{ selected.name }} - {{ selected.id }}</strong>
          </a>
          <b-badge
            v-if="gAdsAccountStatusBadge !== null"
            :variant="gAdsAccountStatusBadge.color"
            class="mx-3"
          >
            {{ $t(`badge.${gAdsAccountStatusBadge.text}`) }}
          </b-badge>
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
              {{ $t('cta.connectAccount') }}
            </template>
            <template v-else>
              {{ $t('cta.connecting') }}
              <span class="ml-1 icon-busy" />
            </template>
          </b-button>
        </div>
        <div
          v-else
          class="mx-auto d-flex-md mr-md-0 flex-md-shrink-0 text-center align-self-end"
        >
          <b-button
            size="sm"
            variant="outline-secondary"
            class="mt-3 mt-md-0"
            target="_blank"
            @click="dissociateGoogleAdsAccount()"
          >
            {{ $t('cta.dissociate') }}
          </b-button>
        </div>
      </div>
      <p
        v-if="!googleAdsAccountConfigured"
        class="mt-3 mb-0 ps_gs-fz-12 text-muted"
      >
        {{ $t('googleAdsAccountCard.text') }}
      </p>
    </template>
    <GoogleAdsAccountAlert
      :error="error"
    />
  </b-card>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import GoogleAdsAccountAlert from './google-ads-account-alert.vue';

export default {
  name: 'GoogleAdsAccountCard',
  components: {
    GoogleAdsAccountAlert,
  },
  data() {
    return {
      selected: this.$store.state.googleAds.accountChosen
        ? this.$store.state.googleAds.accountChosen : null,
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectGoogleAdsAccount() {
      this.$emit('selectGoogleAdsAccount', this.selected);
    },
    googleAdsLabel(account) {
      if (this.selected) {
        return `${account.id} - ${account.name}`;
      }
      return null;
    },
    isAdmin(account) {
      // !! MIGHT NEED REFACTO if no isAdmin is sent by the API
      // !! CF merchand center account card isGmcUserAdmin
      return account.isAdmin === true;
    },
    refresh() {
      this.$router.go();
    },
    dissociateGoogleAdsAccount() {
      this.$emit('dissociationGoogleAdsAccount');
    },
  },
  computed: {
    googleAdsAccountConfigured() {
      return !!this.$store.state.googleAds.accountChosen;
    },

    listLoading() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_LIST_OPTIONS'] == null;
    },
    error() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_STATUS'];
    },
    googleAdsAccountSelectionOptions() {
      return this.$store.getters['googleAds/GET_GOOGLE_ADS_LIST_OPTIONS'];
    },
    gAdsAccountStatusBadge() {
      switch (this.error) {
        case 'Suspended':
          return {
            color: 'danger',
            text: 'suspended',
          };
        case 'Cancelled':
          return {
            color: 'danger',
            text: 'canceled',
          };
        case 'CantConnect':
          return null;
        case 'BillingSettingsMissing':
        case 'NeedRefreshAfterBilling':
        default:
          return {
            color: 'success',
            text: 'active',
          };
      }
    },
  },
  googleUrl,
};
</script>
