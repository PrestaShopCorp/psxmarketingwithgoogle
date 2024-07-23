import {EVENT_HOOK_TYPE} from '@prestashopcorp/billing-cdc/dist/constants/EventHookType';
import billing from '@prestashopcorp/billing-cdc';
import {State as AppState} from '@/store/modules/app/state';

const defaultPlanId = 'psxmarketingwithgoogle-standard-EUR-Monthly';

// Implementation of a custom initialization method so we can get a better control (ie on Modal)
export const initialize = (psBilling: typeof billing,
  billingContext: {
    [key: string]: unknown;
  },
  domComponentSelector: string,
  domModalSelector: string,
  onEventHook: (type: EVENT_HOOK_TYPE, data: unknown) => void,
  hideInvoiceList: boolean = true,
) => {
  let currentModal;

  const customer = new psBilling.CustomerComponent({
    context: billingContext,
    hideInvoiceList,
    onOpenModal,
    onEventHook,
  });
  customer.render(domComponentSelector);

  // Modal open / close management
  async function onCloseModal(data) {
    await Promise.all([currentModal.close(), updateCustomerProps(data)]);
  }

  function onOpenModal(type, data) {
    currentModal = new psBilling.ModalContainerComponent({
      type,
      context: {
        ...billingContext,
        ...{offerSelection: {offerPricingId: defaultPlanId}},
        ...data,
      },
      onCloseModal,
      onEventHook,
    });
    currentModal.render(domModalSelector);
  }

  function updateCustomerProps(data) {
    return customer.updateProps({
      context: {
        ...billingContext,
        ...data,
      },
    });
  }

  // Open the checkout full screen modal
  function openCheckout(modalType = psBilling.MODAL_TYPE.SUBSCRIPTION_FUNNEL) {
    onOpenModal(
      modalType,
      {},
    );
  }

  return {
    openCheckout,
  };
};

export const billingUpdateCallback = (
  psBilling: typeof billing,
  state: AppState,
) => (type: EVENT_HOOK_TYPE, data: any) => {
  switch (type) {
    case psBilling.EVENT_HOOK_TYPE.SUBSCRIPTION_CREATED:
    case psBilling.EVENT_HOOK_TYPE.SUBSCRIPTION_UPDATED:
    case psBilling.EVENT_HOOK_TYPE.SUBSCRIPTION_CANCELLED:
    case psBilling.EVENT_HOOK_TYPE.SUBSCRIPTION_REACTIVATED:
      if (data?.subscription) {
        state.billing.subscription = data.subscription;
      }
      break;
    default:
      break;
  }
};

export default {
  billingUpdateCallback,
};
