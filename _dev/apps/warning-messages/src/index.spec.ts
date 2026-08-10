/**
 * @jest-environment jsdom
 */

import {fetchOnboarding} from 'mktg-with-google-common/api/onboardingClient';
import {buildWarningMessages} from './warning-messages-generator';
import {loadWarningMessages} from './index';

jest.mock('mktg-with-google-common/api/onboardingClient', () => ({
  fetchOnboarding: jest.fn().mockResolvedValue({
    json: async () => [],
  }),
  initOnboardingClient: jest.fn(),
}));

jest.mock('./warning-messages-generator', () => ({
  buildWarningMessages: jest.fn(() => ({
    attachBefore: jest.fn(),
  })),
}));

describe('warning message bootstrap', () => {
  const mockedFetchOnboarding = fetchOnboarding as jest.MockedFunction<typeof fetchOnboarding>;
  const mockedBuildWarningMessages = buildWarningMessages as jest.MockedFunction<typeof buildWarningMessages>;

  beforeEach(() => {
    jest.clearAllMocks();
    window.psxMktgWithGoogleAdminUrl = '/admin';
    window.i18nSettings = {
      isoCode: 'en',
      languageLocale: 'en-GB',
    };
  });

  it('returns safely without rendering when the warning request fails', async () => {
    mockedFetchOnboarding.mockRejectedValueOnce(new Error('request failed'));

    await expect(loadWarningMessages()).resolves.toBeUndefined();

    expect(mockedBuildWarningMessages).not.toHaveBeenCalled();
  });
});
