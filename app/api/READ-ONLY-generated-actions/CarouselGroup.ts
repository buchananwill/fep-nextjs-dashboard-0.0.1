'use server';
import { generateBaseEndpointSet } from '../actions/template-endpoints';
import { CarouselGroupDto } from '../dtos/CarouselGroupDtoSchema';

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
  CarouselGroupDto,
  string
>(
  '/api/v2/carouselGroups'
);


