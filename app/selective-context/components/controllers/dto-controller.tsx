'use client';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import { useDtoStoreController } from '../../hooks/dtoStores/use-dto-store';
import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash';
import { useSelectiveContextAnyDispatch } from '../global/selective-context-manager-global';
import { getChangesContextKey } from './dto-id-list-controller';
import { EmptyArray } from '../../../api/main';

export interface DtoControllerProps<T extends HasNumberIdDto | HasUuidDto> {
  dto: T;
  entityName: string;
}

export default function DtoController<T extends HasNumberIdDto | HasUuidDto>({
  dto,
  entityName
}: DtoControllerProps<T>) {
  const { currentState } = useDtoStoreController(dto, entityName);
  const initialDtoRef = useRef<T>(dto);

  const { dispatchWithoutControl } = useSelectiveContextAnyDispatch<
    (string | number)[]
  >({
    contextKey: getChangesContextKey(entityName),
    listenerKey: `controller:${dto.id}`,
    initialValue: EmptyArray
  });

  useEffect(() => {
    const entityChanged = !isEqual(initialDtoRef.current, currentState);

    dispatchWithoutControl((state) => {
      const previouslyChanged = state.includes(dto.id);
      if (previouslyChanged && !entityChanged) {
        console.log('removing reverted entity');
        return state.filter((id) => id != dto.id);
      } else if (!previouslyChanged && entityChanged) {
        console.log('adding changed entity');

        return [...state, dto.id];
      } else return state;
    });
  }, [currentState, dispatchWithoutControl, dto.id]);

  return null;
}
