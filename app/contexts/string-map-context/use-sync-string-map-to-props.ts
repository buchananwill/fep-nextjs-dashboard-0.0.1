'use client';
import { MapDispatch, MapDispatchBatch, StringMap } from './string-map-reducer';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef
} from 'react';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { getPayloadArray } from '../../curriculum/delivery-models/use-editing-context-dependency';
import { isNotUndefined } from '../../api/main';
import { UpdateAction } from '../../selective-context/components/base/selective-context-manager';

export function useSyncStringMapToProps<T>(
  initialEntityMap: StringMap<T>,
  dispatch: Dispatch<MapDispatch<T> | MapDispatchBatch<T>>,
  currentModels: StringMap<T>,
  mapKeyAccessor: AccessorFunction<T, string>
) {
  const initialMapRef = useRef(initialEntityMap);

  useEffect(() => {
    if (
      initialMapRef.current !== initialEntityMap &&
      isNotUndefined(dispatch)
    ) {
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
export function useSyncSelectiveStateToProps<T>(
  propData: T,
  dispatch: Dispatch<UpdateAction<T>>,
  stateData: T,
  contextKey: string
) {
  const initialMapRef = useRef(propData);

  useEffect(() => {
    if (initialMapRef.current !== propData && isNotUndefined(dispatch)) {
      dispatch({ contextKey, update: propData });
      initialMapRef.current = propData;
    }
  }, [stateData, propData, contextKey, initialMapRef, dispatch]);
}
