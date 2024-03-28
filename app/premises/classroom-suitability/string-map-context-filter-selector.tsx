'use client';
import {
  Context,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo
} from 'react';
import { StringMap } from '../../contexts/string-map-context/string-map-reducer';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import StringNameStringIdSearchParamsSelector from '../../generic/components/dropdown/string-name-string-id-search-params-selector';
import { NameIdStringTuple } from '../../api/dtos/NameIdStringTupleSchema';
import { isNotNull, isNotUndefined } from '../../api/main';
import TupleSelector from '../../generic/components/dropdown/tuple-selector';
import { useSelectiveContextControllerString } from '../../generic/components/selective-context/selective-context-manager-string';
import { useSearchParamsContext } from '../../contexts/string-map-context/search-params-context-creator';

export interface Comparator<T> {
  (element1: T, element2: T): number;
}

interface StringMapContextFilterProps<T> extends PropsWithChildren {
  context: Context<StringMap<T>>;
  idAccessor: AccessorFunction<T, string>;
  idSearchParamKey?: string;
  labelAccessor: AccessorFunction<T, string>;
  labelDescriptor: string;
  sortFunction?: Comparator<T>;
}

export function StringMapContextFilterSelector<T>({
  context,
  idAccessor,
  idSearchParamKey = 'id',
  labelAccessor,
  labelDescriptor,
  sortFunction
}: StringMapContextFilterProps<T>) {
  const stringMapTypeT = useContext(context);
  const selectionList: NameIdStringTuple[] = useMemo(() => {
    let values = Object.values(stringMapTypeT);
    if (isNotUndefined(sortFunction)) {
      values = values.sort(sortFunction);
    }
    return values.map((value) => ({
      id: idAccessor(value),
      name: labelAccessor(value)
    }));
  }, [idAccessor, labelAccessor, sortFunction, stringMapTypeT]);
  const { searchParamsMap, dispatchSearchParams } = useSearchParamsContext();
  const currentSelection = searchParamsMap[idSearchParamKey];
  console.log(selectionList, stringMapTypeT);
  const updateSelectedState = useCallback(
    (selection: NameIdStringTuple | null) => {
      if (isNotNull(selection)) {
        dispatchSearchParams({
          type: 'update',
          payload: { key: idSearchParamKey, data: selection }
        });
      } else {
        dispatchSearchParams({
          type: 'delete',
          payload: { key: idSearchParamKey }
        });
      }
    },
    [dispatchSearchParams, idSearchParamKey]
  );

  return (
    <TupleSelector
      selectedState={isNotUndefined(currentSelection) ? currentSelection : null}
      selectionList={selectionList}
      updateSelectedState={updateSelectedState}
      selectionDescriptor={labelDescriptor}
    />
  );
}
