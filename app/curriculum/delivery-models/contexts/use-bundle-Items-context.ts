import { createContext, useContext } from 'react';
import {
  StringMap,
  StringMapDispatch
} from '../../../contexts/string-map-context/string-map-reducer';
import { WorkSeriesSchemaBundleLeanDto } from '../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { createStringMapContext } from '../../../contexts/string-map-context/context-creator';

export const BundleItemsContext = createContext<
  StringMap<WorkSeriesSchemaBundleLeanDto>
>({});
export const BundleItemsContextDispatch = createContext<
  StringMapDispatch<WorkSeriesSchemaBundleLeanDto>
>(() => {});

createStringMapContext();

export function useBundleItemsContext() {
  const workSeriesSchemaBundleLeanDtoStringMap = useContext(BundleItemsContext);
  const dispatch = useContext(BundleItemsContextDispatch);
  return { bundleItemsMap: workSeriesSchemaBundleLeanDtoStringMap, dispatch };
}
