'use server';
import { CarouselOrderItemDto } from '../dtos/CarouselOrderItemDtoSchema';
import { generateBaseEndpointSet } from '../actions/template-base-endpoints';
import { generateIntersectionEndpointSet } from '../actions/template-intersection-endpoints';

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
  CarouselOrderItemDto,
  number
>(
  '/api/v2/carousels/orders/items'
);


export const {
  getByRowIdListAndColumnIdList,
  getColumnIdList,
  getByRowIdList,
  getIntersectionTable
} = generateIntersectionEndpointSet<
  CarouselOrderItemDto,
  string,
  string
>(
  '/api/v2/carousels/orders/items'
);

