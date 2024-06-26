'use client';
import { PropsWithChildren } from 'react';
import GenericSelectiveContextManager from '../../selective-context/components/base/generic-selective-context-manager';
import { AssetSuitabilityListSelectiveContext } from './selective-context-creators';
import { getSelectiveContextControllerHook } from '../../selective-context/hooks/curriedHooks/get-selective-context-controller-hook';
import getSelectiveContextListenerHook from '../../selective-context/hooks/curriedHooks/get-selective-context-listener-hook';
import getSelectiveContextDispatchHook from '../../selective-context/hooks/curriedHooks/get-selective-context-dispatch-hook';

export default function AssetSuitabilityListSelectiveContextProvider({
  children
}: PropsWithChildren) {
  return (
    <GenericSelectiveContextManager {...AssetSuitabilityListSelectiveContext}>
      {children}
    </GenericSelectiveContextManager>
  );
}

export const useAssetSuitabilityListController =
  getSelectiveContextControllerHook(AssetSuitabilityListSelectiveContext);
export const useAssetSuitabilityListDispatch = getSelectiveContextDispatchHook(
  AssetSuitabilityListSelectiveContext
);
export const useAssetSuitabilityListListener = getSelectiveContextListenerHook(
  AssetSuitabilityListSelectiveContext
);
