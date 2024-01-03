<template>
  <b-alert
    show
    variant="danger"
  >
    <strong>{{ $t('mcaCard.alertSuspended') }}</strong><br>
    <VueShowdown
      :markdown="$t('mcaCard.alertSuspendedDescription', [
        accountOverviewUrl,
        $options.googleUrl.requestiongReReview
      ])"
      :extensions="['extended-link']"
    />
    <span class="text-muted d-block">
      <template
        v-for="(issue, index) in issues"
        :key="index"
      ><!--
      comment is necessary to have the comma next to the link
    --><span
    v-if="index !== 0"
    class="mr-2"
    :key="'span-' + index"
        >, </span><!--
      comment is necessary to have the comma next to the link
    --><a
      :href="issue.documentation"
      target="_blank"
      class="text-muted ps_gs-fz-12 font-weight-normal mt-3 mt-md-0"
      v-html="$t('mcaCard.linkLearnMoreAbout', [issue.title])"
    />
      </template>
    </span>
  </b-alert>
</template>

<script lang="ts">
import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import {PropType, defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';

export default defineComponent({
  name: 'MerchantCenterAccountAlertSuspended',
  props: {
    issues: {
      type: Object as PropType<contentApi.Schema$AccountStatusAccountLevelIssue[]>,
      required: true,
    },
    accountOverviewUrl: {
      type: String,
      required: true,
    },
  },
  googleUrl,
});
</script>
