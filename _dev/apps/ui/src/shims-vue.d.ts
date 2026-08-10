declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'vue/types/vue' {

  interface Vue {
    $segment: {
      alias: (...args: unknown[]) => void,
      identify: (...args: unknown[]) => void,
      setAnonymousId: (...args: unknown[]) => void,
      track: (...args: unknown[]) => void,
    },
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
