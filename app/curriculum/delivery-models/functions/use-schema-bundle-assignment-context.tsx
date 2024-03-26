import { useSchemaIdsFromBundleItemsContext } from './use-schema-ids-from-bundle-items-context';
import { useBundleAssignmentUnsavedFlag } from './use-bundle-assignment-unsaved-flag';
import { useSchemaDetailMemo } from './use-schema-detail-memo';
import { useSingleBundleAssignment } from '../contexts/use-single-bundle-assignment';

export function useSchemaBundleAssignmentContext(id: number) {
  const { assignmentOptional, setAssignment } = useSingleBundleAssignment(
    id.toString()
  );
  const { bundleItemsMap, schemaIdList } =
    useSchemaIdsFromBundleItemsContext(assignmentOptional);
  const dispatchWithoutControl = useBundleAssignmentUnsavedFlag(
    assignmentOptional,
    id
  );

  const schemas = useSchemaDetailMemo(schemaIdList);
  return {
    assignmentOptional,
    setAssignment,
    bundleItemsMap,
    dispatchWithoutControl,
    schemas
  };
}
