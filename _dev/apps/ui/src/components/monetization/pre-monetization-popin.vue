<template>
  <ps-modal
    id="PreMonetizationPopin"
    ref="modal"
    v-bind="$attrs"
  >
    <template #modal-title>
      <span class="rounded-circle bg-ocean-blue-50 icons-title">
        <i class="material-icons ps_gs-fz-24">update</i>
      </span>
      {{ $t('modal.titlePreMonetization') }}
    </template>
    <p>{{ $t('modal.textPreMonetizationPrice') }}</p>
    <p>{{ $t('modal.textPreMonetizationFreeTrial') }}</p>
    <p class="ps_gs-fz-12 text-primary-700">
      {{ $t('modal.textPreMonetizationHostedSubscribers') }}
    </p>
    <template slot="modal-cancel">
      {{ $t('cta.close') }}
    </template>
    <template slot="modal-ok">
      {{ $t('cta.notifyAvailable') }}
    </template>
  </ps-modal>
</template>

<script>
import PsModal from '../commons/ps-modal';

export default {
  name: 'PreMonetizationPopin',
  components: {
    PsModal,
  },
};
</script>
