'use client';

import {
  CurriculumModelsContext,
  CurriculumModelsContextDispatch,
  CurriculumModelsMap,
  CurriculumModelsMapReducer
} from './curriculum-models-context-creator';
import { PropsWithChildren, useReducer } from 'react';

export function CurriculumModelsContextProvider({
  models,
  children
}: { models: CurriculumModelsMap } & PropsWithChildren) {
  const [currentModels, dispatch] = useReducer(
    CurriculumModelsMapReducer,
    models
  );

  return (
    <CurriculumModelsContext.Provider value={currentModels}>
      <CurriculumModelsContextDispatch.Provider value={dispatch}>
        {children}
      </CurriculumModelsContextDispatch.Provider>
    </CurriculumModelsContext.Provider>
  );
}
