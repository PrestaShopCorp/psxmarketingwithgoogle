<template>
  <div class="input-text-with-tag">
    <div class="container" :class="{ 'has-error': hasError }">
      <span v-for="(tag, index) in tags" :key="index" class="tag" :style="`flex-shrink: ${index}`">
        {{ tag }}<button @click="deleteTag(tag)" class="material-icons">close</button>
      </span>
      <input type="text" v-model="newTag" @keyup.enter="addTag" />
    </div>
    <b-form-invalid-feedback v-if="hasError" :state="false">
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
      tags: []
    }
  },
  props: {
    hasError: {
      type: Boolean || undefined,
      required: false,
      default: false,
    },
  },
  methods: {
    addTag() {
      if (!this.newTag) return;
      this.tags.push(this.newTag);
      this.newTag = '';
    },
    deleteTag(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    }
  },
  computed: {},
});
</script>
