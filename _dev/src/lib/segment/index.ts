import {AnalyticsBrowser, InitOptions} from '@segment/analytics-next';
import {VueConstructor} from 'vue';
import VueRouter from 'vue-router';

interface SegmentOptions {
  id: string;
  debug?: boolean;
  pageCategory?: string;
  settings?: InitOptions;
  disabled?: boolean;
  router?: VueRouter;
}

const install = (Vue: VueConstructor, options: SegmentOptions) => {
  const config: SegmentOptions = {
    debug: false,
    pageCategory: '',
    settings: undefined,
    disabled: false,
    ...options,
  };

  if (!config.disabled && (!config.id || config.id.length === 0)) {
    console.warn('Please enter a Segment Write Key');
    return;
  }

  if (
    Object.hasOwnProperty.call(Vue, '$segment')
    || Object.prototype.hasOwnProperty.call(Vue, '$segment')
  ) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.');
    }
    return;
  }

  const methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'pageView',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
    'addSourceMiddleware',
    'setAnonymousId',
    'addDestinationMiddleware',
    'screen',
    'register',
    'deregister',
    'user',
  ];

  const analytics = AnalyticsBrowser.load(
    {writeKey: config.id},
    config.settings,
  );

  if (options.debug) {
    methods.forEach((method) => {
      analytics[method] = (...args: unknown[]) => {
        console.debug(`Segment method ${method} called.`, args);
      };
    });
  }

  // Page tracking
  if (config.router !== undefined) {
    config.router.afterEach((to, from) => {
      if (!to.meta?.exclude) {
        // Make a page call for each navigation event
        analytics.page(config.pageCategory, to.name || '', {
          path: to.fullPath,
          referrer: from.fullPath,
        });
      }
    });
  }

  Object.defineProperty(Vue, '$segment', {
    get() {
      return analytics;
    },
  });
  Object.defineProperty(Vue.prototype, '$segment', {
    get() {
      return analytics;
    },
  });
};

export default {install};
