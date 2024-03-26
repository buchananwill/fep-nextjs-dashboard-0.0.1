import { AccessorFunction } from '../../../generic/components/tables/rating/rating-table';
import { StringMap } from './string-map-context-creator';

export async function convertListToStringMap<T>(
  list: T[],
  accessorFunction: AccessorFunction<T, string>
) {
  const responseMap: StringMap<T> = {};
  list.forEach((element) => {
    responseMap[accessorFunction(element)] = element;
  });
  return responseMap;
}
