<template>
  <b-dropdown
    :text="languageSelectionDropdownText"
    class="ml-5"
    variant="outline-primary"
    toggle-class="text-nowrap"
    v-bind="$attrs"
  >
    <b-dropdown-form>
      <b-form-radio
        v-model="selectedLanguage"
        :value="null"
        name="campaignType"
        @input="onDataUpdate"
      >
        {{ $t('productFeedPage.approvalTable.NoFilter') }}
      </b-form-radio>
    </b-dropdown-form>
    <b-dropdown-form
      v-for="lang in languages"
      :key="lang"
    >
      <b-form-radio
        v-model="selectedLanguage"
        :value="lang"
        name="campaignType"
        @input="onDataUpdate"
      >
        {{ changeLanguageCodeToName(lang) }}
      </b-form-radio>
    </b-dropdown-form>
  </b-dropdown>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';

export default defineComponent({
  name: 'LanguageFilterSelector',
  data() {
    return {
      selectedLanguage: null as string|null,
    };
  },
  props: {
    languages: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  computed: {
    languageSelectionDropdownText() {
      if (this.selectedLanguage) {
        return this.$t('productFeedPage.compliancyIssuesPage.languageSelected', {lang: this.changeLanguageCodeToName(this.selectedLanguage)});
      }
      return this.$t('productFeedPage.compliancyIssuesPage.languageSelection');
    },
  },
  methods: {
    onDataUpdate(): void {
      this.$emit('languageToFilterUpdated', this.selectedLanguage);
    },
    changeLanguageCodeToName(langIsoCode: string): string {
      const languageName = new Intl.DisplayNames(
        [window.i18nSettings.languageLocale],
        {type: 'language'},
      ).of(langIsoCode) || langIsoCode;

      return languageName.replace(
        /^\p{CWU}/u, (char) => char.toLocaleUpperCase(window.i18nSettings.languageLocale),
      );
    },
  },
});
</script>
