export default {
  title: 'Basic Components/Buttons',
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { },
  template: `
    <div>
      <b-button variant="primary">Primary</b-button>
      <b-button variant="secondary">Secondary</b-button>
      <b-button variant="success">Success</b-button>
      <b-button variant="danger">Danger</b-button>
      <b-button variant="warning">Warning</b-button>
    </div>
  `,
});

export const Basics:any = Template.bind({});
Basics.args = {}

const TemplateOutline = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { },
  template: `
    <div>
      <b-button variant="outline-primary">Primary</b-button>
      <b-button variant="outline-secondary">Secondary</b-button>
      <b-button variant="outline-success">Success</b-button>
      <b-button variant="outline-danger">Danger</b-button>
      <b-button variant="outline-warning">Warning</b-button>
    </div>
  `,
});

export const Outline:any = TemplateOutline.bind({});
Outline.args = {}

const TemplateDisabled = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { },
  template: `
    <div>
      <b-button disabled variant="primary">Disabled</b-button>
      <b-button disabled variant="outline-primary">Disabled</b-button>
    </div>
  `,
});

export const Disabled:any = TemplateDisabled.bind({});
Disabled.args = {}

const TemplateBusy = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { },
  template: `
    <div>
      <b-button variant="primary">
        Connecting account...
        <span class="ml-1 icon-busy" />
      </b-button>
    </div>
  `,
});

export const Busy:any = TemplateBusy.bind({});
Busy.args = {}

const TemplateInvisible = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { },
  template: `
    <div>
      <b-button variant="text">
        Invisible
      </b-button>
      <b-button variant="text">
        <i class="ml-1 material-icons">close</i>
      </b-button>
    </div>
  `,
});

export const Invisible:any = TemplateInvisible.bind({});
Invisible.args = {}
