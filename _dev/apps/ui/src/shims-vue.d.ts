import {AnalyticsBrowser} from '@segment/analytics-next';

declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'vue/types/vue' {

  interface Vue {
    $segment: AnalyticsBrowser,
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $root: Vue & {
      identifySegment: () => void;
    }
  }
}

declare module '*.svg' {
  import Vue, {VueConstructor} from 'vue';

  const content: VueConstructor<Vue>;
  export default content;
}
