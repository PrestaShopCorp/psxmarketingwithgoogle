<template>
  <ps-modal
    id="PmaxDiscoverModal"
    ref="modal"
    :title="content.title"
    v-bind="$attrs"
  >
    <!-- it's temporary while waiting for the images -->
    <div class="d-flex mb-4">

      <img
        class="mr-4"
        :src="content.img"
      />

      <VueShowdown
        :markdown="content.body"
      />
    </div>

    <span class="material-icons">
      link
    </span>
    <a
      class="external_link-no_icon text-muted"
      :href="$options.googleUrl.pmaxReleaseLink"
      target="_blank"
    >
      {{ $t('modal.PmaxTextLink') }}
    </a>

    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ this.type === PmaxModalType.PMAX_RELEASED ? $t('cta.createPmax') : $t('cta.done') }}
    </template>
  </ps-modal>
</template>
<script>
import PsModal from '../../commons/ps-modal';
import PmaxModalType from '../../../enums/pmax/pmax-modal';
import googleUrl from '../../../assets/json/googleUrl.json';

export default {
  name: 'PmaxDiscoverPopin',
  components: {
    PsModal,
  },
  data() {
    return {
      PmaxModalType,
    }
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        if (value === null) {
          return true;
        }
        return Object.values(PmaxModalType).includes(value);
      },
    },
  },
  computed: {
    content() {
      switch (this.type) {
        case PmaxModalType.COMING_SOON:
          return {
            title: this.$t('modal.upgradeSCCToPmaxTitle'),
            body: this.$t('modal.upgradeSCCToPmaxText', [
              new Date().toLocaleDateString(),
            ]),
            img: '',
          };
        case PmaxModalType.PMAX_RELEASED:
          return {
            title: this.$t('modal.PMaxLiveTitle'),
            body: this.$t('modal.PMaxLiveText'),
            img: '',
          };
        case PmaxModalType.SSC_DEPRECATED:
          return {
            title: this.$t('modal.PMaxMigrationTitle'),
            body: this.$t('modal.PMaxMigrationText'),
            img: '',
          };
        default:
          return {
            title: '',
            body: '',
            img: '',
          }
      }
    }
  },
  googleUrl,
};
</script>
