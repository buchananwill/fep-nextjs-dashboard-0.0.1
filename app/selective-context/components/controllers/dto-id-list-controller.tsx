'use client';

import { useSelectiveContextAnyController } from '../global/selective-context-manager-global';
import {
  useSyncSelectiveStateToProps,
  useSyncStringMapToProps
} from '../../../contexts/string-map-context/use-sync-string-map-to-props';

export interface DtoListControllerProps {
  idList: (string | number)[];
  entityName: string;
}

export function composeIdListContextKey(entityName: string) {
  return `${entityName}:idList`;
}

export default function DtoIdListController({
  entityName,
  idList
}: DtoListControllerProps) {
  const { currentState, dispatchUpdate } = useSelectiveContextAnyController({
    contextKey: composeIdListContextKey(entityName),
    listenerKey: 'listController',
    initialValue: idList
  });
  useSyncSelectiveStateToProps(
    idList,
    dispatchUpdate,
    currentState,
    composeIdListContextKey(entityName)
  );
  return null;
}
