import { ActionResponsePromise } from './actionResponse';
import {
  deleteEntities,
  getWithoutBody,
  postEntities,
  putEntities
} from './template-actions';
import { API_V2_URL, isNotUndefined, Page } from '../main';

function constructUrl(resourceSegments: string[] | string, action?: string) {
  const basePath = API_V2_URL;

  const resourcePath = Array.isArray(resourceSegments)
    ? resourceSegments.join('/')
    : resourceSegments;
  return `${basePath}/${resourcePath}${
    isNotUndefined(action) ? `/${action}` : ''
  }`;
}

export interface PageRequest {
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface BaseEndpointSet<T, ID_TYPE> {
  getPage: (pageRequest: PageRequest) => ActionResponsePromise<Page<T>>;
  putList: (dtoList: T[]) => ActionResponsePromise<T[]>;
  postList: (dtoList: T[]) => ActionResponsePromise<T[]>;
  deleteIdList: (idDeletionList: ID_TYPE[]) => ActionResponsePromise<ID_TYPE[]>;
}

async function getDtoList<T>(
  { page = 0, pageSize = 10 }: PageRequest,
  url: string
): ActionResponsePromise<Page<T>> {
  return getWithoutBody(`${url}?page=${page}&size=${pageSize}`);
}

async function putDtoList<T>(
  dtoList: T[],
  url: string
): ActionResponsePromise<T[]> {
  return putEntities(dtoList, url);
}

async function postDtoList<T>(
  dtoList: T[],
  url: string
): ActionResponsePromise<T[]> {
  return postEntities(dtoList, url);
}

async function deleteDtoList<ID_TYPE>(
  deletionIdList: ID_TYPE[],
  url: string
): ActionResponsePromise<ID_TYPE[]> {
  return deleteEntities(deletionIdList, url);
}

export function generateBaseEndpointSet<T, ID_TYPE>(
  path: string | string[]
): BaseEndpointSet<T, ID_TYPE> {
  const generatedUrl = constructUrl(path);
  return {
    getPage: (pageRequest) => getDtoList<T>(pageRequest, generatedUrl),
    putList: (dtoList) => putDtoList(dtoList, generatedUrl),
    postList: (dtoList) => postDtoList(dtoList, generatedUrl),
    deleteIdList: (idDeletionList) =>
      deleteDtoList<ID_TYPE>(idDeletionList, generatedUrl)
  };
}
