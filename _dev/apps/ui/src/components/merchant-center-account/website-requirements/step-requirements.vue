<template>
  <form
    class="my-1"
  >
    <VueShowdown
      tag="legend"
      class="font-weight-normal ps_gs-fz-14 mb-2 bg-transparent border-0"
      :markdown="$t('mcaRequirements.legend')"
      :extensions="['no-p-tag']"
    />
    <b-alert
      v-if="!newMca"
      variant="info"
      show
      class="mt-3 mb-2"
    >
      <p class="mb-0">
        {{ $t('mcaRequirements.alert') }}
      </p>
    </b-alert>
    <ul class="list-unstyled">
      <li
        v-for="requirement in requirements"
        :key="$t(`mcaRequirements.${requirement}.title`)"
        class="d-flex py-1 pl-2"
      >
        <component
          :is="newMca ? 'b-form-checkbox' : 'div'"
          class="ps_gs-checkbox ml-n2"
          :class="{'d-flex': !newMca}"
          :id="safeString($t(`mcaRequirements.${requirement}.title`))"
          v-model="selectedRequirements"
          :value="newMca ? requirement : null"
          :indeterminate="true"
          @change="getCurrentCheckbox"
        >
          <i
            v-if="!newMca"
            class="material-icons text-success mr-2 ps_gs-fz-18"
          >
            check
          </i>
          <div class="d-flex align-items-center">
            <span
              class="ps_gs-fz-14 font-weight-normal mb-1"
              v-html="$t(`mcaRequirements.${requirement}.title`)"
            />
            <b-button
              class="ml-1 p-0 d-flex"
              variant="text"
              v-b-tooltip:psxMktgWithGoogleApp
              :title="tooltipFormat(requirement)"
            >
              <span class="material-icons-round mb-1 ml-0 ps_gs-fz-12 text-primary">
                info_outlined
              </span>
            </b-button>
          </div>
        </component>
      </li>
    </ul>
  </form>
</template>

<script>
import googleUrl from '@/assets/json/googleUrl.json';
import WebsiteRequirements from '@/enums/merchant-center-account/website-requirements';

export default {
  data() {
    return {
      selectedRequirements: [],
    };
  },
  props: {
    newMca: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    requirements() {
      return Object.values(WebsiteRequirements);
    },
  },
  methods: {
    safeString(str) {
      let newStr = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      newStr = newStr
        .replace(/-/g, ' ') // convert all hyphens to spaces
        .replace(/\s+/g, ''); // remove spaces
      return newStr;
    },
    getCurrentCheckbox() {
      this.$store.dispatch('accounts/SEND_WEBSITE_REQUIREMENTS', this.selectedRequirements);
      this.$emit('stepRequirementsValidation', !(this.selectedRequirements.length === this.requirements.length));
    },
    tooltipFormat(requirement) {
      return this.$t(`mcaRequirements.${requirement}.description`);
    },
  },
  mounted() {
    if (this.newMca === true) {
      this.$store.dispatch('accounts/REQUEST_WEBSITE_REQUIREMENTS').then(() => {
        this.selectedRequirements = this.$store.getters['accounts/GET_WEBSITE_REQUIREMENTS'];
      });
    }
  },
  googleUrl,
};
</script>
