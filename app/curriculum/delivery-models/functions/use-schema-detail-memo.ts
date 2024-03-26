import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { useMemo } from 'react';
import { useCurriculumModelContext } from '../contexts/use-curriculum-model-context';
import { isNotNull } from '../../../api/main';

export const EmptySchemasArray = [] as WorkProjectSeriesSchemaDto[];

export function useSchemaDetailMemo(schemaIdList: string[]) {
  const { curriculumModelsMap } = useCurriculumModelContext();

  const { schemas } = useMemo(() => {
    const schemas = schemaIdList
      .map((schemaId) => {
        return curriculumModelsMap[schemaId];
      })
      .filter(isNotNull<WorkProjectSeriesSchemaDto>);

    if (schemas.length > 0) return { schemas };
    return { schemas: EmptySchemasArray };
  }, [schemaIdList, curriculumModelsMap]);
  return schemas;
}
