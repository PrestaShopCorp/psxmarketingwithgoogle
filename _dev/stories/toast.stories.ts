import PsToast from '../src/components/commons/ps-toast.vue'

export default {
  title: 'Basic Components/Toast',
  component: PsToast,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PsToast },
  template: `
    <div>
      <b-toaster name="b-toaster-top-right" class="ps_gs-toaster-top-right"/>
      <ps-toast
        variant="success"
        :visible="visible"
        toaster="b-toaster-top-right"
      >
        <p>
          Success variant.
        </p>
      </ps-toast>
      <ps-toast
        variant="warning"
        :visible="visible"
        toaster="b-toaster-top-right"
      >
        <p>
          Warning variant.
        </p>
      </ps-toast>
      <ps-toast
        variant="danger"
        :visible="visible"
        toaster="b-toaster-top-right"
      >
        <p>
          Danger variant.
        </p>
      </ps-toast>
    </div>
  `,
});

export const Toast:any = Template.bind({});
Toast.args = {
  visible: true,
}
