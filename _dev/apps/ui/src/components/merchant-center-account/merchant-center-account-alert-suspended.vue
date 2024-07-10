<template>
  <div>
    <b-alert
      show
      variant="danger"
      :class="{'border border-danger': hasBorder}"
    >
      <p>
        <strong>{{ $t('mcaCard.alertSuspended') }}</strong><br>
        <i18n
          path="mcaCard.alertSuspendedDescription"
          class="mb-3"
          tag="div"
        >
          <a
            rel="openPopin"
            class="with-hover text-decoration-underline"
            role="button"
            @click.prevent="openAccountIssuesModal"
          >{{ $t('mcaCard.alertSuspendedLearnMore') }}</a>
        </i18n>
        <b-button
          variant="outline-danger"
          target="_blank"
          :href="accountReviewUrl"
        >
          {{ $t('cta.reviewAccount') }}
        </b-button>
      </p>
    </b-alert>
    <MerchantCenterAccountPopinAccountIssues
      ref="MerchantCenterAccountPopinAccountIssues"
      :issues="issues"
    />
  </div>
</template>

<script lang="ts">
import {PropType, defineComponent} from 'vue';
import googleUrl from '@/assets/json/googleUrl.json';
import MerchantCenterAccountPopinAccountIssues from '@/components/merchant-center-account/issues/merchant-center-account-popin-account-issues.vue';
import {AccountIssue} from '@/components/render-issues/types';

export default defineComponent({
  name: 'MerchantCenterAccountAlertSuspended',
  props: {
    hasBorder: {
      type: Boolean,
      default: false,
    },
    issues: {
      type: Array as PropType<AccountIssue[]>,
      required: true,
    },
    accountOverviewUrl: {
      type: String,
      required: true,
    },
  },
  computed: {
    accountReviewUrl(): string {
      const {id} = this.$store.state.accounts.googleMerchantAccount;

      return `https://merchants.google.com/mc/products/diagnostics?a=${id}&tab=account_issues`;
    },
  },
  methods: {
    openAccountIssuesModal(): void {
      this.$bvModal.show(this.$refs.MerchantCenterAccountPopinAccountIssues.$refs.modal.id);
    },
  },
  googleUrl,
  components: {MerchantCenterAccountPopinAccountIssues},
});
</script>
