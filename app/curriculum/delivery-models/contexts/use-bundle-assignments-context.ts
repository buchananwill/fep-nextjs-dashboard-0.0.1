import { useContext } from 'react';
import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';
import { WorkSeriesBundleAssignmentDto } from '../../../api/dtos/WorkSeriesBundleAssignmentDtoSchema';

export const {
  dispatchContext: BundleAssignmentsContextDispatch,
  mapContext: BundleAssignmentsContext
} = createStringMapContext<WorkSeriesBundleAssignmentDto>();

export function useBundleAssignmentsContext() {
  const workSeriesSchemaBundleLeanDtoStringMap = useContext(
    BundleAssignmentsContext
  );
  const dispatch = useContext(BundleAssignmentsContextDispatch);
  return {
    bundleAssignmentsMap: workSeriesSchemaBundleLeanDtoStringMap,
    dispatch
  };
}
