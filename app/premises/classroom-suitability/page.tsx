import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import {
  getAssetSuitabilities,
  getPremises,
  getPremisesWithRoot
} from '../../api/actions/custom/premises';
import { Card } from '@nextui-org/card';
import { AssetSuitabilityTableWrapper } from './asset-suitability-table-wrapper';
import { getWorkTaskTypes } from '../../api/actions/custom/work-task-types';
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
import SearchParamsFilterGroup from './search-params-filter-group';
import { UnsavedAssetChanges } from '../asset-string-map-context-creator';
import { KnowledgeDomainFilterSelector } from './knowledge-domain-filter-selector';
import { KnowledgeLevelFilterSelector } from './knowledge-level-filter-selector';
import { AssetRootIdFilterSelector } from './asset-root-id-filter-selector';
import { getWorkTaskTypeIdsAlphabetical } from './get-work-task-type-ids-alphabetical';

export default async function Page({
  searchParams: { rootId, ...workTaskParams }
}: {
  searchParams: {
    rootId?: string;
    serviceCategoryDto?: string;
    knowledgeDomain?: string;
    knowledgeLevelOrdinal?: string;
  };
}) {
  let premisesPromises: ActionResponsePromise<GraphDto<AssetDto>>;
  if (isNotUndefined(rootId)) {
    premisesPromises = getPremisesWithRoot(rootId);
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
  const assetDtoList = actionResponse.data.nodes.map((dn) => dn.data);

  const assetStringMap = convertListToStringMap(
    assetDtoList,
    IdStringFromNumberAccessor
  );
  const wttStringMap = convertListToStringMap(
    workTaskTypeDtos,
    (workTaskTypeDto) => workTaskTypeDto.id.toString()
  );

  const assetIds = Object.keys(assetStringMap).map(parseTen);
  const workTaskTypeIds = getWorkTaskTypeIdsAlphabetical(wttStringMap);

  const { data: assetSuitabilities } = await getAssetSuitabilities(
    assetIds,
    workTaskTypeIds
  );

  if (!isNotUndefined(assetSuitabilities)) {
    return <DataNotFoundCard>Suitabilities not found.</DataNotFoundCard>;
  }

  const table = assetSuitabilities;

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
              <SearchParamsFilterGroup unsavedContextKey={UnsavedAssetChanges}>
                <KnowledgeDomainFilterSelector />
                <KnowledgeLevelFilterSelector />
                <AssetRootIdFilterSelector />
              </SearchParamsFilterGroup>
            </div>
          </AssetSuitabilityEditContextProvider>
        </AssetRoleSuitabilityStringMapContextProvider>
      </AssetStringMapContextProvider>
    </WorkTaskTypeContextProvider>
  );
}
