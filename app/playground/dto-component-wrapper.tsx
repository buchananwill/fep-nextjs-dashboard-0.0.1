'use client';
import { useDtoStoreDispatch } from '../selective-context/hooks/dtoStores/use-dto-store';
import { HasId } from '../api/main';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export default function DtoComponentWrapper<T extends HasId>({
  entityName,
  id,
  uiComponent: UiComponent
}: {
  entityName: string;
  id: string | number;
  uiComponent?: (props: DtoComponentUiProps<T>) => ReactNode;
}) {
  const { currentState, dispatchWithoutControl } = useDtoStoreDispatch<T>(
    id,
    entityName,
    'someComponent'
  );

  return (
    <>
      {UiComponent && (
        <UiComponent
          entity={currentState}
          dispatchWithoutControl={dispatchWithoutControl}
        />
      )}
    </>
  );
}

export interface DtoComponentUiProps<T extends HasId> {
  entity: T;
  dispatchWithoutControl?: Dispatch<SetStateAction<T>>;
}
