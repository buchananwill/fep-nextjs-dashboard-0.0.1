import { useBundleItemsContext } from '../contexts/use-bundle-Items-context';
import { useMemo } from 'react';

export function useSchemaIdsFromBundleItemsContext(
  assignmentOptional: string | undefined
) {
  const { bundleItemsMap } = useBundleItemsContext();
  const schemaIdList = useMemo(() => {
    if (assignmentOptional) {
      const bundleItemsMapElement = bundleItemsMap[assignmentOptional];
      return bundleItemsMapElement.workProjectSeriesSchemaIds;
    } else return [];
  }, [bundleItemsMap, assignmentOptional]);
  return { bundleItemsMap, schemaIdList };
}