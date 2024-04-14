import {
  useSelectiveContextAnyController,
  useSelectiveContextGlobalListener
} from '../../../selective-context/components/global/selective-context-manager-global';
import {
  getIdListContextKey,
  getNameSpacedKey
} from '../../../selective-context/components/controllers/dto-id-list-controller';
import { useSelectiveContextListenerReadAll } from '../../../selective-context/components/base/generic-selective-context-creator';
import { SelectiveContextGlobal } from '../../../selective-context/components/global/selective-context-creator-global';
import { useMemo } from 'react';
import { getEntityNamespaceContextKey } from '../../../selective-context/hooks/dtoStores/use-dto-store';
import { EmptyArray, isNotUndefined } from '../../../api/main';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { KnowledgeDomainDto } from '../../../api/dtos/KnowledgeDomainDtoSchema';

export function useStringMapContextController<T, U extends string | number>(
  entityName: string,
  listenerKey: string
) {
  const { currentState: idList } = useSelectiveContextGlobalListener<U[]>({
    contextKey: getIdListContextKey(entityName),
    listenerKey: listenerKey,
    initialValue: EmptyArray
  });

  const selectiveContextReadAll = useSelectiveContextListenerReadAll(
    SelectiveContextGlobal
  );

  const stringMap = useMemo(() => {
    return idList
      .map((id) =>
        selectiveContextReadAll(getEntityNamespaceContextKey(entityName, id))
      )
      .filter(isNotUndefined)
      .reduce((prev, curr) => {
        const next = { ...prev };
        next[curr.id] = curr;
        return next;
      }, {});
  }, [idList, selectiveContextReadAll, entityName]);

  const nameSpacedKey = getNameSpacedKey(entityName, 'stringMap');
  console.log(nameSpacedKey, stringMap);
  return useSelectiveContextAnyController<StringMap<T>>({
    contextKey: nameSpacedKey,
    listenerKey: listenerKey,
    initialValue: stringMap
  });
}
