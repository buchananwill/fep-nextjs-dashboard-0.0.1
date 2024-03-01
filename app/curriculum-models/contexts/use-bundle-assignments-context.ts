import { createContext, useContext } from 'react';
import {
  StringMap,
  StringMapDispatch
} from './curriculum-models-context-creator';
import { WorkSeriesSchemaBundleLeanDto } from '../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';

export const BundleAssignmentsContext = createContext<StringMap<string>>({});
export const BundleAssignmentsContextDispatch = createContext<
  StringMapDispatch<string>
>(() => {});

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

export function useSingleBundleAssignment(assignmentKey: string) {
  const { dispatch, bundleAssignmentsMap } = useBundleAssignmentsContext();
  const bundleAssignmentsMapElement = bundleAssignmentsMap[assignmentKey];

  const postAssignment = (newAssignment: string) => {
    dispatch({
      type: 'update',
      payload: { key: assignmentKey, data: newAssignment }
    });
  };

  const deleteAssignment = () => {
    dispatch({
      type: 'delete',
      payload: { key: assignmentKey, data: bundleAssignmentsMapElement }
    });
  };

  const assignmentOptional = bundleAssignmentsMapElement as string | undefined;

  return { assignmentOptional, postAssignment, deleteAssignment };
}
