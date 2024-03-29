import { useMemo } from 'react';
import { useSelectiveContextDispatchBoolean } from '../../../selective-context/components/typed/selective-context-manager-boolean';
import { UnsavedBundleAssignmentsKey } from '../contexts/bundle-assignments-provider';
import { SchemaBundleKeyPrefix } from '../../../selective-context/keys/work-series-schema-bundle-keys';

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
