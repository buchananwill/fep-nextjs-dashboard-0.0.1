import { useContext } from 'react';
import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';

export function useCurriculumModelContext() {
  const curriculumModelsMap = useContext(CurriculumModelsContext);
  const dispatch = useContext(CurriculumModelsContextDispatch);
  return { curriculumModelsMap, dispatch };
}

export const {
  mapContext: CurriculumModelsContext,
  dispatchContext: CurriculumModelsContextDispatch
} = createStringMapContext<WorkProjectSeriesSchemaDto>();
