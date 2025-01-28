import { HttpClientError } from "mktg-with-google-common";
import { runRetrievalOfVerificationTag } from "./verification-tag-retriever";
import * as Sentry from '@sentry/browser';

jest.mock('@sentry/browser');

describe('runRetrievalOfVerificationTag', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mock calls
  });

  it('runs the whole process', async () => {
    // prepare
    const fetchOnboardingMock = jest.fn();
    const fetchShopMock = jest.fn();
    fetchOnboardingMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({token: '<meta name="google-site-verification" content="...">'})
    } as Response);
    fetchShopMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({"success":true,"method":"insert"})
    } as Response);
    fetchOnboardingMock.mockResolvedValueOnce({
      status: 200,
      json: async () => ({"status":200,"message":"ok"})
    } as Response);

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
      {
        correlationId: expect.any(String),
        onResponse: expect.any(Function),
      },
    );

    expect(fetchOnboardingMock).toHaveBeenNthCalledWith(2,
      'POST',
      'shopping-websites/site-verification/verify',
      {
        correlationId: expect.any(String),
        onResponse: expect.any(Function),
      },
    );

    expect(fetchOnboardingMock).toHaveBeenNthCalledWith(3,
      'POST',
      'shopping-websites/site-verification/claim?overwrite=false',
      {
        correlationId: expect.any(String),
        onResponse: expect.any(Function),
      },
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

  it('handles 403 Forbidden error gracefully', async () => {
    // prepare
    const fetchOnboardingMock = jest.fn();
    const fetchShopMock = jest.fn();
    fetchOnboardingMock.mockImplementationOnce(() => {
      throw new HttpClientError("subscription not found", 403);
    });

    // act
    await runRetrievalOfVerificationTag(fetchOnboardingMock, fetchShopMock);

    // assert
    expect(fetchOnboardingMock).toBeCalledTimes(1);
    expect(fetchShopMock).toBeCalledTimes(0);
    expect(Sentry.captureException).not.toHaveBeenCalled(); // Ensure Sentry is not called
  });

  it('handles 404 Not Found error', async () => {
    // prepare
    const fetchOnboardingMock = jest.fn();
    const fetchShopMock = jest.fn();
    fetchOnboardingMock.mockImplementationOnce(() => {
      throw new HttpClientError("oh no", 404);
    });

    // act
    await runRetrievalOfVerificationTag(fetchOnboardingMock, fetchShopMock);

    // assert
    expect(fetchOnboardingMock).toBeCalledTimes(1);
    expect(fetchShopMock).toBeCalledTimes(0);
    expect(Sentry.captureException).not.toHaveBeenCalled(); // Ensure Sentry is not called
  });

  it('stops when token retrieval fails', async () => {
    // prepare
    const fetchOnboardingMock = jest.fn();
    const fetchShopMock = jest.fn();
    fetchOnboardingMock.mockImplementationOnce(() => {
      throw new HttpClientError("Token retrieval failed", 500);
    });

    // act
    await runRetrievalOfVerificationTag(fetchOnboardingMock, fetchShopMock);

    // assert
    expect(fetchOnboardingMock).toBeCalledTimes(1);
    expect(fetchShopMock).toBeCalledTimes(0);
    expect(Sentry.captureException).toHaveBeenCalled(); // Ensure Sentry is called
  });
});
