import { WorkSeriesBundleAssignmentDto } from '../../../api/dtos/WorkSeriesBundleAssignmentDtoSchema';
import {
  StringMap,
  StringMapPayload
} from '../../../contexts/string-map-context/string-map-reducer';

export function mapToPartyIdBundleIdRecords(
  bundles: WorkSeriesBundleAssignmentDto[]
) {
  const bundleAssignments = {} as StringMap<string>;
  const initialPayload = [] as StringMapPayload<string>[];
  bundles.forEach((bundleAssignment) => {
    const organizationId = bundleAssignment.organizationId.toString();
    const bundleIdString =
      bundleAssignment.workSeriesSchemaBundle.id.toString();
    bundleAssignments[organizationId] = bundleIdString;
    initialPayload.push({ key: organizationId, data: bundleIdString });
  });

  return { bundleAssignments, initialPayload };
}
