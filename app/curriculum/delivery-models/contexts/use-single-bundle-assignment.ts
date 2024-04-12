import { useBundleAssignmentsContext } from './use-bundle-assignments-context';
import { useBundleItemsContext } from './use-bundle-Items-context';
import { produce } from 'immer';

export function useSingleBundleAssignment(assignmentKey: string) {
  const { dispatch, bundleAssignmentsMap } = useBundleAssignmentsContext();
  const bundleAssignmentsMapElement = bundleAssignmentsMap[assignmentKey];
  const { bundleItemsMap } = useBundleItemsContext();

  const setAssignment = (newAssignment: string) => {
    const workSeriesBundleAssignmentDto = produce(
      bundleAssignmentsMapElement,
      (draft) => {
        draft.workSeriesSchemaBundle = bundleItemsMap[newAssignment];
      }
    );
    dispatch({
      type: 'update',
      payload: { key: assignmentKey, data: workSeriesBundleAssignmentDto }
    });
  };

  const removeAssignment = () => {
    dispatch({
      type: 'delete',
      payload: { key: assignmentKey, data: bundleAssignmentsMapElement }
    });
  };

  const assignmentOptional =
    bundleAssignmentsMapElement?.workSeriesSchemaBundle?.id.toString() as
      | string
      | undefined;

  return { assignmentOptional, setAssignment, removeAssignment };
}
