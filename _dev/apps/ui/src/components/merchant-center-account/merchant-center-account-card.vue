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
        </b-card>
      </template>
      <b-card
        no-body
        class="ps_gs-onboardingcard p-3 mb-3"
        :class="{'ps_gs-onboardingcard--disabled': !isEnabled}"
      >
        <div class="d-flex align-items-center mb-3">
          <img
            class="mr-2"
            src="@/assets/images/google-merchant-center-icon.svg"
            width="32"
            height="32"
            alt=""
          >
          <b-card-text class="ps_gs-onboardingcard__title text-left mb-0">
            {{ $t('tinyLuxGoogle.merchantTitle') }}
          </b-card-text>
          <b-badge
            v-if="selectedAccount.id"
            variant="success"
            class="ml-3"
          >
            {{ $t('badge.connected') }}
          </b-badge>
        </div>

        <div
          v-if="isEnabled"
          class="ml-2 ps_gs-onboardingcard__content"
        >
          <template v-if="!selectedAccount.id || isChangingAccount">
            <p>
              {{ $t('tinyLuxGoogle.merchantIntro') }}
            </p>
            <div class="d-md-flex align-items-center">
              <select
                id="mcaSelection"
                v-model.number="selectedMcaIndex"
                class="custom-select custom-select-sm flex-grow-1"
                :disabled="isLinking || accountOptions.length === 0"
              >
                <option :value="null">
                  {{ accountOptions.length
                    ? $t('cta.selectAccount')
                    : $t('tinyLuxGoogle.noMerchant') }}
                </option>
                <option
                  v-for="(account, index) in accountOptions"
                  :key="account.id"
                  :value="index"
                >
                  {{ gmcLabel(index) }}
                </option>
              </select>
              <b-button
                v-if="!isChangingAccount"
                size="sm"
                variant="primary"
                class="mt-2 mt-md-0 ml-md-2"
                :disabled="selectedMcaIndex === null || isLinking"
                @click="selectMerchantCenterAccount"
              >
                {{ $t('cta.connectAccount') }}
              </b-button>
              <template v-else>
                <b-button
                  data-test="confirm-merchant-account-change"
                  size="sm"
                  variant="primary"
                  class="mt-2 mt-md-0 ml-md-2"
                  :disabled="!hasNewMerchantAccountSelection || isLinking"
                  @click="selectMerchantCenterAccount"
                >
                  {{ $t('cta.saveChange') }}
                </b-button>
                <b-button
                  data-test="cancel-merchant-account-change"
                  size="sm"
                  variant="outline-secondary"
                  class="mt-2 mt-md-0 ml-md-2"
                  :disabled="isLinking"
                  @click="cancelMerchantAccountChange"
                >
                  {{ $t('cta.cancel') }}
                </b-button>
              </template>
            </div>
          </template>

          <div
            v-else
            class="d-flex align-items-center justify-content-between"
          >
            <span>{{ selectedAccount.name }} - {{ selectedAccount.id }}</span>
            <b-button
              data-test="change-merchant-account"
              size="sm"
              variant="outline-secondary"
              @click="startChangingMerchantAccount"
            >
              {{ $t('cta.switchAccount') }}
            </b-button>
          </div>

          <b-alert
            v-if="linkingFailed"
            show
            variant="warning"
            class="mt-3 mb-0"
          >
            <p class="mb-2">
              {{ $t('mcaCard.linkingFailed') }}
            </p>
            <b-button
              size="sm"
              variant="outline-secondary"
              @click="refresh"
            >
              {{ $t('general.refreshPage') }}
            </b-button>
          </b-alert>
        </div>
      </b-card>
    </b-skeleton-wrapper>
  </section>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {BAlert} from 'bootstrap-vue';

export default defineComponent({
  name: 'MerchantCenterAccountCard',
  components: {BAlert},
  props: {
    isEnabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: true,
    },
    isLinking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedMcaIndex: null as number|null,
      isChangingAccount: false,
    };
  },
  computed: {
    accountOptions() {
      return this.$store.getters['accounts/GET_GOOGLE_ACCOUNT_MCA_LIST'] || [];
    },
    selectedAccount() {
      return this.$store.getters['accounts/GET_GOOGLE_MERCHANT_CENTER_ACCOUNT'];
    },
    linkingFailed(): boolean {
      return this.$store.getters['accounts/GET_MERCHANT_SELECTION_ERROR']
        === 'LinkingFailed';
    },
    hasNewMerchantAccountSelection(): boolean {
      if (this.selectedMcaIndex === null || !this.accountOptions[this.selectedMcaIndex]) {
        return false;
      }
      return this.accountOptions[this.selectedMcaIndex].id !== this.selectedAccount.id;
    },
  },
  methods: {
    selectMerchantCenterAccount() {
      if (this.selectedMcaIndex === null) {
        return;
      }
      const selected = this.accountOptions[this.selectedMcaIndex];

      if (!selected || (this.isChangingAccount && selected.id === this.selectedAccount.id)) {
        return;
      }
      this.$emit('selectMerchantCenterAccount', selected);
      this.cancelMerchantAccountChange();
    },
    startChangingMerchantAccount() {
      this.selectedMcaIndex = null;
      this.isChangingAccount = true;
    },
    cancelMerchantAccountChange() {
      this.selectedMcaIndex = null;
      this.isChangingAccount = false;
    },
    gmcLabel(index: number|null): string|null {
      if (index === null || !this.accountOptions[index]) {
        return null;
      }
      const account = this.accountOptions[index];

      return `${account.id} - ${account.name}`;
    },
    refresh() {
      this.$router.go();
    },
  },
});
</script>
