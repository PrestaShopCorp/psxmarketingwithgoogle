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
    integrations: [],
    release: appVersion,
  });
}

export const initReplay = async (): Promise<void> => {
  if (!store.state.app.psxMktgWithGoogleOnProductionEnvironment) {
    return;
  }
  const {Replay} = await import('@sentry/vue');
  Sentry.addIntegration(new Replay({
    sessionSampleRate: 1.0,
    errorSampleRate: 1.0,
  }));
};

export default {
  initReplay,
};
