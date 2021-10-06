<template>
  <b-form
  >
    <b-form-group
      label="We need to verify your phone number to make sure that it is really you"
      label-class="font-weight-600 ps_gs-fz-14 mb-0 bg-transparent border-0"
      class="mb-4"
    >
      <p>
        Please select the desired method of contact to verify your identity
      </p>
    </b-form-group>
    <b-form-group>
      <b-form-radio
        v-model="contactOption"
        name="contactOption"
        value="1"
        class="mb-2"
      >
        Text messages
      </b-form-radio>
      <b-form-radio
        v-model="contactOption"
        name="contactOption"
        value="2"
      >
        Phone call
      </b-form-radio>
    </b-form-group>
    <div class="d-flex align-items-center">
      <b-button
        variant="primary"
        size="sm"
        class="mr-3"
      >
        Send code
      </b-button>
      <span class="ps_gs-fz-12 text-muted">
        You will be able to ask for a new code in 60 seconds
      </span>
    </div>
    <p>
      A text message containing an X-digit code has just been sent to {{ obfuscatedPhoneNumber }}
    </p>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      contactOption: 1,
      phoneNumber: '06 18 78 66 09'
    };
  },
  computed: {
    obfuscatedPhoneNumber() {
      return this.phoneNumber.slice(-2);
    }
  },
}
</script>
