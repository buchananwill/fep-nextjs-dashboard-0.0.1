'use server';
import { CarouselOrderDto } from '../dtos/CarouselOrderDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';

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
  CarouselOrderDto,
  string
>(
  '/api/v2/carouselGroups/orders'
);


