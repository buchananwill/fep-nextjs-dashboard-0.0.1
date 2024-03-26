import { useContext } from 'react';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';

export function useWorkTaskTypeContext() {
  const workTaskTypeMap = useContext(WorkTaskTypeContext);
  const dispatch = useContext(WorkTaskTypeContextDispatch);
  return { workTaskTypeMap, dispatch };
}

export const {
  dispatchContext: WorkTaskTypeContextDispatch,
  mapContext: WorkTaskTypeContext
} = createStringMapContext<WorkTaskTypeDto>();
