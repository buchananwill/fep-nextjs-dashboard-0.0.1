'use client';
import {
  MapDispatch,
  MapDispatchBatch,
  StringMap,
  StringMapDispatch,
  StringMapReducer
} from './string-map-reducer';
import React, {
  Context,
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useReducer,
  useRef
} from 'react';
import { useSelectiveContextControllerBoolean } from '../../generic/components/selective-context/selective-context-manager-boolean';

import { getPayloadArray } from '../../curriculum/delivery-models/use-editing-context-dependency';
import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { AccessorFunction } from '../../generic/components/tables/rating/rating-table';
import { useSelectiveContextControllerStringList } from '../../generic/components/selective-context/selective-context-manager-string-list';
import { EmptyIdArray } from '../../curriculum/delivery-models/contexts/curriculum-models-context-provider';

import { isNotUndefined } from '../../api/main';
import { useModal } from '../../generic/components/modals/confirm-action-modal';
import { UnsavedChangesModal } from '../../generic/components/modals/unsaved-changes-modal';
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
  const initialMapRef = useRef(initialEntityMap);

  useSyncStringMapToProps(
    initialEntityMap,
    initialMapRef,
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
