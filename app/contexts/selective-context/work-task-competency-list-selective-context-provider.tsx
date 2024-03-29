'use client';
import { PropsWithChildren } from 'react';
import GenericSelectiveContextManager from '../../selective-context/components/base/generic-selective-context-manager';
import { WorkTaskCompetencyListSelectiveContext } from './selective-context-creators';
import { getSelectiveContextControllerHook } from '../../selective-context/hooks/curriedHooks/get-selective-context-controller-hook';
import getSelectiveContextListenerHook from '../../selective-context/hooks/curriedHooks/get-selective-context-listener-hook';
import getSelectiveContextDispatchHook from '../../selective-context/hooks/curriedHooks/get-selective-context-dispatch-hook';

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
