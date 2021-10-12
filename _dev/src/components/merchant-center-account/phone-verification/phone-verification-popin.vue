<template>
  <ps-modal
    id="PhoneVerificationPopin"
    ref="modal"
    :title="$t('mcaCard.phoneVerificationNeeded')"
    v-bind="$attrs"
    @ok="ok"
    :ok-disabled="!isPhoneValidated"
  >
    <b-form>
      <p class="ps_gs-fz-14">
        {{ $t('mcaCard.needPhoneVerification') }}
      </p>
      <b-form-group
        :label="$t('mcaCard.phoneNumber')"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        :description="$t('mcaCard.fillInputs')"
      >
        <div
          class="d-flex maxw-sm-320"
        >
          <ps-select
            :placeholder="$t('productFeedSettings.shipping.placeholderSelect')"
            :options="$options.phonesPrefixSelectionOptions"
            :deselect-from-dropdown="true"
            :clearable="false"
            class="ps_gs-v-select ps_gs-v-select--phone-prefix"
            :label="$t('mcaCard.dialCode')"
            v-model="phoneRegionCode"
          >
            <template #option="{ dial_code, name }">
              <div class="d-flex flex-wrap flex-md-nowrap align-items-center pr-3">
                <span class="mr-2">{{ name }}</span>
                <span class="font-italic text-muted">{{ dial_code }}</span>
              </div>
            </template>
          </ps-select>
          <b-form-input
            v-model="finalPhoneNumber"
            size="sm"
            type="text"
            class="ps_gs-phone-input w-100"
            @input="clearPotentialErrors"
          />
        </div>
      </b-form-group>
      <b-form-group
        :label="$t('mcaCard.contactMethod')"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        :description="$t('mcaCard.selectMethod')"
      >
        <b-form-radio-group
          :disabled="showAll"
          v-model="phoneVerificationMethod"
          :options="contactOptions"
          name="phoneVerificationMethod"
        />
      </b-form-group>
      <div class="d-flex align-items-center mt-4 mb-3">
        <b-button
          @click="requestCodeorCall"
          variant="primary"
          size="sm"
          class="mr-3"
          :disabled="askAgainIn60Sec"
        >
          {{ btnText }}
        </b-button>
        <span
          v-if="showAll"
          class="ps_gs-fz-12 text-muted"
        >

          {{ $t('mcaCard.askAgain60sec') }}
        </span>
      </div>
      <b-form-group
        v-if="showAll"
        :disabled="isPhoneValidated"
        :label="$t('mcaCard.code')"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        :state="isCodeValid"
        :invalid-feedback="$t('mcaCard.invalidCode')"
      >
        <p>
          {{ $t('mcaCard.textMessageHasBeenSent') }} {{ obfuscatedPhoneNumber }}
        </p>
        <div
          class="d-flex align-items-stretch"
        >
          <b-form-input
            v-model="invitationId"
            size="sm"
            type="text"
            maxlength="6"
            class="ps_gs-code-input"
            :disabled="isValidationInProgress"
            aria-describedby="input-code-feedback"
            :state="isCodeValid"
          />
          <b-button
            variant="primary"
            size="sm"
            class="ml-3"
            @click="sendCode"
          >
            <template v-if="!isValidationInProgress">
              {{ $t('cta.validate') }}
            </template>
            <template v-else>
              {{ $t('mcaCard.validatingCode') }}
              <span class="ml-1 icon-busy" />
            </template>
          </b-button>
        </div>
        <template #description>
          {{ $t('mcaCard.enterCode') }}
        </template>
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
    </b-form>
  </ps-modal>
</template>

<script>
import PsModal from '@/components/commons/ps-modal';
import PsSelect from '@/components/commons/ps-select';
import phonesPrefixSelectionOptions from '@/assets/json/phonesPrefix.json';
import {WebsiteClaimErrorReason} from '@/store/modules/accounts/state';

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
      showAll: false,
      invitationId: null,
      isValidationInProgress: false,
      isPhoneValidated: false,
      phoneNumber: null,
      dialCode: this.$store.getters['app/GET_ACTIVE_COUNTRIES'][0],
      askAgainIn60Sec: false,
    };
  },
  methods: {
    requestCodeorCall() {
      this.askAgainIn60Sec = true;
      this.isCodeValid = null;
      const payload = {
        phoneRegionCode: this.dialCode,
        phoneNumber: this.phoneNumber,
        phoneVerificationMethod: this.phoneVerificationMethod,
        languageCode: window.i18nSettings.languageLocale,
      };
      this.$store.dispatch('accounts/REQUEST_VERIFICATION_CODE', payload).then((resp) => {
        if (resp) {
          this.showAll = true;
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.askAgainIn60Sec = false;
            this.showAll = false;
            this.invitationId = null;
          }, 60000);
        } else {
          this.error = this.$i18n.t('mcaCard.alertTooManyRequests');
        }
      });
    },
    sendCode() {
      this.isCodeValid = null;
      this.isValidationInProgress = true;
      this.$store.dispatch('accounts/SEND_VERIFICATION_CODE', {verificationCode: this.invitationId}).then((resp) => {
        if (resp) {
          this.isCodeValid = true;
          this.isPhoneValidated = true;
        } else {
          this.isCodeValid = false;
          this.error = this.$i18n.t('mcaCard.alertSomethingHappened');
        }
        this.isValidationInProgress = false;
      });
    },

    clearPotentialErrors() {
      this.error = null;
      this.askAgainIn60Sec = false;
    },

    ok() {
      this.$store.dispatch('accounts/SEND_WEBSITE_REQUIREMENTS', []).then(() => {
        this.$store.commit('accounts/SAVE_STATUS_OVERRIDE_CLAIMING',
          WebsiteClaimErrorReason.PendingCreation);
        setTimeout(async () => {
          await this.$store.dispatch('accounts/REQUEST_GMC_LIST');
        }, 20000);
      });
    },
  },
  computed: {
    obfuscatedPhoneNumber() {
      return this.phoneNumber.length > 2
        ? `${'•'.repeat(this.phoneNumber.length - 2)}${this.phoneNumber.slice(-2)}`
        : `${this.phoneNumber}`;
    },
    phoneRegionCode: {
      get() {
        if (this.dialCode.includes('+')) {
          return this.dialCode;
        }
        const finish = this.$options.phonesPrefixSelectionOptions.find((o) => {
          if (o.code === this.dialCode || o.dial_code === this.dialCode) {
            return o;
          }
          return finish;
        });
        return finish.dial_code;
      },
      set(value) {
        this.dialCode = value.dial_code;
      },
    },
    finalPhoneNumber: {
      get() {
        return this.$store.getters['accounts/GET_SHOP_INFORMATIONS'].store.phone;
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
  },
  mounted() {
    this.$store.dispatch('accounts/REQUEST_SHOP_INFORMATIONS');
  },

  phonesPrefixSelectionOptions,
};
</script>
