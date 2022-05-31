<template>
  <ps-modal
    id="PmaxDiscoverModal"
    ref="modal"
    :title="content.title"
    v-bind="$attrs"
  >
    <!-- it's temporary while waiting for the images -->
    <div
      class="square"
      style="border:1px solid grey; width:50px;height:50px;"
    />

    <VueShowdown
      class="my-1 mt-4"
      :markdown="content.body"
    />

    <div class="mt-4">
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
    </div>

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
      content: {
        title: '',
        body: '',
        img: '',
      },
    };
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
  mounted() {
    switch (this.type) {
      case PmaxModalType.COMING_SOON:
        this.content.title = this.$t('modal.upgradeSCCToPmaxTitle');
        this.content.body = this.$t('modal.upgradeSCCToPmaxText', [
          new Date().toLocaleDateString(),
        ]);
        this.content.img = '';
        break;
      case PmaxModalType.PMAX_RELEASED:
        this.content.title = this.$t('modal.PMaxLiveTitle');
        this.content.body = this.$t('modal.PMaxLiveText');
        this.content.img = '';
        break;
      case PmaxModalType.SSC_DEPRECATED:
        this.content.title = this.$t('modal.PMaxMigrationTitle');
        this.content.body = this.$t('modal.PMaxMigrationText');
        this.content.img = '';
        break;
      default:
        break;
    }
  },
  googleUrl,
};
</script>
