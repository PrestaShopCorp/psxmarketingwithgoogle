<template>
  <ps-modal
    id="PhoneVerificationPopin"
    ref="modal"
    :title="$t('mcaCard.phoneVerificationNeeded')"
    v-bind="$attrs"
    @ok="ok"
    :ok-disabled="btnContinueDisabled"
  >
    <b-form>
      <p class="ps_gs-fz-14">
        We need to verify your phone number to make sure that it is really you
      </p>
      <b-form-group
        label="Phone number"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        description="Please fill in your phone number and select your international prefix"
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
            label="dial_code"
            :reduce="country => country.code"
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
            v-model="phoneNumber"
            size="sm"
            type="text"
            class="ps_gs-phone-input w-100"
          />
        </div>
      </b-form-group>
      <b-form-group
        label="Contact method"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        description="Please select the desired method of contact to verify your identity"
      >
        <b-form-radio-group
          :disabled="areBtnDisabled"
          v-model="phoneVerificationMethod"
          :options="contactOptions"
          name="phoneVerificationMethod"
        />
      </b-form-group>
      <div class="d-flex align-items-center mt-4 mb-3">
        <b-button
          variant="primary"
          size="sm"
          class="mr-3"
          :disabled="areBtnDisabled"
        >
          {{ btnText }}
        </b-button>
        <span
          v-if="areBtnDisabled"
          class="ps_gs-fz-12 text-muted"
        >
          You will be able to ask for a new code in 60 seconds
        </span>
      </div>
      <p>
        A text message containing an X-digit code has just been sent to {{ obfuscatedPhoneNumber }}
      </p>
      <b-form-group
        :disabled="isPhoneValidated"
        label="Code"
        label-class="border-0 bg-transparent h4 d-flex align-items-center font-weight-600"
        :state="isCodeValid"
        :invalid-feedback="'Your code is invalid, please check your code or ask for a new one.'"
      >
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
          >
            <template v-if="!isValidationInProgress">
              Validate
            </template>
            <template v-else>
              Validating your code
              <span class="ml-1 icon-busy" />
            </template>
          </b-button>
        </div>
        <template #description>
          Enter your six digits code
        </template>
      </b-form-group>
      <p
        v-if="isPhoneValidated"
        class="d-flex  align-items-center"
      >
        <span>Your phone number has been verified, you can continune your account creation.</span>
        <i
          class="material-icons ps_gs-fz-16 ml-1 mb-0 text-success align-center"
        >
          check_circle
        </i>
      </p>
    </b-form>
  </ps-modal>
</template>

<script>
import PsModal from '@/components/commons/ps-modal';
import PsSelect from '@/components/commons/ps-select';
import phonesPrefixSelectionOptions from '@/assets/json/phonesPrefix.json';

/*
  TODO:
  - Handle phone verification (only number and so on)
*/
export default {
  components: {
    PsModal,
    PsSelect,
  },
  data() {
    return {
      contactOptions: [
        {
          text: 'Text messages',
          value: 'SMS',
        },
        {
          text: 'Phone call',
          value: 'PHONE_CALL',
        },
      ],
      phoneVerificationMethod: 'SMS',
      phoneNumber: '0618786609',
      phoneRegionCode: this.$store.getters['app/GET_ACTIVE_COUNTRIES'][0],
      areBtnDisabled: true,
      invitationId: null,
      isValidationInProgress: false,
      isPhoneValidated: false,
    };
  },
  computed: {
    obfuscatedPhoneNumber() {
      return this.phoneNumber.length > 2
        ? `${'•'.repeat(this.phoneNumber.length - 2)}${this.phoneNumber.slice(-2)}`
        : `${this.phoneNumber}`;
    },
    btnText() {
      if (this.phoneVerificationMethod === 'SMS') {
        return this.areBtnDisabled ? 'Code sent' : 'Send code';
      }
      return 'Receive call';
    },
    isCodeValid() {
      // ! Just for test, need real condition
      return this.invitationId?.length > 3 ? false : null;
    },
    btnContinueDisabled() {
      return true;
    },
  },
  methods: {
    ok() {

    },
  },
  phonesPrefixSelectionOptions,
};
</script>
