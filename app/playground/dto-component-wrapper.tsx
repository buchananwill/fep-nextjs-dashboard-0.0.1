'use client';
import { Card } from '@tremor/react';
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
  children?: (
    entity: T,
    dispatchWithoutControl?: Dispatch<SetStateAction<T>>
  ) => ReactNode;
}) {
  const { currentState, dispatchWithoutControl } = useDtoStoreDispatch<T>(
    id,
    entityName,
    'someComponent'
  );

  return (
    <Card>{children && children(currentState, dispatchWithoutControl)}</Card>
  );
}

export interface DtoComponentWrapperRenderProps<T extends HasId> {
  entity: T;
  dispatchWithoutControl?: Dispatch<SetStateAction<T>>;
}
