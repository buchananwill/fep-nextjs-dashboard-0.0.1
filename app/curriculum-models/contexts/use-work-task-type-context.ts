import { createContext, Dispatch, useContext } from 'react';
import {
  MapDispatch,
  MapDispatchBatch,
  StringMap,
  StringMapDispatch
} from './string-map-context-creator';
import { WorkProjectSeriesSchemaDto } from '../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';

export function useWorkTaskTypeContext() {
  const workTaskTypeMap = useContext(WorkTaskTypeContext);
  const dispatch = useContext(WorkTaskTypeContextDispatch);
  return { workTaskTypeMap, dispatch };
}

export const WorkTaskTypeContext = createContext<StringMap<WorkTaskTypeDto>>(
  {} as StringMap<WorkTaskTypeDto>
);

export const WorkTaskTypeContextDispatch = createContext<
  StringMapDispatch<WorkTaskTypeDto>
>(() => {});
