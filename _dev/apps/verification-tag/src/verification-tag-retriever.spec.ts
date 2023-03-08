import { fetchOnboarding, HttpClientError } from "mktg-with-google-common";
import { runRetrievalOfVerificationTag } from "./verification-tag-retriever";

describe('runRetrievalOfVerificationTag', () => {
  it('runs the whole process', async () => {
    // prepare
    const fetchOnboardingMock = jest.fn();
    const fetchShopMock = jest.fn();
    fetchOnboardingMock.mockResolvedValueOnce({token: '<meta name="google-site-verification" content="...">'});
    fetchShopMock.mockResolvedValueOnce({"success":true,"method":"insert"});
    fetchOnboardingMock.mockResolvedValueOnce({"status":200,"message":"ok"});

    // act
    await runRetrievalOfVerificationTag(
      fetchOnboardingMock,
      fetchShopMock,
    );

    // assert
    expect(fetchOnboardingMock).toBeCalledTimes(3);
    expect(fetchShopMock).toBeCalledTimes(1);

    expect(fetchOnboardingMock).toHaveBeenNthCalledWith(1,
      'GET',
      'shopping-websites/site-verification/token',
      expect.any(String),
      undefined,
      expect.any(Function),
    );

    expect(fetchOnboardingMock).toHaveBeenNthCalledWith(2,
      'POST',
      'shopping-websites/site-verification/verify',
      expect.any(String),
      undefined,
      expect.any(Function),
    );

    expect(fetchOnboardingMock).toHaveBeenNthCalledWith(3,
      'POST',
      'shopping-websites/site-verification/claim?overwrite=false',
      expect.any(String),
      undefined,
      expect.any(Function),
    );

    expect(fetchShopMock).toHaveBeenNthCalledWith(1,
      'setWebsiteVerificationMeta',
      {
        websiteVerificationMeta: '<meta name="google-site-verification" content="...">',
      }
    );
  });

  it('stops when an error occurs', async () => {
    // prepare
    const fetchOnboardingMock = jest.fn();
    const fetchShopMock = jest.fn();
    fetchOnboardingMock.mockImplementationOnce(() => {throw new HttpClientError('oh no', 404)});

    // act
    try {
      await runRetrievalOfVerificationTag(
        fetchOnboardingMock,
        fetchShopMock,
      );
    } catch {
      // Do nothing
    }

    // assert
    expect(fetchOnboardingMock).toBeCalledTimes(1);
    expect(fetchShopMock).toBeCalledTimes(0);
  });
});