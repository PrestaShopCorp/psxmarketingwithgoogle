import {AnalyticsBrowser} from '@segment/analytics-next';

declare module 'vue' {
  import { CompatVue } from '@vue/runtime-dom'
  const Vue: CompatVue
  export default Vue
  export * from '@vue/runtime-dom'
  const { configureCompat } = Vue
  export { configureCompat }
}

declare module 'vue/types/vue' {

  interface Vue {
    $segment: AnalyticsBrowser,
  }
}

declare module '*.svg' {
  import Vue, {VueConstructor} from 'vue';

  const content: VueConstructor<Vue>;
  export default content;
}
