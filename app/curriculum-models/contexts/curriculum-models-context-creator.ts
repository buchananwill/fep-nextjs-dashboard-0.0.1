import { Dispatch, useReducer } from 'react';
import { Draft, produce } from 'immer';

export interface StringMapPayload<D> {
  key: string;
  data: D;
}

export interface StringMap<D> {
  [key: string]: D;
}

export interface MapDispatch<D> {
  type: MapActionSingle;
  payload: StringMapPayload<D>;
}

export interface MapDispatchBatch<D> {
  type: MapActionBatch;
  payload: StringMapPayload<D>[];
}

export type StringMapDispatch<D> = Dispatch<
  MapDispatch<D> | MapDispatchBatch<D>
>;

type MapActionSingle = 'update' | 'delete';
type MapActionBatch = 'updateAll' | 'deleteAll';

export function StringMapReducer<D>(
  state: StringMap<D>,
  action: MapDispatch<D> | MapDispatchBatch<D>
): StringMap<D> {
  const { payload, type } = action;
  switch (type) {
    case 'update': {
      return produce(state, (draft) => {
        const { key, data } = payload;
        draft[key] = data as Draft<D>;
      });
    }
    case 'delete': {
      return produce(state, (draft) => {
        const { key } = payload;
        delete draft[key];
      });
    }
    case 'updateAll': {
      return produce(state, (draft) => {
        payload.forEach((model) => {
          const { key, data } = model;
          draft[key] = data as Draft<D>;
        });
      });
    }
    case 'deleteAll': {
      return produce(state, (draft) => {
        payload.forEach((model) => {
          const { key, data } = model;
          delete draft[key];
        });
      });
    }
    default:
      throw new Error('Action not supported');
  }
}

export function useStringMapReducer<T>(initial: StringMap<T>) {
  const typedReducer = StringMapReducer<T>;
  return useReducer(typedReducer, initial);
}
