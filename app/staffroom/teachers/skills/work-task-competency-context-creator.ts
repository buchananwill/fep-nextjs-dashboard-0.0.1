'use client';

import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';
import { useContext } from 'react';
import { WorkTaskCompetencyDto } from '../../../api/dtos/WorkTaskCompetencyDtoSchema';

export const {
  mapContext: WorkTaskCompetencyListContext,
  dispatchContext: WorkTaskCompetencyListDispatchContext
} = createStringMapContext<WorkTaskCompetencyDto[]>();

export function useWorkTaskCompetencyListStringMapContext() {
  const workTaskCompetencyListStringMap = useContext(
    WorkTaskCompetencyListContext
  );
  const workTaskCompetencyListStringMapDispatch = useContext(
    WorkTaskCompetencyListDispatchContext
  );

  return {
    workTaskCompetencyListStringMap,
    workTaskCompetencyListStringMapDispatch
  };
}
