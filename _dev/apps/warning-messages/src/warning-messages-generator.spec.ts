/**
 * @jest-environment jsdom
 */

import { buildWarningMessages } from "./warning-messages-generator";

describe("Warning Messages Generator", () => {
  it("creates one warning message when onboarding is not started", () => {
    const messagesToDisplay = ["NOT_ONBOARDED"];

    const result = buildWarningMessages(messagesToDisplay, {
      isoCode: "en",
      link: "#",
    });

    expect(result.elements.length).toBe(1);
    expect(result.elements[0].innerHTML).toBe(expectedOnboardingNotStartedMessage);
  });

  it("creates one warning message when onboarding is not completed", () => {
    const messagesToDisplay = ["ONBOARDING_INCOMPLETE"];

    const result = buildWarningMessages(messagesToDisplay, {
      isoCode: "en",
      link: "#",
    });

    expect(result.elements.length).toBe(1);
    expect(result.elements[0].innerHTML).toBe(expectedOnboardingIncompleteMessage);
  });

  it("can display several messages", () => {
    const messagesToDisplay = ["NOT_ONBOARDED", "ONBOARDING_INCOMPLETE"];

    const result = buildWarningMessages(messagesToDisplay, {
      isoCode: "en",
      link: "#",
    });

    expect(result.elements.length).toBe(2);
    expect(result.elements[0].innerHTML).toBe(expectedOnboardingNotStartedMessage);
    expect(result.elements[1].innerHTML).toBe(expectedOnboardingIncompleteMessage);
  });

  it.todo("displays the message translated");

  it('show the message in English when the translation is not provided', () => {
    const messagesToDisplay = ["ONBOARDING_INCOMPLETE"];

    const result = buildWarningMessages(messagesToDisplay, {
      isoCode: "jp",
      link: "#",
    });

    expect(result.elements.length).toBe(1);
    expect(result.elements[0].innerHTML).toBe(expectedOnboardingIncompleteMessage);
  });

  const expectedOnboardingNotStartedMessage = `
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <div class="alert-text">
                    <a href="#" target="_blank">PS Marketing with Google</a> is not configured. You are missing out on a lot of opportunities and visibility. It is highly recommended that you configure your synchronisation settings to maximise your benefits and enhance your online presence. Take action now to avoid missing out on valuable opportunities! <a href="#" target="_blank">Start the configuration</a>
                </div>
            </div>
`;
  const expectedOnboardingIncompleteMessage = `
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <div class="alert-text">
                    It appears that you have not finalised your configuration with <a href="#" target="_blank">PS Marketing with Google</a>. This may result in limited functionality and missed opportunities. To ensure that you are fully set up and able to take advantage of all available features, please complete the configuration process as soon as possible. <a href="#" target="_blank">Finalise the configuration</a>
                </div>
            </div>
`;
});
