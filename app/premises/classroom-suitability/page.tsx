import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import {
  getAssetSuitabilities,
  getPremises,
  getPremisesWithRoot
} from '../../api/actions/premises';
import { Card } from '@tremor/react';
import { AssetSuitabilityTableWrapper } from './asset-suitability-table-wrapper';
import { getWorkTaskTypes } from '../../api/actions/work-task-types';
import { isNotUndefined } from '../../api/main';
import { WorkTaskTypeContextProvider } from '../../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { convertListToStringMap } from '../../contexts/string-map-context/convert-list-to-string-map';
import AssetStringMapContextProvider from '../asset-string-map-context-provider';

import { AssetDisclosureListPanel } from './asset-disclosure-list-panel';
import AssetSuitabilityEditContextProvider from '../asset-suitability-edit-context-provider';
import ToolCardContextProvider from '../../generic/components/tool-card/tool-card-context-provider';
import ToolCard from '../../generic/components/tool-card/tool-card';
import AssetRoleSuitabilityStringMapContextProvider from '../asset-role-suitability-string-map-context-provider';
import { IdStringFromNumberAccessor } from './rating-table-accessor-functions';
import { parseTen } from '../../api/date-and-time';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/data-not-found-card';
import WorkTaskTypeFilterGroup from './work-task-type-filter-group';

export default async function Page({
  searchParams: { rootName, ...workTaskParams }
}: {
  searchParams: {
    rootName?: string;
    serviceCategoryDto?: string;
    knowledgeDomain?: string;
    knowledgeLevelOrdinal?: string;
  };
}) {
  let premisesPromises: ActionResponsePromise<GraphDto<AssetDto>>;
  if (isNotUndefined(rootName)) {
    premisesPromises = getPremisesWithRoot(rootName);
  } else {
    premisesPromises = getPremises();
  }
  const actionResponse = await premisesPromises;

  const actionResponseWorkTaskTypes = await getWorkTaskTypes(workTaskParams);

  if (actionResponse.status != 200 || actionResponse.data === undefined) {
    console.log('Not implemented', actionResponse);
    return <Card>No premises!</Card>;
  }

  const workTaskTypeDtos = actionResponseWorkTaskTypes.data;
  if (workTaskTypeDtos === undefined) {
    return <DataNotFoundCard>No lesson types found</DataNotFoundCard>;
  }
  const assetDtoList = actionResponse.data.nodes
    .map((dn) => dn.data)
    .map((asset) => {
      const sortedSuitabilities = asset.assetRoleWorkTaskSuitabilities.sort(
        (suit1, suit2) =>
          suit1.workTaskTypeName.localeCompare(suit2.workTaskTypeName)
      );
      return { ...asset, assetRoleWorkTaskSuitabilities: sortedSuitabilities };
    });

  const assetStringMap = await convertListToStringMap(
    assetDtoList,
    IdStringFromNumberAccessor
  );
  const wttStringMap = await convertListToStringMap(
    workTaskTypeDtos,
    (workTaskTypeDto) => workTaskTypeDto.id.toString()
  );

  const assetIds = Object.keys(assetStringMap).map(parseTen);
  const workTaskTypeIds = Object.keys(wttStringMap)
    .sort((key1, key2) => {
      return wttStringMap[key1].name.localeCompare(wttStringMap[key2].name);
    })
    .map(parseTen);

  console.log(assetIds, workTaskTypeIds);

  const { data: assetSuitabilities } = await getAssetSuitabilities(
    assetIds,
    workTaskTypeIds
  );

  if (!isNotUndefined(assetSuitabilities)) {
    return <DataNotFoundCard>Suitabilities not found.</DataNotFoundCard>;
  }

  const { table } = assetSuitabilities;

  console.log('rendering root page');

  return (
    <WorkTaskTypeContextProvider entityMap={wttStringMap}>
      <AssetStringMapContextProvider assetStringMap={assetStringMap}>
        <AssetRoleSuitabilityStringMapContextProvider suitabilityLists={table}>
          <AssetSuitabilityEditContextProvider>
            <div className={'w-full flex gap-2'}>
              <ToolCardContextProvider>
                <ToolCard>
                  <ToolCard.UpperSixth>
                    Classroom Suitability
                  </ToolCard.UpperSixth>
                  <ToolCard.LowerFiveSixths>
                    <AssetDisclosureListPanel />
                  </ToolCard.LowerFiveSixths>
                </ToolCard>
              </ToolCardContextProvider>

              <AssetSuitabilityTableWrapper />
              <WorkTaskTypeFilterGroup />
            </div>
          </AssetSuitabilityEditContextProvider>
        </AssetRoleSuitabilityStringMapContextProvider>
      </AssetStringMapContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
