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
    const partyIdString = bundleAssignment.partyId.toString();
    const bundleIdString =
      bundleAssignment.workSeriesSchemaBundle.id.toString();
    bundleAssignments[partyIdString] = bundleIdString;
    initialPayload.push({ key: partyIdString, data: bundleIdString });
  });

  return { bundleAssignments, initialPayload };
}
