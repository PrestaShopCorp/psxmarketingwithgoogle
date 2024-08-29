import store from '@/store';
import ActionsTypes from '@/store/modules/app/actions-types';

export default function useUpdateModule(
  moduleName: string,
  onSuccess?: () => void,
  onError?: (err) => void,
) {
  async function getLinkUpgrade() {
    const res = await store.dispatch(`app/${ActionsTypes.GET_MODULES_VERSIONS}`, moduleName);

    return res.upgradeLink;
  }

  async function updateModule() {
    try {
      const res = await store.dispatch(`app/${ActionsTypes.GET_MODULES_VERSIONS}`, moduleName);

      await fetch(res?.upgradeLink, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
      });

      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (err) {
      if (onError) {
        onError(err);
      }

      return false;
    }
  }

  return {updateModule, getLinkUpgrade};
}
