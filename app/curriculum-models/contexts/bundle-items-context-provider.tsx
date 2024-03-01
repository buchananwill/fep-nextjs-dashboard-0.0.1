'use client';
import {
  BundleItemsContext,
  BundleItemsContextDispatch
} from './use-bundle-Items-context';
import { PropsWithChildren, useMemo } from 'react';
import { WorkSeriesSchemaBundleLeanDto } from '../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import {
  StringMap,
  useStringMapReducer
} from './curriculum-models-context-creator';

export function BundleItemsContextProvider({
  bundleItems,
  children
}: { bundleItems: WorkSeriesSchemaBundleLeanDto[] } & PropsWithChildren) {
  const bundlesMap = useMemo(() => {
    const bundlesMap = {} as StringMap<WorkSeriesSchemaBundleLeanDto>;
    bundleItems.forEach((bundle) => {
      bundlesMap[bundle.id.toString()] = bundle;
    });
    return bundlesMap;
  }, [bundleItems]);
  const [bundleItemState, dispatch] =
    useStringMapReducer<WorkSeriesSchemaBundleLeanDto>(bundlesMap);
  return (
    <BundleItemsContext.Provider value={bundleItemState}>
      <BundleItemsContextDispatch.Provider value={dispatch}>
        {children}
      </BundleItemsContextDispatch.Provider>{' '}
    </BundleItemsContext.Provider>
  );
}
