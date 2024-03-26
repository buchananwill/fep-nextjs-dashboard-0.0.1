import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { getPremises, getPremisesWithRoot } from '../../api/actions/premises';
import { Card } from '@tremor/react';
import { AssetSuitabilityTableWrapper } from './asset-suitability-table-wrapper';
import { getWorkTaskTypes } from '../../api/actions/work-task-types';
import {
  isNotUndefined,
  SECONDARY_EDUCATION_CATEGORY_ID
} from '../../api/main';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { WorkTaskTypeContextProvider } from '../../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { convertListToStringMap } from '../../curriculum/delivery-models/contexts/convert-list-to-string-map';
import AssetStringMapContextProvider from '../asset-string-map-context-provider';

import { AssetDisclosureListPanel } from './asset-disclosure-list-panel';
import AssetSuitabilityEditContextProvider from '../asset-suitability-edit-context-provider';
import ToolCardContextProvider from '../../generic/components/tool-card/tool-card-context-provider';
import ToolCard from '../../generic/components/tool-card/tool-card';

export default async function Page({
  searchParams: { rootName }
}: {
  searchParams: { rootName: string };
}) {
  let premisesPromises: ActionResponsePromise<GraphDto<AssetDto>>;
  if (isNotUndefined(rootName)) {
    premisesPromises = getPremisesWithRoot(rootName);
  } else {
    premisesPromises = getPremises();
  }
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
  const assetDtoList = actionResponse.data.nodes
    .map((dn) => dn.data)
    .map((asset) => {
      const sortedSuitabilities = asset.assetRoleWorkTaskSuitabilities.sort(
        (suit1, suit2) =>
          suit1.workTaskTypeName.localeCompare(suit2.workTaskTypeName)
      );
      return { ...asset, assetRoleWorkTaskSuitabilities: sortedSuitabilities };
    });

  const assetStringMap = await convertListToStringMap(assetDtoList, (asset) =>
    asset.id.toString()
  );
  const wttStringMap = await convertListToStringMap(
    workTaskTypeDtos,
    (workTaskTypeDto) => workTaskTypeDto.id.toString()
  );

  console.log('rendering root page');

  return (
    <WorkTaskTypeContextProvider entityMap={wttStringMap}>
      <AssetStringMapContextProvider assetStringMap={assetStringMap}>
        <AssetSuitabilityEditContextProvider>
          <div className={'w-full flex'}>
            <ToolCardContextProvider>
              <ToolCard>
                <ToolCard.UpperSixth>Classroom Suitability</ToolCard.UpperSixth>
                <ToolCard.LowerFiveSixths>
                  <AssetDisclosureListPanel />
                </ToolCard.LowerFiveSixths>
              </ToolCard>
            </ToolCardContextProvider>
            <AssetSuitabilityTableWrapper />
          </div>
        </AssetSuitabilityEditContextProvider>
      </AssetStringMapContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
