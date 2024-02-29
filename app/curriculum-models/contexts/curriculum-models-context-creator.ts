import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { createContext, Dispatch, useContext } from 'react';
import { produce } from 'immer';

export interface CurriculumModelsMap {
  [key: string]: WorkProjectSeriesSchemaDto;
}

export interface CurriculumModelDispatch {
  type: CurriculumModelAction;
  payload: WorkProjectSeriesSchemaDto;
}

export interface CurriculumModelBatchDispatch {
  type: CurriculumModelBatchAction;
  payload: WorkProjectSeriesSchemaDto[];
}

type CurriculumModelAction = 'update' | 'delete';
type CurriculumModelBatchAction = 'updateAll' | 'deleteAll';

export const CurriculumModelsContext = createContext<CurriculumModelsMap>(
  {} as CurriculumModelsMap
);

export const CurriculumModelsContextDispatch = createContext<
  Dispatch<CurriculumModelDispatch | CurriculumModelBatchDispatch>
>(() => {});

export function CurriculumModelsMapReducer(
  state: CurriculumModelsMap,
  action: CurriculumModelDispatch | CurriculumModelBatchDispatch
): CurriculumModelsMap {
  const { payload, type } = action;
  switch (type) {
    case 'update': {
      return produce(state, (draft) => {
        draft[payload.id] = payload;
      });
    }
    case 'delete': {
      return produce(state, (draft) => {
        delete draft[payload.id];
      });
    }
    case 'deleteAll': {
      return produce(state, (draft) => {
        payload.forEach((model) => {
          delete draft[model.id];
        });
      });
    }
    case 'updateAll': {
      return produce(state, (draft) => {
        payload.forEach((model) => {
          draft[model.id] = model;
        });
      });
    }
    default:
      throw new Error('Action not supported');
  }
}

export function useCurriculumModelContext() {
  const curriculumModelsMap = useContext(CurriculumModelsContext);
  const dispatch = useContext(CurriculumModelsContextDispatch);
  return { curriculumModelsMap, dispatch };
}
