'use client';
import {
  BundleItemsContext,
  BundleItemsContextDispatch
} from './use-bundle-Items-context';
import { PropsWithChildren, useMemo } from 'react';
import { WorkSeriesSchemaBundleLeanDto } from '../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { StringMap, useStringMapReducer } from './string-map-context-creator';
import { UnsavedChangesModal } from '../../components/unsaved-changes-modal';
import { useSelectiveContextControllerBoolean } from '../../components/selective-context/selective-context-manager-boolean';
import {
  BundleEditorKey,
  UnsavedBundleEdits
} from '../[yearGroup]/bundles/bundle-editor';
import { useModal } from '../../components/confirm-action-modal';
import { putBundles } from '../../api/actions/curriculum-delivery-model';
import { getPayloadArray } from '../use-curriculum-delivery-model-editing';

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

  const { currentState: unsaved, dispatchUpdate: setUnsavedBundles } =
    useSelectiveContextControllerBoolean(UnsavedBundleEdits, 'provider', false);

  const { isOpen, closeModal, openModal } = useModal();

  const handleConfirm = () => {
    const bundleLeanDtos = Object.values(bundleItemState);
    putBundles(bundleLeanDtos).then((r) => {
      if (r.status >= 200 && r.status < 300 && r.data) {
        const payloadArray = getPayloadArray(r.data, (bundle) =>
          bundle.id.toString()
        );
        dispatch({ type: 'updateAll', payload: payloadArray });
        setUnsavedBundles({ contextKey: UnsavedBundleEdits, value: false });
        closeModal();
      }
    });
  };

  const handleCancel = () => {
    dispatch({
      type: 'updateAll',
      payload: getPayloadArray(bundleItems, (b) => b.id.toString())
    });
  };

  return (
    <BundleItemsContext.Provider value={bundleItemState}>
      <BundleItemsContextDispatch.Provider value={dispatch}>
        {children}
        <UnsavedChangesModal
          unsavedChanges={unsaved}
          handleOpen={openModal}
          show={isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </BundleItemsContextDispatch.Provider>{' '}
    </BundleItemsContext.Provider>
  );
}
