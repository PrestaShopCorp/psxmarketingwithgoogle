<template>
  <ps-modal
    id="PmaxDiscoverModal"
    ref="modal"
    :title="content.title"
    v-bind="$attrs"
    @ok="confirm"
  >
    <div class="d-flex mb-3">
      <img
        class="mr-4 img-fluid d-block"
        :src="require(`@/assets/images/pmax-modal/${content.img}`)"
        :alt="content.alt"
      >
      <div>
        <VueShowdown
          class="mb-4 h-75"
          :markdown="content.body"
        />
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
    </div>

    <template slot="modal-cancel">
      {{ $t('cta.cancel') }}
    </template>
    <template slot="modal-ok">
      {{ this.type === PmaxModalType.PMAX_RELEASED ? $t('cta.createPmax') : $t('cta.understand') }}
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
  computed: {
    content() {
      switch (this.type) {
        case PmaxModalType.COMING_SOON:
          return {
            title: this.$t('modal.upgradeSCCToPmaxTitle'),
            body: this.$t('modal.upgradeSCCToPmaxText', [
              new Date('2022-06-30').toLocaleDateString(),
            ]),
            img: this.displayImage(this.type),
            alt: 'pmax-modal-coming-soon',
          };
        case PmaxModalType.PMAX_RELEASED:
          return {
            title: this.$t('modal.PMaxLiveTitle'),
            body: this.$t('modal.PMaxLiveText'),
            img: this.displayImage(this.type),
            alt: 'pmax-modal-pmax-released',
          };
        case PmaxModalType.SSC_DEPRECATED:
          return {
            title: this.$t('modal.PMaxMigrationTitle'),
            body: this.$t('modal.PMaxMigrationText'),
            img: this.displayImage(this.type),
            alt: 'pmax-modal-ssc-deprecated',
          };
        default:
          return {
            title: '',
            body: '',
            img: '',
          };
      }
    },
  },
  methods: {
    confirm() {
      localStorage.setItem(`modalPmax-${this.type}`, true);
      this.$router.push({
        name: 'campaign-creation',
      });
    },
    displayImage(type) {
      const lang = this.$i18n.locale.toUpperCase();
      const availableLanguages = ['EN', 'FR', 'DE', 'ES', 'IT', 'NL', 'PT'];

      if (availableLanguages.includes(lang)) {
        return `pmax-modal-${type}-${lang}.png`;
      }
      return `pmax-modal-${type}-EN.png`;
    },
  },
  googleUrl,
};
</script>
