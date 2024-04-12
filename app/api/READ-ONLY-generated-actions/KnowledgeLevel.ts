'use server';
import { KnowledgeLevelDto } from '../dtos/KnowledgeLevelDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';

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
  getDtoListByParamList
} = generateBaseEndpointSet<
  KnowledgeLevelDto,
  number
>(
  '/api/v2/serviceCategories/knowledgeLevels'
);


