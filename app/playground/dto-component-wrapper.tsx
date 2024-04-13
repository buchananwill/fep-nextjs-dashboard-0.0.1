'use client';
import { useDtoStoreDispatch } from '../selective-context/hooks/dtoStores/use-dto-store';
import { HasId } from '../api/main';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export default function DtoComponentWrapper<T extends HasId>({
  entityName,
  id,
  children
}: {
  entityName: string;
  id: string | number;
  children?: (props: DtoComponentUiProps<T>) => ReactNode;
}) {
  const { currentState, dispatchWithoutControl } = useDtoStoreDispatch<T>(
    id,
    entityName,
    'someComponent'
  );

  return (
    <>
      {children && children({ entity: currentState, dispatchWithoutControl })}
    </>
  );
}

export interface DtoComponentUiProps<T extends HasId> {
  entity: T;
  dispatchWithoutControl?: Dispatch<SetStateAction<T>>;
}
