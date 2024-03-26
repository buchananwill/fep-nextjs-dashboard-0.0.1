import {
  MapDispatch,
  MapDispatchBatch,
  StringMapPayload
} from '../../contexts/string-map-context/string-map-reducer';
import { useEffect } from 'react';

export function getPayloadArray<T>(
  itemArray: T[],
  keyAccessor: (item: T) => string
): StringMapPayload<T>[] {
  return itemArray.map((item) => ({
    key: keyAccessor(item),
    data: item
  }));
}

export function useEditingContextDependency<T>(
  listOfDtos: T[],
  dispatch: (value: MapDispatch<T> | MapDispatchBatch<T>) => void,
  keyAccessor: (element: T) => string
) {
  useEffect(() => {
    const payloadArray = getPayloadArray(listOfDtos, keyAccessor);
    dispatch({
      type: 'updateAll',
      payload: payloadArray
    });
  }, [listOfDtos, dispatch, keyAccessor]);
}
