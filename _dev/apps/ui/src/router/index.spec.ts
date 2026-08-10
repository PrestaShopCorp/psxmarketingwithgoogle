import store from '@/store';
import {accountNavigationGuard, initialPath} from '@/router';

describe('local Google route guards', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('allows module routes only when local Google credentials and connection are ready', () => {
    store.state.accounts.googleAccount.configured = true;
    store.state.accounts.googleAccount.connected = true;
    const next = vi.fn();

    accountNavigationGuard({}, {}, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('redirects module routes when the local Google connection is disconnected', () => {
    store.state.accounts.googleAccount.configured = true;
    store.state.accounts.googleAccount.connected = false;
    const next = vi.fn();

    accountNavigationGuard({}, {}, next);

    expect(next).toHaveBeenCalledWith({name: 'configuration'});
  });

  it('routes configured and connected stores to configuration after awaited warmup', async () => {
    store.state.accounts.googleAccount.configured = true;
    store.state.accounts.googleAccount.connected = true;
    vi.spyOn(store, 'dispatch').mockResolvedValue(undefined);
    const next = vi.fn();

    await initialPath({}, {}, next);

    expect(next).toHaveBeenCalledWith({name: 'configuration'});
  });

  it('routes an unconfigured local store to landing without warmup', async () => {
    store.state.accounts.googleAccount.configured = false;
    store.state.accounts.googleAccount.connected = false;
    const dispatch = vi.spyOn(store, 'dispatch').mockResolvedValue(undefined);
    const next = vi.fn();

    await initialPath({}, {}, next);

    expect(dispatch).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith({name: 'landing-page'});
  });
});
