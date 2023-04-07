/**
 * @jest-environment jsdom
 */

import { WarningElement } from "./WarningElement";

describe("Warning Message", () => {
  it("can display a simple message", () => {
    const result = new WarningElement({
      message: 'Hello there!',
    }).build();

    expect(result.innerHTML).toBe(`
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <div class="alert-text">
                    Hello there! 
                </div>
            </div>
`);
  });

  it("can display a simple message with a link", () => {
    const result = new WarningElement({
      message: 'Hello there!',
      cta: {
        buttonContent: '👉🤯👈',
        link: '#',
      },
    }).build();

    expect(result.innerHTML).toBe(`
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <div class="alert-text">
                    Hello there! <a href="#" target="_blank">👉🤯👈</a>
                </div>
            </div>
`);
  });

  it("calls a provided listener when the alert is closed", () => {
    const result = new WarningElement({
      message: 'Hello there!',
      onClose: () => {
        // This method must be called
        expect(true).toBe(true);
      },
    }).build();

    expect.assertions(1);
    result.getElementsByClassName('close').item(0).dispatchEvent(new Event('click'));
  });

  it('can customize the alert ID', () => {
    const result = new WarningElement({
      message: 'Hello there!',
      id: 'warning-message-one'
    }).build();

    expect(result.outerHTML).toBe(`<div id="warning-message-one">
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <div class="alert-text">
                    Hello there! 
                </div>
            </div>
</div>`);
  });
});
