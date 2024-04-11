'use server';
import { CarouselDto } from '../dtos/CarouselDtoSchema';
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
  CarouselDto,
  string
>(
  '/api/v2/carouselGroups/carousels'
);


