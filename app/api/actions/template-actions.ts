import {
  ActionResponsePromise,
  errorResponse,
  successResponse
} from './actionResponse';
import { HTTP_METHOD } from 'next/dist/server/web/http';

function createRequestInit<T>({
  body,
  caching = 'no-cache',
  method = 'GET'
}: {
  body?: T;
  method?: HTTP_METHOD;
  caching?: RequestCache;
}): RequestInit {
  const init: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json' // Indicate we're sending JSON data
    },
    cache: caching
  };
  if (body) {
    init.body = JSON.stringify(body);
    if (init.method === 'GET') init.method = 'POST';
  }
  return init;
}

export async function postEntityList<T>(
  dtoList: T[],
  url: string
): ActionResponsePromise<T[]> {
  const requestInit = createRequestInit({ body: dtoList });
  return callApi<T[]>(url, requestInit);
}
export async function getWithoutBody<T>(url: string) {
  const requestInit = createRequestInit({});
  return callApi<T>(url, requestInit);
}

export async function getDtoListByIds<T, U>(
  idList: T[],
  url: string
): ActionResponsePromise<U[]> {
  const requestInit = createRequestInit({ body: idList });
  return callApi(url, requestInit);
}

export async function putEntities<T>(
  entities: T,
  url: string
): ActionResponsePromise<T> {
  const requestInit = createRequestInit({
    body: entities,
    method: 'PUT'
  });
  console.log(url, requestInit);
  return callApi<T>(url, requestInit);
}

export async function deleteEntities<T>(
  entityBody: T,
  url: string
): ActionResponsePromise<T> {
  const request = createRequestInit({ body: entityBody, method: 'DELETE' });
  return callApi<T>(url, request);
}

async function callApi<T>(
  url: string,
  request: RequestInit
): ActionResponsePromise<T> {
  try {
    const response = await fetch(url, request);
    if (response.status >= 200 && response.status < 300) {
      const responseBody: T = await response.json();
      const message = response.statusText;
      return successResponse(responseBody, message);
    } else {
      return errorResponse(response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data: ', error);
    return errorResponse('Error');
  }
}
