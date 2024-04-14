import { StringMapPayload } from '../../contexts/string-map-context/string-map-reducer';

export function getPayloadArray<T>(
  itemArray: T[],
  keyAccessor: (item: T) => string
): StringMapPayload<T>[] {
  return itemArray.map((item) => ({
    key: keyAccessor(item),
    data: item
  }));
}
