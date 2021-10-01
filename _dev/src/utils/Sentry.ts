import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import store from '@/store';

console.log(process.env);

Sentry.init({
  Vue,
  // @ts-ignore
  dsn: global.psxMktgWithGoogleDsnSentry,
  tracesSampleRate: 1.0,
  logErrors: true,
  initialScope: {
    tags: {
      // @ts-ignore
      'prestashop-version': store.state.app.psVersion,
      // @ts-ignore
      'module-version': store.state.app.psxMktgWithGoogleModuleVersion,
    },
    user: {
      id: window.shopIdPsAccounts ? window.shopIdPsAccounts.toString() : 'unknown',
    },
  },
});
