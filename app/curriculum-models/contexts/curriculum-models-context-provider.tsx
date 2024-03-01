'use client';

import {
  StringMap,
  StringMapReducer
} from './curriculum-models-context-creator';
import { PropsWithChildren, useReducer } from 'react';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import {
  CurriculumModelsContext,
  CurriculumModelsContextDispatch
} from './use-curriculum-model-context';

export function CurriculumModelsContextProvider({
  models,
  children
}: { models: StringMap<WorkProjectSeriesSchemaDto> } & PropsWithChildren) {
  const CurriculumModelsReducer = StringMapReducer<WorkProjectSeriesSchemaDto>;
  const [currentModels, dispatch] = useReducer(CurriculumModelsReducer, models);

  return (
    <CurriculumModelsContext.Provider value={currentModels}>
      <CurriculumModelsContextDispatch.Provider value={dispatch}>
        {children}
      </CurriculumModelsContextDispatch.Provider>
    </CurriculumModelsContext.Provider>
  );
}
