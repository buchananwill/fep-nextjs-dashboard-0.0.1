import { WorkTaskTypeDto } from '../../api/dtos/WorkTaskTypeDtoSchema';
import { isNotUndefined } from '../../api/main';
import { parseTen } from '../../api/date-and-time';

export function createWorkTaskTypeExample(
  serviceCategoryDto?: string,
  knowledgeDomain?: string,
  knowledgeLevelOrdinal?: string
) {
  const workTaskTypeExample: Partial<WorkTaskTypeDto> = {};

  if (isNotUndefined(serviceCategoryDto)) {
    workTaskTypeExample.serviceCategoryId = parseTen(serviceCategoryDto);
  }
  if (isNotUndefined(knowledgeDomain)) {
    workTaskTypeExample.knowledgeDomainId = parseTen(knowledgeDomain);
  }
  if (isNotUndefined(knowledgeLevelOrdinal)) {
    workTaskTypeExample.knowledgeLevelLevelOrdinal = parseTen(
      knowledgeLevelOrdinal
    );
  }
  return workTaskTypeExample;
}