<template>
  <b-tr>
    <b-td
      class="b-table-sticky-column text-primary pl-2"
    >
      <b-button
        variant="link"
        class="font-weight-normal ps_gs-fz-12 p-0 m-0 btn-max-width"
        :title="campaign.name"
      >
        {{ campaign.name }}
      </b-button>
    </b-td>
    <b-td class="ps_gs-fz-12 text-nowrap">
      {{ campaign.duration }}
    </b-td>
    <b-td
      class="ps_gs-fz-12 ps_gs-cell-status"
      :class="`ps_gs-cell-status--${campaign.status}`"
    >
      {{ $t(`campaigns.status.${campaign.status}`) }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.target }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.product }}
    </b-td>
    <b-td class="ps_gs-fz-12">
      {{ campaign.dailyBudget }}
    </b-td>
    <td class="ps_gs-fz-12 text-right">
      <b-dropdown
        variant="invisible"
        no-caret
        :id="`actions-menu-campaign-${campaign.name}`"
        class="ps-dropdown psxmarketingwithgoogle-dropdown w-auto py-0 pr-0"
        menu-class="ps-dropdown__menu-small rounded"
        toggle-class="px-1"
        boundary="window"
      >
        <template #button-content>
          <i class="material-icons ps_gs-fz-20 mx-auto">more_vert</i>
          <span class="sr-only">Open actions menu for campaign {{campaign.name}}</span>
        </template>
        <b-dropdown-item-button
          @click="goToCampaignPage(campaign.name)"
        >
          Modify the campaign
        </b-dropdown-item-button>
        <b-dropdown-item-button
          @click="isPaused()
            ? resumeCampaign()
            : pauseCampaign()"
        >
          {{ isPaused()
            ? 'Resume campaign'
            : 'Pause campaign'
          }}
        </b-dropdown-item-button>
        <b-dropdown-item
          href="//google.com"
          target="_blank"
          link-class="external_link-no_icon"
        >
          View in GMC
        </b-dropdown-item>
      </b-dropdown>
    </td>
  </b-tr>
</template>

<script>
import StickyColumnsObserver from '@/utils/StickyColumnsObserver.ts';

export default {
  mixins: [StickyColumnsObserver],
  name: 'SmartShoppingCampaignTableListRow',
  props: {
    campaign: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goToCampaignPage() {
      // TODO Go to campaign page to edit it
      console.log('goToCampaignPage', this.campaign.name);
    },
    isPaused() {
      // TODO handle if paused or not
      return this.campaign.status === 'paused';
    },
    pauseCampaign() {
      console.log('pauseCampaign', this.campaign.name);
    },
    resumeCampaign() {
      console.log('resumeCampaign', this.campaign.name);
    },
  },
};
</script>
