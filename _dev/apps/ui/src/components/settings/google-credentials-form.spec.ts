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

  it('allows only the latest accepted deferred read to submit or update state', async () => {
    const nativeFileReader = globalThis.FileReader;
    const readers: DeferredFileReader[] = [];
    class DeferredFileReader {
      result: string|null = null;

      onload: null|(() => unknown) = null;

      onerror: null|(() => unknown) = null;

      constructor() {
        readers.push(this);
      }

      readAsText() {
        // Completion is controlled by the test so reads can finish out of order.
        this.result = null;
      }

      async complete(contents: string) {
        this.result = contents;
        await this.onload?.();
      }
    }
    vi.stubGlobal('FileReader', DeferredFileReader);
    fetchMock.mockResponse(JSON.stringify({
      configured: true,
      clientIdSuffix: 'LATEST78',
      redirectUri,
    }));
    const wrapper = mount(GoogleCredentialsForm, {
      propsData: {connection: {configured: false, clientIdSuffix: '', redirectUri}},
      stubs: {BAlert: true},
    });
    const firstFile = new File(['first'], 'first.json', {type: 'application/json'});
    const latestFile = new File(['latest'], 'latest.json', {type: 'application/json'});

    try {
      wrapper.vm.importCredentials({target: {files: [firstFile]}} as unknown as Event);
      expect(wrapper.vm.loading).toBe(true);
      wrapper.vm.importCredentials({target: {files: [latestFile]}} as unknown as Event);
      expect(wrapper.vm.loading).toBe(true);
      expect(readers).toHaveLength(2);

      await readers[1].complete(JSON.stringify({
        web: {
          client_id: 'latest-client-id-LATEST78',
          client_secret: 'latest-secret-never-rendered',
          redirect_uris: [redirectUri],
        },
      }));
      await wrapper.vm.$nextTick();
      await readers[0].complete('{"stale-secret":"must-be-inert"');
      await wrapper.vm.$nextTick();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(String(fetchMock.mock.calls[0][1]?.body)).toContain('latest-client-id-LATEST78');
      expect(String(fetchMock.mock.calls[0][1]?.body)).not.toContain('stale-secret');
      expect(wrapper.emitted('configured')).toEqual([[{
        configured: true,
        clientIdSuffix: 'LATEST78',
        redirectUri,
      }]]);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe('');
      expect(wrapper.text()).not.toContain('latest-secret-never-rendered');
      expect(wrapper.text()).not.toContain('stale-secret');
    } finally {
      vi.stubGlobal('FileReader', nativeFileReader);
    }
  });
});
