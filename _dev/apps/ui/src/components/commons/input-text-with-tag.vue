<!-- eslint-disable max-len -->
<template>
  <div
    class="input-text-with-tag"
    :class="{ 'has-error': hasError }"
  >
    <div class="input-text-with-tag-container">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="tag"
        :class="{ 'tag-error': valueIsOnError(index) }"
        :style="`flex-shrink: ${index}`"
      >
        {{ tag }}
        <button
          @click.stop.prevent="deleteTag(tag)"
          class="material-icons"
        >
          close
        </button>
      </span>
      <input
        type="text"
        v-model="newTag"
        :placeholder="setPlaceholder"
        :disabled="disabled"
        @keydown.enter.stop.prevent="addTag"
      >
    </div>
    <b-form-invalid-feedback
      v-if="hasError"
    >
      {{ $t('general.errorsMessages.enterValue') }}
    </b-form-invalid-feedback>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'InputTextWithTag',
  data() {
    return {
      newTag: '',
      tags: this.$props.defaultValue ?? [],
    };
  },
  props: {
    hasError: {
      type: Boolean || undefined,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    defaultValue: {
      type: Array,
      required: false,
      default: () => [],
    },
    valuesOnError: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  methods: {
    addTag() {
      if (!this.newTag) return;
      this.tags.push(this.newTag);
      this.newTag = '';
      this.$emit('dataUpdated', this.tags);
    },
    deleteTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      this.$emit('dataUpdated', this.tags);
    },
  },
  computed: {
    valueIsOnError() {
      return function (valueIndex: number) {
        return this.$props.valuesOnError.find((el) => el === valueIndex) !== undefined;
      };
    },
    setPlaceholder() {
      return this.$i18n.t('productFeedSettings.productSelection.lineFilter.value.enterValue') as string;
    },
  },
  watch: {
    defaultValue(newValue) {
      this.tags = newValue;
    },
  },
});
</script>
