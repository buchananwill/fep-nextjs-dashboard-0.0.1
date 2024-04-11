'use server';
import { CarouselGroupDto } from '../dtos/CarouselGroupDtoSchema';
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
  CarouselGroupDto,
  string
>(
  '/api/v2/carouselGroups'
);


