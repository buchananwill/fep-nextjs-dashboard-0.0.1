'use client';

import { useSelectiveContextAnyController } from '../global/selective-context-manager-global';
import { EmptyArray, HasId, isNotUndefined } from '../../../api/main';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { useSelectiveContextListenerReadAll } from '../base/generic-selective-context-creator';
import { SelectiveContextGlobal } from '../global/selective-context-creator-global';
import { getEntityNamespaceContextKey } from '../../hooks/dtoStores/use-dto-store';
import { UnsavedChangesModal } from '../../../generic/components/modals/unsaved-changes-modal';
import { useModal } from '../../../generic/components/modals/confirm-action-modal';
import { useMemo } from 'react';
import { useSyncSelectiveStateToProps } from '../../../contexts/string-map-context/use-sync-selective-state-to-props';

export default function DtoIdListController({
  entityName,
  dtoList,
  updateServerAction,
  deleteServerAction
}: DtoListControllerProps<any>) {
  const idListArray = useMemo(() => {
    return dtoList.map((dto) => dto.id);
  }, [dtoList]);

  const { currentState, dispatchUpdate } = useSelectiveContextAnyController({
    contextKey: getIdListContextKey(entityName),
    listenerKey: listenerKey,
    initialValue: idListArray
  });

  const { currentState: changedDtos } = useSelectiveContextAnyController<
    (string | number)[]
  >({
    contextKey: getChangesContextKey(entityName),
    listenerKey: `${entityName}:listenerKey`,
    initialValue: EmptyArray
  });

  const { currentState: deletedDtos } = useSelectiveContextAnyController<
    (string | number)[]
  >({
    contextKey: getDeletedContextKey(entityName),
    listenerKey: `${entityName}:listenerKey`,
    initialValue: EmptyArray
  });

  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    SelectiveContextGlobal
  );

  const { openModal: handleOpen, ...modalProps } = useModal();

  console.log(changedDtos);

  async function handleCommit() {
    if (!isNotUndefined(updateServerAction)) {
      console.error('No server action defined');
      modalProps.onClose();
      return;
    }
    const set = new Set<string | number>();

    changedDtos.forEach((key) => set.add(key));
    const keyArray: (string | number)[] = [];
    set.forEach((element) => keyArray.push(element));
    const updatedEntities = keyArray
      .map((id) =>
        selectiveContextReadAll(getEntityNamespaceContextKey(entityName, id))
      )
      .filter(isNotUndefined);
    // const entityList = Object.values(currentModels as StringMap<T>);
    console.log(updatedEntities);
    updateServerAction(updatedEntities);
    if (isNotUndefined(deleteServerAction)) deleteServerAction(deletedDtos);
    modalProps.onClose();
  }

  useSyncSelectiveStateToProps(
    idListArray,
    dispatchUpdate,
    currentState,
    getIdListContextKey(entityName)
  );
  return (
    <UnsavedChangesModal
      unsavedChanges={changedDtos.length > 0 || deletedDtos.length > 0}
      handleOpen={handleOpen}
      {...modalProps}
      onConfirm={handleCommit}
      onCancel={modalProps.onClose}
    />
  );
}

export interface DtoListControllerProps<T extends HasId> {
  dtoList: T[];
  entityName: string;
  updateServerAction?: (entityList: T[]) => ActionResponsePromise<T[]>;
  deleteServerAction?: (idList: any[]) => ActionResponsePromise<any[]>;
}

function getNameSpacedKey(entityName: string, keyType: string) {
  return `${entityName}:${keyType}`;
}

export function getIdListContextKey(entityName: string) {
  return getNameSpacedKey(entityName, 'idList');
}

const listenerKey = 'listController';

export function getChangesContextKey(entityName: string) {
  return getNameSpacedKey(entityName, 'changes');
}

export function getDeletedContextKey(entityName: string) {
  return getNameSpacedKey(entityName, 'deleted');
}
