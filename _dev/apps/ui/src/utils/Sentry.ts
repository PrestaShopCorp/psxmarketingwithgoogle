import Vue from 'vue';
import * as Sentry from '@sentry/vue';
import store from '@/store';

const appVersion = import.meta.env.VITE_BUILD_VERSION || 'dev';

// @ts-ignore
if (store.state.app.psxMktgWithGoogleOnProductionEnvironment) {
  Sentry.init({
    Vue,
    dsn: window.psxMktgWithGoogleDsnSentry,
    allowUrls: [
      'https://storage.googleapis.com/psxmarketing-cdn/',
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    logErrors: true,
    initialScope: {
      tags: {
        // @ts-ignore
        'prestashop-version': store.state.app.psVersion,
        // @ts-ignore
        'module-version': store.state.app.psxMktgWithGoogleModuleVersion,
        'app-version': appVersion,
      },
      user: {
        id: window.shopIdPsAccounts ? window.shopIdPsAccounts.toString() : 'unknown',
      },
    },
    integrations: [new Sentry.Replay()],
    release: appVersion,
  });
}
