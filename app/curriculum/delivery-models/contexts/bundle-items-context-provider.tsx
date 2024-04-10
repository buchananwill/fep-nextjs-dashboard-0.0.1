'use client';
import {
  BundleItemsContext,
  BundleItemsContextDispatch
} from './use-bundle-Items-context';
import { PropsWithChildren, useMemo, useTransition } from 'react';
import { WorkSeriesSchemaBundleLeanDto } from '../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import {
  StringMap,
  StringMapPayload,
  useStringMapReducer
} from '../../../contexts/string-map-context/string-map-reducer';

import { useSelectiveContextControllerBoolean } from '../../../selective-context/components/typed/selective-context-manager-boolean';

import { TransientIdOffset } from '../../../graphing/editing/functions/graph-edits';
import { ActionResponse } from '../../../api/actions/actionResponse';
import { Card, Title } from '@tremor/react';
import { useSelectiveContextControllerNumberList } from '../../../selective-context/components/typed/selective-context-manager-number-list';
import { getPayloadArray } from '../use-editing-context-dependency';
import { useModal } from '../../../generic/components/modals/confirm-action-modal';
import { UnsavedChangesModal } from '../../../generic/components/modals/unsaved-changes-modal';
import { UnsavedBundleEdits } from '../../../selective-context/keys/work-series-schema-bundle-keys';
import {
  deleteIdList,
  postList,
  putList
} from '../../../api/READ-ONLY-generated-actions/WorkSeriesSchemaBundle';

export const StaticDeletedBundleList: number[] = [];

export const DeletedBundlesList = 'deleted-bundle-list';

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
  const [pending, startTransition] = useTransition();

  const [bundleItemState, dispatch] =
    useStringMapReducer<WorkSeriesSchemaBundleLeanDto>(bundlesMap);

  const { currentState: unsaved, dispatchUpdate: setUnsavedBundles } =
    useSelectiveContextControllerBoolean(UnsavedBundleEdits, 'provider', false);

  const { currentState: deleteBundleIds } =
    useSelectiveContextControllerNumberList({
      contextKey: DeletedBundlesList,
      listenerKey: 'provider',
      initialValue: StaticDeletedBundleList
    });

  const { isOpen, closeModal, openModal } = useModal();

  const handleConfirm = () => {
    startTransition(() => {
      const bundleLeanDtos = Object.values(bundleItemState);
      const existingBundles: WorkSeriesSchemaBundleLeanDto[] = [];
      const newBundles: WorkSeriesSchemaBundleLeanDto[] = [];
      bundleLeanDtos.forEach((bundle) => {
        if (bundle.id >= TransientIdOffset) {
          newBundles.push(bundle);
        } else {
          existingBundles.push(bundle);
        }
      });
      const updatedBundles: StringMapPayload<WorkSeriesSchemaBundleLeanDto>[] =
        [];
      const responses: ActionResponse<WorkSeriesSchemaBundleLeanDto[]>[] = [];
      deleteIdList(deleteBundleIds)
        .then(() => postList(newBundles))
        .then((r) => {
          if (r.status >= 200 && r.status < 300 && r.data) {
            getPayloadArray(r.data, (bundle) => bundle.id.toString()).forEach(
              (payload) => updatedBundles.push(payload)
            );
            responses.push(r);
            return;
          }
        })
        .then(() => putList(existingBundles))
        .then((r) => {
          if (r.status >= 200 && r.status < 300 && r.data) {
            const payloadArray = getPayloadArray(r.data, (bundle) =>
              bundle.id.toString()
            );
            payloadArray.forEach((payload) => updatedBundles.push(payload));
          }
        })
        .then(() => {
          dispatch({ type: 'updateAll', payload: updatedBundles });
          setUnsavedBundles({ contextKey: UnsavedBundleEdits, update: false });
          closeModal();
        });
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
        {pending && (
          <Card className={'fixed top-4 left-1/2'}>
            <Title>Saving to database</Title>{' '}
            <span className="loading loading-spinner loading-lg"></span>
          </Card>
        )}
      </BundleItemsContextDispatch.Provider>{' '}
    </BundleItemsContext.Provider>
  );
}
