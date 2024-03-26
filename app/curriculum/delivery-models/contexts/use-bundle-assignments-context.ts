import { useContext } from 'react';
import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';

export const {
  dispatchContext: BundleAssignmentsContextDispatch,
  mapContext: BundleAssignmentsContext
} = createStringMapContext<string>();

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
