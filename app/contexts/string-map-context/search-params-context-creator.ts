import { createStringMapContext } from './context-creator';
import { NameIdStringTuple } from '../../api/dtos/NameIdStringTupleSchema';
import { useContext } from 'react';

export const {
  mapContext: SearchParamsContext,
  dispatchContext: SearchParamsDispatchContext
} = createStringMapContext<NameIdStringTuple>();

export function useSearchParamsContext() {
  const searchParamsMap = useContext(SearchParamsContext);
  const dispatchSearchParams = useContext(SearchParamsDispatchContext);
  return { searchParamsMap, dispatchSearchParams };
}
