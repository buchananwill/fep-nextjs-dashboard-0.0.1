import { MapDispatch, MapDispatchBatch, StringMap } from './string-map-reducer';
import { Dispatch, MutableRefObject, useEffect } from 'react';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { getPayloadArray } from '../../curriculum/delivery-models/use-editing-context-dependency';

export function useSyncStringMapToProps<T>(
  initialEntityMap: StringMap<T>,
  initialMapRef: MutableRefObject<StringMap<T>>,
  dispatch: Dispatch<MapDispatch<T> | MapDispatchBatch<T>>,
  currentModels: StringMap<T>,
  mapKeyAccessor: AccessorFunction<T, string>
) {
  useEffect(() => {
    if (initialMapRef.current !== initialEntityMap) {
      const payloadArray = getPayloadArray(
        Object.values(currentModels),
        mapKeyAccessor
      );
      dispatch({ type: 'deleteAll', payload: payloadArray });
      const replacementMap = getPayloadArray(
        Object.values(initialEntityMap),
        mapKeyAccessor
      );
      dispatch({ type: 'updateAll', payload: replacementMap });
      initialMapRef.current = initialEntityMap;
    }
  }, [
    currentModels,
    initialEntityMap,
    mapKeyAccessor,
    initialMapRef,
    dispatch
  ]);
}