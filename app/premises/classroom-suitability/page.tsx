import {
  ActionResponsePromise,
  errorResponse,
  successResponse
} from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { fetchPremises } from '../../api/actions/request-class-rooms';
import { Card } from '@tremor/react';
import { AssetSuitabilityTableWrapper } from './asset-suitability-table-wrapper';
import {
  getWorkTaskTypeGraph,
  getWorkTaskTypes
} from '../../api/actions/work-task-types';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../../api/main';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { WorkTaskTypeContext } from '../../curriculum/delivery-models/contexts/use-work-task-type-context';
import { WorkTaskTypeContextProvider } from '../../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { convertListToStringMap } from '../../curriculum/delivery-models/contexts/convert-list-to-string-map';
import { StringMapEditContextProvider } from '../../components/string-map-context/string-map-edit-context-provider';
import {
  AssetChangesProviderListener,
  AssetCommitKey,
  AssetStringMapContext,
  AssetStringMapDispatchContext,
  UnsavedAssetChanges
} from '../asset-string-map-context-creator';
import AssetStringMapContextProvider from '../asset-string-map-context-provider';

export default async function Page() {
  const premisesPromises: ActionResponsePromise<GraphDto<AssetDto>> =
    fetchPremises();
  const actionResponse = await premisesPromises;

  const actionResponseWorkTaskTypes = await getWorkTaskTypes(
    SECONDARY_EDUCATION_CATEGORY_ID
  );

  if (actionResponse.status != 200 || actionResponse.data === undefined) {
    console.log('Not implemented', actionResponse);
    return <Card>No premises!</Card>;
  }

  const workTaskTypeDtos = actionResponseWorkTaskTypes.data;
  if (workTaskTypeDtos === undefined) {
    return <DataNotFoundCard>No lesson types found</DataNotFoundCard>;
  }
  const assetDtos = actionResponse.data.nodes.map((dn) => dn.data);

  const assetStringMap = await convertListToStringMap(assetDtos, (asset) =>
    asset.id.toString()
  );
  const wttStringMap = await convertListToStringMap(
    workTaskTypeDtos,
    (workTaskTypeDto) => workTaskTypeDto.id.toString()
  );

  return (
    <WorkTaskTypeContextProvider entityMap={wttStringMap}>
      <AssetStringMapContextProvider assetStringMap={assetStringMap}>
        <AssetSuitabilityTableWrapper ratedElements={assetStringMap} />
      </AssetStringMapContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
