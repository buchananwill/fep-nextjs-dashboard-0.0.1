'use server';
import { AssetRoleWorkTaskSuitabilityDto } from '../dtos/AssetRoleWorkTaskSuitabilityDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateTriIntersectionEndpointSet } from '../actions/template-tri-intersection-endpoints';

export const {
  getPage,
  getAll,
  deleteIdList,
  postList,
  putList,
  getOne,
  postOne,
  putOne,
  deleteOne,
  getDtoListByBodyList,
  getDtoListByParamList,
  getDtoListByExampleList
} = generateBaseEndpointSet<
  AssetRoleWorkTaskSuitabilityDto,
  number
>(
  '/api/v2/workTaskTypes/assetRoleSuitabilities'
);



export const {
  getByRowIdListAndColumnIdListAndLayerId,
  getByRowIdListAndLayerId,
  getColumnIdListAndLayerId,
  getTriIntersectionTable
} = generateTriIntersectionEndpointSet<
  AssetRoleWorkTaskSuitabilityDto,
  number,
  number,
  number
>('/api/v2/workTaskTypes/assetRoleSuitabilities');

