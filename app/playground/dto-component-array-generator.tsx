'use client';
import {
  useSelectiveContextAnyController,
  useSelectiveContextGlobalListener
} from '../selective-context/components/global/selective-context-manager-global';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { Badge } from '@nextui-org/badge';
import DtoComponentWrapper, {
  DtoComponentUiProps
} from './dto-component-wrapper';
import { getIdListContextKey } from '../selective-context/components/controllers/dto-id-list-controller';
import { EmptyArray, HasId } from '../api/main';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { RenameEntity } from './rename-entity';

export default function DtoComponentArrayGenerator<T extends HasId>({
  entityName,
  renderEachAs: WrappedComponent
}: {
  entityName: string;
  renderEachAs?: (props: DtoComponentUiProps<T>) => ReactNode;
}) {
  const contextKey = getIdListContextKey(entityName);
  const { currentState } = useSelectiveContextGlobalListener<number[]>({
    contextKey,
    listenerKey: 'someComponent',
    initialValue: EmptyArray
  });
  return currentState.map((id) => (
    <DtoComponentWrapper<T>
      entityName={'workTaskType'}
      id={id}
      key={`${entityName}:${id}`}
      uiComponent={WrappedComponent}
    />
  ));
}
