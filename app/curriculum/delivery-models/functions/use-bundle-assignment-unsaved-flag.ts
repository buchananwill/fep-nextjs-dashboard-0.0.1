import { useMemo } from 'react';
import { SchemaBundleKeyPrefix } from '../[yearGroup]/bundles/bundle-editor';
import { useSelectiveContextDispatchBoolean } from '../../../generic/components/selective-context/selective-context-manager-boolean';
import { UnsavedBundleAssignmentsKey } from '../contexts/bundle-assignments-provider';

export function useBundleAssignmentUnsavedFlag(
  assignmentOptional: string | undefined,
  id: number
) {
  const { selectiveListenerKey } = useMemo(() => {
    const selectiveContextKey = `${SchemaBundleKeyPrefix}${assignmentOptional}`;
    const selectiveListenerKey = `${selectiveContextKey}:${id}`;
    return { selectiveContextKey, selectiveListenerKey };
  }, [assignmentOptional, id]);
  const { dispatchWithoutControl } = useSelectiveContextDispatchBoolean(
    UnsavedBundleAssignmentsKey,
    selectiveListenerKey,
    false
  );
  return dispatchWithoutControl;
}
