import { ActionResponsePromise } from '../../api/actions/actionResponse';
import { GraphDto } from '../../api/zod-mods';
import { AssetDto } from '../../api/dtos/AssetDtoSchema';
import { fetchPremises } from '../../api/actions/request-class-rooms';
import { Card } from '@tremor/react';
import { AssetSuitabilityTableWrapper } from './asset-suitability-table-wrapper';
import { getWorkTaskTypes } from '../../api/actions/work-task-types';
import { SECONDARY_EDUCATION_CATEGORY_ID } from '../../api/main';
import { DataNotFoundCard } from '../../timetables/students/[schedule]/page';
import { WorkTaskTypeContextProvider } from '../../curriculum/delivery-models/contexts/work-task-type-context-provider';
import { convertListToStringMap } from '../../curriculum/delivery-models/contexts/convert-list-to-string-map';
import AssetStringMapContextProvider from '../asset-string-map-context-provider';
import ToolCardContextProvider from '../../components/tool-card/tool-card-context-provider';
import ToolCard from '../../components/tool-card/tool-card';
import { ClassroomDisclosureListPanel } from './classroom-disclosure-list-panel';
import AssetSuitabilityEditContextProvider from '../asset-suitability-edit-context-provider';

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
                  <ClassroomDisclosureListPanel />
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
