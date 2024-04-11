'use server';
import { CarouselOrderItemDto } from '../dtos/CarouselOrderItemDtoSchema';
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
  CarouselOrderItemDto,
  number
>(
  '/api/v2/carousels/orders/items'
);


