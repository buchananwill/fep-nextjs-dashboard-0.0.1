'use client';
import {
  useSelectiveContextAnyController,
  useSelectiveContextGlobalListener
} from '../selective-context/components/global/selective-context-manager-global';
import { NameIdStringTuple } from '../api/dtos/NameIdStringTupleSchema';
import { Badge } from '@nextui-org/badge';
import DtoComponentWrapper from './dto-component-wrapper';
import { composeIdListContextKey } from '../selective-context/components/controllers/dto-id-list-controller';
import { EmptyArray, HasId } from '../api/main';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { ExampleRenderPropFunctionComponent } from './example-render-prop-function-component';

export default function DtoComponentArrayGenerator<T extends HasId>({
  entityName,
  children: WrappedComponent
}: {
  entityName: string;
  children?: (
    entity: T,
    dispatchWithoutControl?: Dispatch<SetStateAction<T>>
  ) => ReactNode;
}) {
  const contextKey = composeIdListContextKey(entityName);
  const { currentState } = useSelectiveContextGlobalListener<number[]>({
    contextKey,
    listenerKey: 'someComponent',
    initialValue: EmptyArray
  });
  return (
    <>
      {currentState.map((id) => (
        <DtoComponentWrapper<T>
          entityName={'workTaskType'}
          id={id}
          key={`${entityName}:${id}`}
        >
          {WrappedComponent}
        </DtoComponentWrapper>
      ))}
    </>
  );
}
