'use client';
import { PropsWithChildren } from 'react';
import GenericSelectiveContextManager from '../../../generic/components/selective-context/generic-selective-context-manager';
import {
  AssetSuitabilityListSelectiveContext,
  WorkTaskCompetencyListSelectiveContext
} from './selective-context-creators';
import { getSelectiveContextControllerHook } from '../../../generic/hooks/selective-context/get-selective-context-controller-hook';
import getSelectiveContextListenerHook from '../../../generic/hooks/selective-context/get-selective-context-listener-hook';
import getSelectiveContextDispatchHook from '../../../generic/hooks/selective-context/get-selective-context-dispatch-hook';

export default function WorkTaskCompetencyListSelectiveContextProvider({
  children
}: PropsWithChildren) {
  return (
    <GenericSelectiveContextManager {...WorkTaskCompetencyListSelectiveContext}>
      {children}
    </GenericSelectiveContextManager>
  );
}

export const useWorkTaskCompetencyListController =
  getSelectiveContextControllerHook(WorkTaskCompetencyListSelectiveContext);
export const useWorkTaskCompetencyListDispatch =
  getSelectiveContextDispatchHook(WorkTaskCompetencyListSelectiveContext);
export const useWorkTaskCompetencyListListener =
  getSelectiveContextListenerHook(WorkTaskCompetencyListSelectiveContext);
