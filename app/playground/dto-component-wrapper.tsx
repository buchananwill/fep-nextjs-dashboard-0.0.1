'use client';
import { useDtoStoreDispatch } from '../selective-context/hooks/dtoStores/use-dto-store';
import { EmptyArray, HasId } from '../api/main';
import { Dispatch, FC, ReactNode, SetStateAction, useMemo } from 'react';
import { useSelectiveContextAnyDispatch } from '../selective-context/components/global/selective-context-manager-global';
import { getDeletedContextKey } from '../selective-context/components/controllers/dto-id-list-controller';

export type DtoUiComponent<T extends HasId> = FC<DtoComponentUiProps<T>>;

export default function DtoComponentWrapper<T extends HasId>({
  entityClass,
  id,
  uiComponent: UiComponent
}: {
  entityClass: string;
  id: string | number;
  uiComponent?: DtoUiComponent<T>;
}) {
  const { currentState, dispatchWithoutControl } = useDtoStoreDispatch<T>(
    id,
    entityClass,
    UiComponent?.name || 'component'
  );

  const {
    currentState: deletedEntities,
    dispatchWithoutControl: dispatchDeletion
  } = useSelectiveContextAnyDispatch<(string | number)[]>({
    contextKey: getDeletedContextKey(entityClass),
    initialValue: EmptyArray,
    listenerKey: `${id}:uiWrapper`
  });

  const deleted = useMemo(() => {
    return deletedEntities.includes(id);
  }, [deletedEntities, id]);

  return (
    <>
      {UiComponent && (
        <UiComponent
          entity={currentState}
          entityClass={entityClass}
          dispatchWithoutControl={dispatchWithoutControl}
          deleted={deleted}
          dispatchDeletion={dispatchDeletion}
        />
      )}
    </>
  );
}

export interface DtoComponentUiProps<T extends HasId> {
  entity: T;
  entityClass: string;
  dispatchWithoutControl?: Dispatch<SetStateAction<T>>;
  deleted: boolean;
  dispatchDeletion?: Dispatch<SetStateAction<(string | number)[]>>;
}
