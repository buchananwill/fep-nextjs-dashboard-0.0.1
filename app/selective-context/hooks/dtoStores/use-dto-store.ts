import {
  useSelectiveContextAnyController,
  useSelectiveContextAnyDispatch,
  useSelectiveContextGlobalListener
} from '../../components/global/selective-context-manager-global';
import { HasUuidDto } from '../../../api/dtos/HasUuidDtoSchema';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { ObjectPlaceholder } from '../../components/typed/selective-context-manager-function';

export function useDtoStoreController<T extends HasUuidDto | HasNumberIdDto>(
  dto: T,
  entityType: string
) {
  return useSelectiveContextAnyController<T>({
    contextKey: `${entityType}:${dto.id}`,
    initialValue: dto,
    listenerKey: 'controller'
  });
}
export function useDtoStoreDispatch<T extends HasUuidDto | HasNumberIdDto>(
  id: number | string,
  entityType: string,
  listenerKey: string
) {
  return useSelectiveContextAnyDispatch<T>({
    contextKey: `${entityType}:${id}`,
    initialValue: ObjectPlaceholder as T,
    listenerKey: listenerKey
  });
}
export function useDtoStoreListener<T extends HasUuidDto | HasNumberIdDto>(
  id: number | string,
  entityType: string,
  listenerKey: string
) {
  return useSelectiveContextGlobalListener<T>({
    contextKey: `${entityType}:${id}`,
    initialValue: ObjectPlaceholder as T,
    listenerKey: listenerKey
  });
}
