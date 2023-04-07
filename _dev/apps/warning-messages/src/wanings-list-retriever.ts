import * as Sentry from "@sentry/browser";
import {
  fetchOnboarding as fetchOnboardingType,
  HttpClientError,
} from "mktg-with-google-common";

const correlationId = `${Math.floor(Date.now() / 1000)}`;
const scope = new Sentry.Scope();

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
    `shop-warning/${message}/ack`,
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
      const content = await response.text();
      scope.setExtra("responseContent", content);
    } catch {
      // Do nothing
    }

    scope.setTransactionName(response.url);
    scope.setTag('correlationId', correlationId);
    Sentry.captureException(error, scope);
    throw error;
  }
  return response;
};
