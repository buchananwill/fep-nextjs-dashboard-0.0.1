'use client';

import { useSelectiveContextAnyController } from '../global/selective-context-manager-global';
import {
  useSyncSelectiveStateToProps,
  useSyncStringMapToProps
} from '../../../contexts/string-map-context/use-sync-string-map-to-props';
import { EmptyArray } from '../../../api/main';

export interface DtoListControllerProps {
  idList: (string | number)[];
  entityName: string;
}

export function getIdListContextKey(entityName: string) {
  return `${entityName}:idList`;
}

const listenerKey = 'listController';

export function getChangesContextKey(entityName: string) {
  return `${entityName}:changes`;
}

export default function DtoIdListController({
  entityName,
  idList
}: DtoListControllerProps) {
  const { currentState, dispatchUpdate } = useSelectiveContextAnyController({
    contextKey: getIdListContextKey(entityName),
    listenerKey: listenerKey,
    initialValue: idList
  });

  const { currentState: changedDtos } = useSelectiveContextAnyController<
    (string | number)[]
  >({
    contextKey: getChangesContextKey(entityName),
    listenerKey: `${entityName}:listenerKey`,
    initialValue: EmptyArray
  });

  console.log(changedDtos);

  useSyncSelectiveStateToProps(
    idList,
    dispatchUpdate,
    currentState,
    getIdListContextKey(entityName)
  );
  return null;
}
