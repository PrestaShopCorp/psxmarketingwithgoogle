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
    <b-button
      variant="primary"
    >
      Send code
    </b-button>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      contactOption: 1,
    };
  },
}
</script>
