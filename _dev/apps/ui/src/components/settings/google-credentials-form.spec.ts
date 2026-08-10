import {mount} from '@vue/test-utils';
import createFetchMock from 'vitest-fetch-mock';
import {initOnboardingClient} from 'mktg-with-google-common/api/onboardingClient';
import GoogleCredentialsForm from './google-credentials-form.vue';

const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

const redirectUri = 'https://thetinylux.com/module/tlgoogleshopping/oauth';

const selectFile = async (wrapper, contents: string) => {
  const file = new File([contents], 'google-oauth.json', {type: 'application/json'});
  const input = wrapper.find('input[type="file"]');
  Object.defineProperty(input.element, 'files', {
    configurable: true,
    value: [file],
  });
  await input.trigger('change');
  await new Promise((resolve) => { setTimeout(resolve, 25); });
  await wrapper.vm.$nextTick();
};

describe('google-credentials-form.vue', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    initOnboardingClient({apiUrl: 'https://admin.test/local-google-api'});
  });

  it('submits a web credential locally without rendering its secret', async () => {
    const secret = 'client-secret-value-never-rendered';
    fetchMock.mockResponse(JSON.stringify({
      configured: true,
      clientIdSuffix: '12345678',
      redirectUri,
    }));
    const wrapper = mount(GoogleCredentialsForm, {
      propsData: {connection: {configured: false, clientIdSuffix: '', redirectUri}},
      stubs: {BAlert: true},
    });

    await selectFile(wrapper, JSON.stringify({
      web: {
        client_id: 'client-id-12345678',
        client_secret: secret,
        redirect_uris: [redirectUri],
      },
    }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://admin.test/local-google-api',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          method: 'POST',
          path: 'settings/credentials',
          body: {
            web: {
              client_id: 'client-id-12345678',
              client_secret: secret,
              redirect_uris: [redirectUri],
            },
          },
        }),
      },
    );
    expect(wrapper.text()).not.toContain(secret);
    expect(wrapper.emitted('configured')?.[0]).toEqual([{
      configured: true,
      clientIdSuffix: '12345678',
      redirectUri,
    }]);
  });

  it('rejects an installed client file before making a request', async () => {
    const wrapper = mount(GoogleCredentialsForm, {
      propsData: {connection: {configured: false, clientIdSuffix: '', redirectUri}},
      stubs: {BAlert: true},
    });

    await selectFile(wrapper, JSON.stringify({
      installed: {
        client_id: 'client-id',
        client_secret: 'client-secret-value',
        redirect_uris: [redirectUri],
      },
    }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('Google OAuth web client');
    expect(wrapper.text()).not.toContain('client-secret-value');
  });

  it('renders only safe configured metadata', () => {
    const wrapper = mount(GoogleCredentialsForm, {
      propsData: {
        connection: {
          configured: true,
          clientIdSuffix: '12345678',
          redirectUri,
        },
      },
      stubs: {BAlert: true},
    });

    expect(wrapper.text()).toContain('12345678');
    expect(wrapper.text()).toContain(redirectUri);
    expect(wrapper.find('input[type="file"]').exists()).toBe(true);
  });
});
