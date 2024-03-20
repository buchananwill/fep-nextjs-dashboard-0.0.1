import { useMemo } from 'react';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { sumAllSchemas } from './sum-delivery-allocations';

export function useSumAllSchemasMemo(schemas: WorkProjectSeriesSchemaDto[]) {
  return useMemo(() => sumAllSchemas(schemas), [schemas]);
}
