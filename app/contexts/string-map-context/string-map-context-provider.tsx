'use client';
import {
  StringMap,
  StringMapDispatch,
  StringMapReducer
} from './string-map-reducer';
import React, { Context, PropsWithChildren, useReducer, useRef } from 'react';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { useSyncStringMapToProps } from './use-sync-string-map-to-props';

export interface StringMapContextProviderProps<T> {
  initialEntityMap: StringMap<T>;
  mapContext: Context<StringMap<T>>;
  dispatchContext: Context<StringMapDispatch<T>>;
  mapKeyAccessor: AccessorFunction<T, string>;
}

export function StringMapContextProvider<T>({
  initialEntityMap,
  dispatchContext,
  mapContext,
  children,
  mapKeyAccessor
}: StringMapContextProviderProps<T> & PropsWithChildren) {
  const DispatchProvider = dispatchContext.Provider;
  const MapProvider = mapContext.Provider;
  const EntityReducer = StringMapReducer<T>;
  const [currentModels, dispatch] = useReducer(EntityReducer, initialEntityMap);

  useSyncStringMapToProps(
    initialEntityMap,
    dispatch,
    currentModels,
    mapKeyAccessor
  );

  return (
    <MapProvider value={currentModels}>
      <DispatchProvider value={dispatch}>{children}</DispatchProvider>
    </MapProvider>
  );
}
