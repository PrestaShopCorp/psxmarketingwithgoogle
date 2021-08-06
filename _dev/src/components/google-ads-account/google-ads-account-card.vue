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
          <!-- TODO: add the condition -->
          <i
            v-if="true"
            class="material-icons ps_gs-fz-22 ml-2 mr-3 mb-0 text-success align-bottom"
          >
            check_circle
          </i>
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
            <b-dropdown-item
              link-class="px-3"
              :disabled="true"
              v-if="listLoading"
            >
              <i class="icon-busy icon-busy--dark" />
            </b-dropdown-item>
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
              <b-dropdown-item
                v-for="(option) in googleAdsAccountSelectionOptions"
                :key="option.id"
                @click="selected = option"
                variant="dark"
              >
                {{ option.id }} - {{option.name}}
              </b-dropdown-item>
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
        <b-alert
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            Could not connect your Google Ads account, it's on our side, please give it another try.
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
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            To launch Smart Shopping campaigns, you need to add your billing settings in your Google Ads account.
          </p>
          <div class="d-md-flex text-center align-items-center mt-2">
            <b-button
              size="sm"
              class="mx-1 mt-3 mt-md-0 ml-md-0 mr-md-1"
              variant="outline-secondary"
              @click="refresh"
              href="//google.com"
              target="_blank"
            >
              {{ $t('cta.addBillingSettings') }}
            </b-button>
          </div>
        </b-alert>
        <b-alert
          show
          variant="warning"
          class="mb-0 mt-3"
        >
          <p class="mb-0">
            Once filled in your billing info in your Google Ads account, refresh the page to view updates.
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
          show
          variant="danger"
          class="mb-0 mt-3"
        >
          <div class="ps_gs-fz-12">
            <VueShowdown
              tag="p"
              class="mb-0 ps_gs-fz-12 d-inline"
              :markdown="'You need to resolve issues in your Google Ads account.'"
              :extensions="['no-p-tag', 'target_link']"
            />
            <a class="text-muted" href="http://google.com/423987654" target="_blank">
              Learn about account suspension
            </a>
          </div>
        </b-alert>
        <b-alert
          show
          variant="danger"
          class="mb-0 mt-3"
        >
          <div class="ps_gs-fz-12">
            <VueShowdown
              tag="p"
              class="mb-0 ps_gs-fz-12 d-inline"
              :markdown="'You need to reactivate your account in your Google Ads account.'"
              :extensions="['no-p-tag', 'target_link']"
            />
            <a class="text-muted" href="http://google.com/423987654" target="_blank">
              Learn about account cancellation
            </a>
          </div>
        </b-alert>
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
            class="mx-3"
            variant="success"
          >
            {{ $t(`badge.active`) }}
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
              {{ $t('cta.connectingAccount') }}
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
          >
            {{ $t('cta.dissociate') }}
          </b-button>
        </div>
      </div>
      <p
        v-if="!isConnected"
        class="mt-3 mb-0 ps_gs-fz-12 text-muted"
      >
        {{ $t('googleAdsAccountCard.text') }}
      </p>
    </template>
  </b-card>
</template>

<script>
export default {
  name: 'GoogleAdsAccountCard',
  data() {
    return {
      selected: null,
      googleAdsAccountConfigured: false,
      /**
       * TODO: To replace with actual datas
       */
      googleAdsAccountSelectionOptions: [
        {
          "id": "4150564877",
          "name": "Lui Corpette",
        },
        {
          "id": "4150564874",
          "name": "Tata Corpette",
        },
        {
          "id": "4150564875",
          "name": "Tutu Corpette",
        },
      ],
    };
  },
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    selectGoogleAdsAccount() {
      this.$emit('selectGoogleAdsAccount');
    },
    googleAdsLabel(account) {
      if (this.selected) {
        return `${account.id} - ${account.name}`;
      }
      return null;
    },
    refresh() {
      this.$router.go();
    },
  },
  computed: {
    listLoading() {
      // TODO
      return false
    },
  },
};
</script>
