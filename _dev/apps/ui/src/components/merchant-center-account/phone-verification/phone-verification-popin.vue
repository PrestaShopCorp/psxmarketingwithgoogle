<template>
  <ps-modal
    id="PhoneVerificationPopin"
    ref="modal"
    :title="$t('mcaCard.phoneVerificationNeeded')"
    v-bind="$attrs"
    @show="getPhoneNumber"
    hide-footer
  >
    <b-form>
      <p class="ps_gs-fz-14">
        {{ $t('mcaCard.needPhoneVerification') }}
      </p>
      <p class="ps_gs-fz-12 mb-1">
        {{ $t('mcaCard.phoneNumber') }}
      </p>
      <b-form-group
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
      >
        <div
          class="d-flex maxw-sm-320"
        >
          <ps-select
            :placeholder="$t('productFeedSettings.deliveryTimeAndRates.placeholderSelect')"
            :options="$options.phonesPrefixSelectionOptions"
            :deselect-from-dropdown="true"
            :clearable="false"
            class="ps_gs-v-select ps_gs-v-select--phone-prefix"
            label="name"
            v-model="phoneRegionCode"
          >
            <template #option="{ dial_code, name }">
              <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
                <span class="mr-2">{{ name }}</span>
                <span class="font-italic text-primary-600">{{ dial_code }}</span>
              </div>
            </template>
          </ps-select>
          <b-form-input
            v-model="finalPhoneNumber"
            size="sm"
            type="text"
            class="ps_gs-phone-input w-100"
            @input="clearPotentialErrorsOrMessages"
          />
        </div>
      </b-form-group>
      <p class="ps_gs-fz-12 mb-1">
        {{ $t('mcaCard.contactMethod') }}
      </p>
      <b-form-group
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
      >
        <b-form-radio-group
          :disabled="showVerificationForm"
          v-model="phoneVerificationMethod"
          :options="contactOptions"
          stacked
          name="phoneVerificationMethod"
        />
      </b-form-group>
      <div class="d-flex align-items-center mt-2 mb-6">
        <b-button
          @click="requestCodeorCall"
          variant="primary"
          size="sm"
          class="mr-3"
          :disabled="askAgainIn60Sec || phoneNumberNotValid"
        >
          {{ btnText }}
        </b-button>
        <span
          v-if="askAgainIn60Sec"
          class="ps_gs-fz-12 text-primary-600"
        >
          {{ $t('mcaCard.askAgain60sec') }}
        </span>
      </div>
      <b-form-group
        v-if="showVerificationForm"
        :disabled="isPhoneValidated"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        :invalid-feedback="invalidInputFeedback"
        :state="isCodeValid"
      >
        <p class="ps_gs-fz-12 mt-4 mb-1">
          {{ $t('mcaCard.textMessageHasBeenSent') }}
        </p>
        <p class="ps_gs-fz-12 mt-2 mb-1 font-weight-bold">
          {{ $t('mcaCard.enterCode') }}
        </p>
        <div
          class="d-flex align-items-stretch"
        >
          <div
            v-for="(n, index) in inputsVerificationCode"
            :key="index"
          >
            <b-form-input
              :value="n"
              type="number"
              class="ps_gs-code-input no-arrows"
              :disabled="isValidationInProgress"
              aria-describedby="input-code-feedback"
              :class="{'code-invalid' : isCodeValid === false}"
              ref="input"
              @input="inputHasChanged($event,index)"
              @keyup="goToNextInput"
              maxlength="1"
            />
          </div>
          <b-button
            variant="primary"
            size="sm"
            class="ml-3"
            @click="sendCode"
            :disabled="!isCompletelyFilled"
          >
            <template v-if="isValidationInProgress">
              {{ $t('mcaCard.validatingCode') }}
              <span class="ml-1 icon-busy" />
            </template>
            <template v-else>
              {{ $t('cta.validate') }}
            </template>
          </b-button>
        </div>
      </b-form-group>
      <p
        v-if="isPhoneValidated"
        class="d-flex  align-items-center"
      >
        <span> {{ $t('mcaCard.phoneVerifiedContinue') }}</span>

        <i
          class="material-icons ps_gs-fz-16 ml-1 mb-0 text-success align-center"
        >
          check_circle
        </i>
      </p>

      <b-alert
        v-if="error"
        show
        variant="warning"
        class="mb-0 mt-2"
      >
        <span> {{ error }}</span>
      </b-alert>
      <b-alert
        v-if="phoneNumberNotValid && finalPhoneNumber"
        show
        variant="warning"
        class="mb-0 mt-2"
      >
        <span> {{ $t('mcaCard.phoneNumberNotValid') }}</span>
      </b-alert>
    </b-form>

    <div class="d-md-flex text-center justify-content-end mt-3 mb-2">
      <b-button
        size="sm"
        class="mx-1 mt-3 mt-md-0"
        variant="outline-secondary"
        @click="cancel"
      >
        {{ $t("cta.cancel") }}
      </b-button>
    </div>
  </ps-modal>
</template>

<script>
import PsModal from '@/components/commons/ps-modal';
import PsSelect from '@/components/commons/ps-select';
import phonesPrefixSelectionOptions from '@/assets/json/phonesPrefix.json';
import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  components: {
    PsModal,
    PsSelect,
  },
  data() {
    return {
      contactOptions: [
        {
          text: this.$i18n.t('mcaCard.textMethod'),
          value: 'SMS',
        },
        {
          text: this.$i18n.t('mcaCard.callMethod'),
          value: 'PHONE_CALL',
        },
      ],
      error: null,
      isCodeValid: null,
      phoneVerificationMethod: 'SMS',
      showVerificationForm: false,
      indexInputChanged: 0,
      inputsVerificationCode: [null, null, null, null, null, null],
      isValidationInProgress: false,
      isPhoneValidated: false,
      phoneNumber: null,
      dialCode: this.$store.state.app.psxMtgWithGoogleDefaultShopCountry,
      askAgainIn60Sec: false,
      invalidInputFeedback: this.$i18n.t('mcaCard.invalidCode'),
      firstTimeValidationAlreadySent: false,
    };
  },
  methods: {
    cancel() {
      this.$bvModal.hide('PhoneVerificationPopin');
    },
    async requestCodeorCall() {
      this.$segment.track('[GGL] Create GMC - Step 3 Send Code', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.askAgainIn60Sec = true;
      this.isCodeValid = null;
      const payload = {
        phoneRegionCode: this.dialCode,
        phoneNumber: this.phoneNumber,
        phoneVerificationMethod: this.phoneVerificationMethod,
        languageCode: window.i18nSettings.languageLocale,
      };
      try {
        await this.$store.dispatch('accounts/REQUEST_VERIFICATION_CODE', payload);
        this.showVerificationForm = true;
        setTimeout(() => {
          this.showVerificationForm = false;
          this.resetVerificationCodeInputs();
          this.clearPotentialErrorsOrMessages();
        }, 60000);
      } catch (error) {
        if (error.code === 429) {
          this.error = this.$i18n.t('mcaCard.alertTooManyRequests');
          return;
        }
        this.error = this.$i18n.t('mcaCard.alertSomethingHappened');
      }
    },
    getPhoneNumber() {
      this.phoneNumber = this.$store.getters['accounts/GET_SHOP_INFORMATIONS'].store.phone;
    },
    resetVerificationCodeInputs() {
      this.inputsVerificationCode = this.inputsVerificationCode.map(() => null);
    },
    goToNextInput(key) {
      if (key.code === 'Backspace') {
        this.isCodeValid = null;
      }
      if (key.code !== 'Shift' && (key.keyCode < 48 || key.keyCode > 57)) {
        return;
      }
      const indexToGo = this.$refs.input[this.indexInputChanged + 1];

      if (this.indexInputChanged + 1 < this.inputsVerificationCode.length) {
        this.$nextTick(() => indexToGo.focus());
        this.$nextTick(() => indexToGo.select());
      }
      if (this.isCompletelyFilled && !this.firstTimeValidationAlreadySent) {
        this.sendCode();
      }
    },
    inputHasChanged(event, index) {
      this.indexInputChanged = index;
      this.inputsVerificationCode.splice(index, 1, parseInt(event, 10));
    },

    async sendCode() {
      this.firstTimeValidationAlreadySent = true;
      this.$segment.track('[GGL] Create GMC - Step 4 Confirm Number', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
      this.isCodeValid = null;
      this.isValidationInProgress = true;
      try {
        let verificationCode = '';
        this.inputsVerificationCode.forEach((input) => {
          verificationCode += input;
        });
        await this.$store.dispatch('accounts/SEND_VERIFICATION_CODE',
          {verificationCode});
        this.isCodeValid = true;
        this.isPhoneValidated = true;
        this.isValidationInProgress = false;
        this.ok();
      } catch (error) {
        if (error.code === 400 && error.message.includes('Wrong code')) {
          this.isCodeValid = false;
          this.isValidationInProgress = false;
          return;
        }
        if (error.code === 400 && error.message.includes('expired')) {
          this.error = this.$i18n.t('mcaCard.alertCodeExpired');
          this.isValidationInProgress = false;
          this.resetVerificationCodeInputs();
          this.askAgainIn60Sec = false;
          return;
        }
        this.error = this.$i18n.t('mcaCard.alertSomethingHappened');
        this.isValidationInProgress = false;
      }
    },

    clearPotentialErrorsOrMessages() {
      this.error = null;
      this.askAgainIn60Sec = false;
      this.isCodeValid = false;
      this.isPhoneValidated = false;
    },

    ok() {
      this.$store.dispatch('accounts/SEND_WEBSITE_REQUIREMENTS', []).then(() => {
        this.$bvModal.hide('PhoneVerificationPopin');
        this.$emit('phoneNumberVerified');
        this.resetFields();
        this.$store.commit('accounts/SAVE_STATUS_OVERRIDE_CLAIMING',
          WebsiteClaimErrorReason.PendingCreation);
        setTimeout(async () => {
          await this.$store.dispatch('accounts/REQUEST_GMC_LIST');
        }, 20000);
      });
    },
    resetFields() {
      this.error = null;
      this.isCodeValid = null;
      this.showVerificationForm = false;
      this.resetVerificationCodeInputs();
      this.isValidationInProgress = false;
      this.isPhoneValidated = false;
      this.askAgainIn60Sec = false;
    },
  },
  computed: {
    phoneNumberNotValid() {
      return !(/^\d+$/.test(this.phoneNumber));
    },
    obfuscatedPhoneNumber() {
      return this.phoneNumber.length > 2
        ? `${'•'.repeat(this.phoneNumber.length - 2)}${this.phoneNumber.slice(-2)}`
        : `${this.phoneNumber}`;
    },
    phoneRegionCode: {
      get() {
        let finish = null;
        finish = this.$options.phonesPrefixSelectionOptions.find((o) => {
          if (o.code === this.dialCode || o.dial_code === this.dialCode) {
            return o;
          }
          return finish;
        });
        return finish.dial_code;
      },
      set(value) {
        this.dialCode = value.code;
      },
    },
    finalPhoneNumber: {
      get() {
        return this.phoneNumber;
      },
      set(value) {
        this.phoneNumber = value;
      },
    },

    btnText() {
      if (this.phoneVerificationMethod === 'SMS') {
        return this.askAgainIn60Sec ? this.$i18n.t('mcaCard.codeSent') : this.$i18n.t('mcaCard.sendCode');
      }
      return this.$i18n.t('mcaCard.receiveCall');
    },
    isCompletelyFilled() {
      return this.inputsVerificationCode.every((partialCode) => Number.isInteger(partialCode));
    },
  },
  phonesPrefixSelectionOptions,
};
</script>
