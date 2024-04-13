'use client';

import { useSelectiveContextAnyController } from '../global/selective-context-manager-global';
import {
  useSyncSelectiveStateToProps,
  useSyncStringMapToProps
} from '../../../contexts/string-map-context/use-sync-string-map-to-props';
import { EmptyArray, isNotUndefined } from '../../../api/main';
import { getPayloadArray } from '../../../curriculum/delivery-models/use-editing-context-dependency';
import { ActionResponsePromise } from '../../../api/actions/actionResponse';
import { useSelectiveContextListenerReadAll } from '../base/generic-selective-context-creator';
import { SelectiveContextGlobal } from '../global/selective-context-creator-global';
import { getEntityNamespaceContextKey } from '../../hooks/dtoStores/use-dto-store';
import { UnsavedChangesModal } from '../../../generic/components/modals/unsaved-changes-modal';
import { useModal } from '../../../generic/components/modals/confirm-action-modal';

export interface DtoListControllerProps<T> {
  idList: (string | number)[];
  entityName: string;
  commitServerAction?: (entityList: T[]) => ActionResponsePromise<T[]>;
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
  idList,
  commitServerAction
}: DtoListControllerProps<any>) {
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

  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    SelectiveContextGlobal
  );

  const { openModal: handleOpen, ...modalProps } = useModal();

  console.log(changedDtos);

  async function handleCommit() {
    if (!isNotUndefined(commitServerAction)) {
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
    commitServerAction(updatedEntities);
    modalProps.onClose();
  }

  useSyncSelectiveStateToProps(
    idList,
    dispatchUpdate,
    currentState,
    getIdListContextKey(entityName)
  );
  return (
    <UnsavedChangesModal
      unsavedChanges={changedDtos.length > 0}
      handleOpen={handleOpen}
      {...modalProps}
      onConfirm={handleCommit}
      onCancel={modalProps.onClose}
    />
  );
}
