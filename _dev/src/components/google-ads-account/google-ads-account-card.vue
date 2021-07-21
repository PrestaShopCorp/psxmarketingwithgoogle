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
              :text="selected || $t('cta.selectAccount')"
              variant=" "
              class="flex-grow-1 ps-dropdown ps_googleshopping-dropdown bordered"
              :toggle-class="{'ps-dropdown__placeholder' : !selected}"
              menu-class="ps-dropdown"
              no-flip
              size="sm"
            >
              <b-dropdown-item
                v-for="option in googleAdsAccountSelectionOptions"
                :key="option.text"
                @click="selected = option.text"
                variant="dark"
              >
                {{ option.text }}
              </b-dropdown-item>
            </b-dropdown>
            <b-button
              size="sm"
              variant="primary"
              :disabled="!selected"
              class="mt-3 mt-md-0 ml-md-3"
              @click="selectGoogleAdsAccount"
            >
              {{ $t('cta.chooseExistingAccount') }}
            </b-button>
          </div>
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
        <p
          class="mb-0"
        >
          {{ $t('googleAdsAccountCard.id') }}<br>
          <strong class="font-weight-600">{{ selected }}</strong>
        </p>
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
          text: '987-654-3210',
        },
        {
          text: '987-3210-654',
        },
        {
          text: '027-654-3210',
        },
        {
          text: '357-884-3210',
        },
        {
          text: '912-015-3710',
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
  },
};
</script>
