import { WorkTaskTypeDto } from '../../../../api/dtos/WorkTaskTypeDtoSchema';
import { WorkProjectSeriesSchemaDto } from '../../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';

export function createSchemaExampleListFromWorkTaskTypes(
  workTaskTypes: WorkTaskTypeDto[]
) {
  return workTaskTypes.map(
    (dto) => ({ workTaskTypeId: dto.id }) as Partial<WorkProjectSeriesSchemaDto>
  );
}
