'use server';
import { KnowledgeDomainDto } from '../dtos/KnowledgeDomainDtoSchema';
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
  getDtoListByParamList,
  getDtoListByExampleList
} = generateBaseEndpointSet<
  KnowledgeDomainDto,
  number
>(
  '/api/v2/serviceCategories/knowledgeDomains'
);


