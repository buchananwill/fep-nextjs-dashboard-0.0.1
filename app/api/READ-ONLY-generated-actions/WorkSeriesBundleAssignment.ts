'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { WorkSeriesBundleAssignmentDto } from '../dtos/WorkSeriesBundleAssignmentDtoSchema';

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
  WorkSeriesBundleAssignmentDto,
  number
>(
  '/api/v2/workProjectSeriesSchemas/bundleAssignments'
);


