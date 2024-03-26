import { WorkSeriesBundleDeliveryDto } from '../../../api/dtos/WorkSeriesBundleDeliveryDtoSchema';
import {
  StringMap,
  StringMapPayload
} from '../../../contexts/string-map-context/string-map-reducer';

export function mapToPartyIdBundleIdRecords(
  bundles: WorkSeriesBundleDeliveryDto[]
) {
  const bundleAssignments = {} as StringMap<string>;
  const initialPayload = [] as StringMapPayload<string>[];
  bundles.forEach((bundleDeliveryDto) => {
    const partyIdString = bundleDeliveryDto.partyId.toString();
    const bundleIdString =
      bundleDeliveryDto.workSeriesSchemaBundle.id.toString();
    bundleAssignments[partyIdString] = bundleIdString;
    initialPayload.push({ key: partyIdString, data: bundleIdString });
  });

  return { bundleAssignments, initialPayload };
}
