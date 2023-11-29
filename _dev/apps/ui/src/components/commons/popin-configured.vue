<template>
  <ps-modal
    id="PopinModuleConfigured"
    v-bind="$attrs"
    hide-footer
    @close="cancel"
    ref="modal"
  >
    <b-card
      style="max-width: 40rem"
      class="card border-0"
    >
      <b-card-body align="center">
        <h2
          class="font-weight-600 text-align-center"
          style="margin-top: -65px"
        >
          {{ $t("configuredState.title") }}
        </h2>

        <img
          src="@/assets/images/configured.svg"
          class="img-fluid"
        >
        <VueShowdown
          class="mt-4"
          :markdown="$t('configuredState.text')"
        />
        <template>
          <ul
            class="timeline-configured list-unstyled mb-auto mt-4"
          >
            <VueShowdown
              v-for="(oneStep, index) in steps"
              :key="index"
              tag="li"
              :markdown="oneStep"
              class="timeline-configured__item"
            />
          </ul>
        </template>
        <b-button
          class="mt-4"
          variant="primary"
          @click="openPopinRemarketingTag"
        >
          {{ $t("configuredState.cta") }}
        </b-button>
      </b-card-body>
    </b-card>
  </ps-modal>
</template>

<script>
import PsModal from './ps-modal.vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';

export default {
  name: 'PopinModuleConfigured',
  components: {
    PsModal,
  },
  data() {
    return {
      steps: [
        this.$i18n.t('configuredState.firstStep'),
        this.$i18n.t('configuredState.secondStep'),
        this.$i18n.t('configuredState.thirdStep'),
        this.$i18n.t('configuredState.fourthStep'),
        this.$i18n.t('configuredState.fifthStep'),
        this.$i18n.t('configuredState.sixthStep'),
      ],
    };
  },
  methods: {
    cancel() {
      this.$refs.modal.hide();
    },
    openPopinRemarketingTag() {
      this.$segment.track('[GGL] Click on Go to campaign creation - popin', {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });

      this.$refs.modal.hide();
      this.$emit('openPopinRemarketingTag');
    },
  },
};
</script>
