<template>
  <ps-modal
    id="MerchantCenterAccountPopinAccountIssues"
    ref="modal"
    :title="$t('gmcAccountIssues.title')"
    v-bind="$attrs"
  >
    <VueShowdown
      class="mb-3"
      :markdown="$t('gmcAccountIssues.description')"
    />
    <card-collapse
      v-for="issue in issues"
      :key="issue.title"
      class="mt-3"
      visible
    >
      <div
        slot="title"
        class="d-flex align-items-center"
      >
        <i
          class="material-icons ps_gs-fz-20 mr-1"
          :class="`text-${iconColor(issue.impact.severity)}`"
        >
          {{ icon(issue.impact.severity) }}
        </i>
        <p class="mb-0 font-weight-600 ps_gs-fz-18">
          {{ issue.title }}
        </p>
      </div>
      <div
        slot="content"
        v-html="issue.prerenderedContent"
      />
    </card-collapse>

    <template slot="modal-footer">
      <span />
    </template>
  </ps-modal>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import PsModal from '@/components/commons/ps-modal.vue';
import CardCollapse from '@/components/commons/card-collapse.vue';
import {AccountIssue, ErrorSeverity} from './types';

export default defineComponent({
  name: 'MerchantCenterAccountPopinAccountIssues',
  components: {
    PsModal,
    CardCollapse,
  },
  computed: {
    issues(): AccountIssue[] {
      return [
        {
          title: 'Online store not confirmed',
          impact: {
            severity: 'ERROR',
            breakdowns: [
              {
                details: [
                  'Products not showing in ads',
                  'Products not showing organically',
                ],
              },
            ],
          },
          prerenderedContent:
            '\u003cdiv class="issue-detail"\u003e\u003cdiv class="issue-content"\u003e\u003cp class="content-element"\u003e\u003cspan class="segment"\u003eTo confirm your online store, you&#39;ll need to verify and claim it on Merchant Center. This lets Google know that you can act on behalf of your business to provide a safe shopping experience for customers. It doesn&#39;t give Google any access to your online store.\u003c/span\u003e\u003c/p\u003e\u003ca href="https://support.google.com/merchants/answer/176793?hl=en-US" class="content-element"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e',
          actions: [
            {
              builtinSimpleAction: {
                type: 'CLAIM_WEBSITE',
              },
              buttonLabel: 'Claim your website',
              isAvailable: true,
            },
          ],
        },
        {
          title: 'An exemple of warning',
          impact: {
            severity: 'WARNING',
          },
          prerenderedContent:
            '\u003cdiv class="issue-detail"\u003e\u003cdiv class="issue-content"\u003e\u003cp class="content-element"\u003e\u003cspan class="segment"\u003eProvided store name: Shop 7 (Planete Soif). Used store name: shop7.webmodule.prestashop.net/fr\u003c/span\u003e\u003c/p\u003e\u003ca href="https://support.google.com/merchants/answer/6101130" class="content-element"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e',
        },
        {
          title: 'Invalid store name',
          impact: {
            severity: 'INFO',
          },
          prerenderedContent:
            '\u003cdiv class="issue-detail"\u003e\u003cdiv class="issue-content"\u003e\u003cp class="content-element"\u003e\u003cspan class="segment"\u003eProvided store name: Shop 7 (Planete Soif). Used store name: shop7.webmodule.prestashop.net/fr\u003c/span\u003e\u003c/p\u003e\u003ca href="https://support.google.com/merchants/answer/6101130" class="content-element"\u003eLearn more\u003c/a\u003e\u003c/div\u003e\u003c/div\u003e',
        },
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
      if (severity === 'INFO') {
        return 'info';
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
