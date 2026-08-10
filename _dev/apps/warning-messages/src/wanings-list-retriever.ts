import {
  fetchOnboarding as fetchOnboardingType,
  HttpClientError,
} from "mktg-with-google-common";

const correlationId = `${Math.floor(Date.now() / 1000)}`;

export const getListOfWarnings = async (
  fetchOnboarding: typeof fetchOnboardingType,
): Promise<string[]> => {
  type shopWarningDto = {
    shopId: string;
    warningName: string;
    lastDisplayedAt: string;
    lastAcknowledgedAt: Date;
    displayedCount: number;
  };
  const list: shopWarningDto[] = await (await fetchOnboarding(
    "GET",
    "shop-warnings",
    {
      correlationId,
      onResponse: responseHandler,
    },
  )).json();

  return list.map((e) => e.warningName);
};

export const aknowledgeWarning = async (
  message: string,
  fetchOnboarding: typeof fetchOnboardingType,
): Promise<void> => {
  await fetchOnboarding(
    "POST",
    `shop-warnings/${message}/ack`,
    {
      correlationId,
      onResponse: responseHandler,
    },
  );
};

const responseHandler = async (response: Response) => {
  if (!response.ok) {
    const error = new HttpClientError(response.statusText, response.status);

    try {
      await response.text();
    } catch {
      // Do nothing
    }

    throw error;
  }
  return response;
};
