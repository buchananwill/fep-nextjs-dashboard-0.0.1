import { useBundleAssignmentsContext } from './use-bundle-assignments-context';

export function useSingleBundleAssignment(assignmentKey: string) {
  const { dispatch, bundleAssignmentsMap } = useBundleAssignmentsContext();
  const bundleAssignmentsMapElement = bundleAssignmentsMap[assignmentKey];

  const setAssignment = (newAssignment: string) => {
    dispatch({
      type: 'update',
      payload: { key: assignmentKey, data: newAssignment }
    });
  };

  const removeAssignment = () => {
    dispatch({
      type: 'delete',
      payload: { key: assignmentKey, data: bundleAssignmentsMapElement }
    });
  };

  const assignmentOptional = bundleAssignmentsMapElement as string | undefined;

  return { assignmentOptional, setAssignment, removeAssignment };
}