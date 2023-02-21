<template>
  <b-card
    no-body
    class="ps_gs-onboardingcard"
  >
    <template #header>
      <div class="d-flex align-items-center ps_gs-breadcrumb__item">
        <span>{{ $t("general.tabs.help") }}</span>
      </div>
    </template>

    <b-card-body
      class="p-3"
    >
      <b-row>
        <b-col
          cols="12"
          md="6"
        >
          <div class="module-desc d-flex mb-4">
            <div>
              <p>
                {{ $t("help.intro") }}
              </p>
              <strong class="font-weight-600">{{ $t("help.allowsYouTo.title") }}</strong>
              <ul class="mt-3">
                <li>{{ $t("help.allowsYouTo.easySync") }}</li>
                <li>{{ $t("help.allowsYouTo.freeListing") }}</li>
                <li>{{ $t("help.allowsYouTo.campaigns") }}</li>
                <li>{{ $t("help.allowsYouTo.reporting") }}</li>
              </ul>
            </div>
          </div>
        </b-col>
        <b-col
          cols="12"
          md="6"
          class="text-center"
        >
          <div>
            <iframe
              allowfullscreen=""
              frameborder="0"
              :src="getVideoUrl()"
              width="420"
              height="236"
            />
          </div>
          <div class="bg-light p-4 mt-1">
            <strong class="text-muted font-weight-600">{{ $t("help.help.needHelp") }}</strong>
            <br>
            <b-button
              class="mt-3"
              variant="primary"
              target="_blank"
              :href="$props.informations.doc"
            >
              {{ $t("help.help.downloadPdf") }}
            </b-button>
          </div>
          <div class="contact mt-4">
            <div>{{ $t("help.help.couldntFindAnyAnswer") }}</div>
            <div class="mt-2">
              <b-button
                variant="link"
                target="_blank"
                :href="$options.prestashopUrl.contactForm"
              >
                {{ $t("help.help.contactUs") }}
                <i class="material-icons">arrow_right_alt</i>
              </b-button>
            </div>
          </div>
        </b-col>
      </b-row>

      <div class="row">
        <div class="faq col">
          <h1 class="border-bottom pb-3 mb-3">
            {{ $t("faq.title") }}
          </h1>
          <div
            class="mt-3 text-center"
            v-if="loading"
          >
            <div
              class="spinner"
            />
          </div>
          <template v-else-if="informations.faq && informations.faq.categories">
            <div
              class="my-3 faq"
              v-for="(categorie, index) in informations.faq.categories"
              :key="index"
              :only-one-active="true"
            >
              <h3 class="categorie-title">
                {{ categorie.title }}
              </h3>
              <div
                :ref="index + '_' + i"
                v-for="(item, i) in categorie.blocks"
                :key="i"
                class="my-3 question"
              >
                <details
                  class="faq__details"
                  @click="onQuestionClick(index + '_' + i)"
                >
                  <summary class="faq__summary">
                    <i class="material-icons">keyboard_arrow_right</i>
                    {{ item.question }}
                  </summary>
                  <VueShowdown
                    class="faq__answer"
                    :markdown="item.answer"
                  />
                </details>
              </div>
            </div>
          </template>
          <template v-else>
            <b-alert
              class="mb-0"
              variant="warning"
              show
            >
              <p>{{ $t("faq.noFaq") }}</p>
            </b-alert>
          </template>
        </div>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import SegmentGenericParams from '@/utils/SegmentGenericParams';
import prestashopUrl from '@/assets/json/prestashopUrl.json';

export default defineComponent({
  name: 'Faq'
  props: ['informations', 'loading'],
  methods: {
    onQuestionClick(ref) {
      this.$segment.track(`[GGL] Click on the question #${ref}`, {
        module: 'psxmarketingwithgoogle',
        params: SegmentGenericParams,
      });
    },
    getVideoUrl() {
      const lang = this.$i18n.locale.toLowerCase();
      const urls = {
        en: 'https://www.youtube.com/embed/KVurUMjy2oM',
        fr: 'https://www.youtube.com/embed/qzGYpPRB3Ww',
        pl: 'https://www.youtube.com/embed/AmC7ml9B4RU',
        it: 'https://www.youtube.com/embed/4MYbgOrPnKk',
        es: 'https://www.youtube.com/embed/7MI0tVRpKB0',
      };

      return urls[lang] || urls.en;
    },
  },
  prestashopUrl,
});
</script>
