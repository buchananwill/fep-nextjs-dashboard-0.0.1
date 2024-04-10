'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { WorkProjectSeriesSchemaDto } from '../dtos/WorkProjectSeriesSchemaDtoSchema';

export const {
  getPage,
  deleteIdList,
  postList,
  putList,
  getOne,
  postOne,
  putOne,
  deleteOne,
  getDtoListByBodyList,
  getDtoListByParamList
} = generateBaseEndpointSet<
  WorkProjectSeriesSchemaDto,
  string
>(
  '/api/v2/workProjectSeriesSchemas'
);


