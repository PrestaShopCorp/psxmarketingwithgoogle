<template>
  <ps-modal
    id="PmaxDiscoverPopin"
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
      {{ this.type === PmaxPopinType.PMAX_RELEASED ? $t('cta.createPmax') : $t('cta.done') }}
    </template>
  </ps-modal>
</template>
<script>
import PsModal from '../../commons/ps-modal';
import PmaxPopinType from '../../../enums/pmax/pmax-popin';
import googleUrl from '../../../assets/json/googleUrl.json';

export default {
  name: 'PmaxDiscoverPopin',
  components: {
    PsModal,
  },
  data() {
    return {
      PmaxPopinType,
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
        return Object.values(PmaxPopinType).includes(value);
      },
    },
  },
  mounted() {
    switch (this.type) {
      case PmaxPopinType.COMING_SOON:
        this.content.title = this.$t('modal.upgradeSCCToPmaxTitle');
        this.content.body = this.$t('modal.upgradeSCCToPmaxText', [
          new Date().toLocaleDateString(),
        ]);
        this.content.img = '';
        break;
      case PmaxPopinType.PMAX_RELEASED:
        this.content.title = this.$t('modal.PMaxLiveTitle');
        this.content.body = this.$t('modal.PMaxLiveText');
        this.content.img = '';
        break;
      case PmaxPopinType.SSC_DEPRECEATED:
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
