<template>
  <ps-modal
    id="ProductFeedPopinAccountErrors"
    ref="modal"
    :title="$t('gmcAccountErrors.title')"
    v-bind="$attrs"
    visible
  >
    <VueShowdown
      class="my-1"
      :markdown="$t('gmcAccountErrors.description')"
    />
    <b-card
      v-for="(accountError) in errorsList"
      :key="accountError.title"
      class="mt-2"
      no-body
    >
      <b-card-header
        class="d-flex align-items-center"
      >
        <i
          class="material-icons ps_gs-fz-20 mr-1"
          :class="`text-${iconColor(accountError.severity)}`"
        >
          {{ icon(accountError.severity) }}
        </i>
        <p class="mb-0 font-weight-600 ps_gs-fz-18">
          {{ $t('campaigns.listTitle') }}
        </p>
      </b-card-header>
      <b-card-body
        v-html="accountError.prerenderedContent"
      />
    </b-card>
    <template slot="modal-footer">
      <span />
    </template>
  </ps-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';

type AccountError = {
  title: string;
  prerenderedContent: string;
  severity: ErrorSeverity,
};

type ErrorSeverity = 'ERROR'|'WARNING'|'INFO';

export default defineComponent({
  name: 'ProductFeedPopinAccountErrors',
  components: {
    PsModal,
  },
  computed: {
    errorsList(): AccountError[] {
      return [
        {
          prerenderedContent: "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eTo confirm your online store, you&#39;ll need to verify and claim it on Merchant Center. This lets Google know that you can act on behalf of your business to provide a safe shopping experience for customers. It doesn&#39;t give Google any access to your online store.\u003c/span\u003e\u003c/p\u003e\u003ca href=\"https://support.google.com/merchants/answer/176793?hl=en-US\" class=\"content-element\"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e",
          title: 'Online store not confirmed',
          severity: 'ERROR',
        },
        {
          prerenderedContent: "\u003cdiv class=\"issue-detail\"\u003e\u003cdiv class=\"issue-content\"\u003e\u003cp class=\"content-element\"\u003e\u003cspan class=\"segment\"\u003eTo confirm your online store, you&#39;ll need to verify and claim it on Merchant Center. This lets Google know that you can act on behalf of your business to provide a safe shopping experience for customers. It doesn&#39;t give Google any access to your online store.\u003c/span\u003e\u003c/p\u003e\u003ca href=\"https://support.google.com/merchants/answer/176793?hl=en-US\" class=\"content-element\"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e",
          title: 'Online store not confirmed',
          severity: 'WARNING',
        }
      ];
    },
  },
  methods: {
    iconColor(severity: ErrorSeverity): string {
      if (severity === 'ERROR') {
        return 'danger';
      }
      if (severity === 'WARNING') {
        return 'warning';
      }
      return 'primary';
    },
    icon(severity: ErrorSeverity): string {
      if (severity === 'ERROR') {
        return 'error';
      }
      if (severity === 'WARNING') {
        return 'warning';
      }
      return 'info';
    },
  },
});
</script>
