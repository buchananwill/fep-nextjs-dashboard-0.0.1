import { createContext, Dispatch, useContext } from 'react';
import {
  MapDispatch,
  MapDispatchBatch,
  StringMap,
  StringMapDispatch
} from './curriculum-models-context-creator';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';

export function useCurriculumModelContext() {
  const curriculumModelsMap = useContext(CurriculumModelsContext);
  const dispatch = useContext(CurriculumModelsContextDispatch);
  return { curriculumModelsMap, dispatch };
}

export const CurriculumModelsContext = createContext<
  StringMap<WorkProjectSeriesSchemaDto>
>({} as StringMap<WorkProjectSeriesSchemaDto>);

export const CurriculumModelsContextDispatch = createContext<
  StringMapDispatch<WorkProjectSeriesSchemaDto>
>(() => {});
