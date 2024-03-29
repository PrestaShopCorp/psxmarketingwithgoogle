export type WarningElementOptions = {
    message: string;
    cta?: {
        link: string;
        buttonContent: string;
    };
    id?: string;
    onClose?: (this: Element, ev: MouseEvent) => any, options?: boolean | EventListenerOptions;
}

export class WarningElement {
    options: WarningElementOptions;
    warning: Element;

    public constructor(options: WarningElementOptions) {
        this.options = {
            ...options,
            id: options.id || Math.random().toString(36).slice(2, 12),
        };
    }

    build(): Element {
        const ctaContent = this.options.cta ? `<a href="${this.options.cta.link}" target="_blank">${this.options.cta.buttonContent}</a>` : '';

        this.warning = document.createElement('div');
        this.warning.setAttribute('id', this.options.id);
        const content = `
            <div class="alert alert-warning">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <div class="alert-text">
                    ${this.options.message} ${ctaContent}
                </div>
            </div>
`;
        this.warning.innerHTML = content;
        if (this.options.onClose) {
            this.warning.getElementsByClassName('close').item(0).addEventListener('click', this.options.onClose);
        }
        return this.warning;
    }
}