import { createContext, Dispatch, useContext } from 'react';
import {
  MapDispatch,
  StringMap,
  StringMapDispatch
} from './curriculum-models-context-creator';
import { WorkSeriesSchemaBundleLeanDto } from '../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';

export const BundleItemsContext = createContext<
  StringMap<WorkSeriesSchemaBundleLeanDto>
>({});
export const BundleItemsContextDispatch = createContext<
  StringMapDispatch<WorkSeriesSchemaBundleLeanDto>
>(() => {});

export function useBundleItemsContext() {
  const workSeriesSchemaBundleLeanDtoStringMap = useContext(BundleItemsContext);
  const dispatch = useContext(BundleItemsContextDispatch);
  return { bundleItemsMap: workSeriesSchemaBundleLeanDtoStringMap, dispatch };
}
