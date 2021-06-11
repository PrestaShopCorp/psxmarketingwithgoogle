import MutationsTypes from '../../src/store/modules/accounts/mutations-types';
import ActionsTypes from '../../src/store/modules/accounts/actions-types';

export default {
  [ActionsTypes.REQUEST_WEBSITE_CLAIMING_STATUS]({commit}) {
    setTimeout(() => {
      commit(MutationsTypes.SAVE_WEBSITE_VERIFICATION_AND_CLAIMING_STATUS, {isClaimed: true, isVerified: true});
    }, 2000);
  },
}
