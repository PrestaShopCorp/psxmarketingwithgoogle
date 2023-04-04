import { buildWarningMessages } from "./warning-messages-generator";

describe("Warning Messages Generator", () => {
  it("creates one warning message when onboarding is not started", () => {
    const messagesToDisplay = ["NOT_ONBOARDED"];

    const result = buildWarningMessages(messagesToDisplay, {
      isoCode: "en",
      link: "#",
    });

    expect(result.elements.length).toBe(1);
    expect(result.elements[0].textContent).toBe('');
  });
});
