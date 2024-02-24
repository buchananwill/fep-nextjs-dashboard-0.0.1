import { ActionResponse, ActionResponsePromise } from './actionResponse';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';
import { API_BASE_URL } from '../main';

export async function getCurriculumDeliveryModelSchemas(): ActionResponsePromise<
  WorkProjectSeriesSchemaDto[]
> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/custom/workProjectSeriesSchemas`,
      { cache: 'no-cache' }
    );
    const schemas = await response.json();
    return ActionResponse.success(schemas);
  } catch (error) {
    console.error('Error fetching data: ', error);
    return ActionResponse.error(`${error}`);
  }
}
