'use client';
import { WorkSeriesSchemaBundleLeanDto } from '../../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { Badge, Card, Color, Title } from '@tremor/react';
import { Tab } from '@headlessui/react';

import React, { Fragment, useMemo, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useCurriculumModelContext } from '../../contexts/use-curriculum-model-context';
import { usePathname } from 'next/navigation';
import { BundlePanel } from './bundle-panel';

import { useBundleItemsContext } from '../../contexts/use-bundle-Items-context';
import { useSelectiveContextControllerString } from '../../../../generic/components/selective-context/selective-context-manager-string';
import { useSelectiveContextKeyMemo } from '../../../../generic/hooks/selective-context/use-selective-context-listener';
import { produce } from 'immer';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useSelectiveContextDispatchBoolean } from '../../../../generic/components/selective-context/selective-context-manager-boolean';
import {
  useSelectiveContextControllerNumberList,
  useSelectiveContextDispatchNumberList
} from '../../../../generic/components/selective-context/selective-context-manager-number-list';
import { TransientIdOffset } from '../../../../graphing/editing/functions/graph-edits';

import {
  DeletedBundlesList,
  StaticDeletedBundleList
} from '../../contexts/bundle-items-context-provider';

import { sumAllSchemas } from '../../functions/sum-delivery-allocations';
import {
  RenameModal,
  RenameModalWrapperContextKey
} from '../../../../generic/components/modals/rename-modal';
import { useModal } from '../../../../generic/components/modals/confirm-action-modal';
import { RenameButton } from '../../../../generic/components/buttons/rename-button';
import { TwoStageClick } from '../../../../generic/components/buttons/two-stage-click';
import { TabStyled } from '../../../../generic/components/tab-layouts/tab-styled';

export const BundleEditorKey = 'bundles-editor';

export const UnsavedBundleEdits = `Unsaved-${BundleEditorKey}`;

export const SchemaBundleKeyPrefix = 'schema-bundle';

export const StaticSchemaIdList: string[] = [];

export const StaticTransientBundleIdList: number[] = [];

function bundleSort(
  bun1: WorkSeriesSchemaBundleLeanDto,
  bun2: WorkSeriesSchemaBundleLeanDto
) {
  return bun1.id - bun2.id;
}

type BadgeRange = 'belowMin' | 'low' | 'good' | 'high' | 'aboveMax';

const TotalPeriodBadgeColors: { [key in BadgeRange]: Color } = {
  belowMin: 'purple',
  low: 'yellow',
  good: 'emerald',
  high: 'amber',
  aboveMax: 'red'
};

export function BundleEditor({
  schemaOptions
}: {
  schemaOptions: { [key: string]: string };
}) {
  const { bundleItemsMap, dispatch: updateBundles } = useBundleItemsContext();

  const sortedBundleList = useMemo(() => {
    return Object.entries(bundleItemsMap)
      .sort((entry1, entry2) => bundleSort(entry1[1], entry2[1]))
      .map((entry) => entry[1]);
  }, [bundleItemsMap]);

  const bundleIds = useMemo(
    () => sortedBundleList.map(({ id }) => id.toString()),
    [sortedBundleList]
  );
  const schemaBundles = useMemo(() => {
    return sortedBundleList.map((dto) => dto.workProjectSeriesSchemaIds);
  }, [sortedBundleList]);
  const { curriculumModelsMap } = useCurriculumModelContext();
  const pathname = usePathname();
  const lastIndexOf = pathname?.lastIndexOf('/');
  const yearGroup =
    pathname && lastIndexOf
      ? pathname.substring(lastIndexOf - 1, lastIndexOf)
      : '';

  const contextKeyMemo = useSelectiveContextKeyMemo(
    RenameModalWrapperContextKey,
    BundleEditorKey
  );

  const { currentState: unsaved, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(
      UnsavedBundleEdits,
      BundleEditorKey,
      false
    );

  const { currentState, dispatchUpdate: dispatchRenameLocally } =
    useSelectiveContextControllerString(contextKeyMemo, BundleEditorKey);

  const {
    dispatchUpdate: updateTransientBundleIds,
    currentState: transientBundleIds
  } = useSelectiveContextControllerNumberList({
    contextKey: `${BundleEditorKey}:unsaved-bundles`,
    initialValue: StaticTransientBundleIdList,
    listenerKey: BundleEditorKey
  });

  const {
    currentState: deleteBundles,
    dispatchWithoutControl: setDeleteBundles
  } = useSelectiveContextDispatchNumberList({
    contextKey: DeletedBundlesList,
    listenerKey: BundleEditorKey,
    initialValue: StaticDeletedBundleList
  });

  const [activeTab, setActiveTab] = useState(0);

  const { isOpen, closeModal, openModal } = useModal();

  const activeBundleAndId = useMemo(() => {
    function getActiveBundleAndId() {
      const activeLeanDto = sortedBundleList[activeTab];
      const { id } = activeLeanDto;
      const stateBundle = bundleItemsMap[activeLeanDto.id.toString()];
      return { id, stateBundle };
    }
    return getActiveBundleAndId();
  }, [activeTab, bundleItemsMap, sortedBundleList]);

  const sumOfAllBundles = useMemo(() => {
    const flatList = sortedBundleList
      .map((bundle) =>
        bundle.workProjectSeriesSchemaIds.map(
          (schemaId) => curriculumModelsMap[schemaId]
        )
      )
      .reduce((prev, curr) => [...prev, ...curr], []);
    return sumAllSchemas(flatList);
  }, [sortedBundleList, curriculumModelsMap]);

  const badgeColor =
    sumOfAllBundles > 60
      ? TotalPeriodBadgeColors.aboveMax
      : sumOfAllBundles < 45
      ? TotalPeriodBadgeColors.belowMin
      : TotalPeriodBadgeColors.good;

  const deleteBundle = (id: number) => {
    setActiveTab((prev) => Math.max(0, prev - 1));
    setDeleteBundles([...deleteBundles, id]);
    updateBundles({
      type: 'delete',
      payload: { key: id.toString(), data: bundleItemsMap[id.toString()] }
    });
    dispatchWithoutControl(true);
  };

  if (
    sortedBundleList === undefined ||
    (sortedBundleList && sortedBundleList.length == 0)
  ) {
    return <Card>No bundles!</Card>;
  }

  const handleRenameBundle = () => {
    const { id, stateBundle } = activeBundleAndId;
    const immerBundle = produce(stateBundle, (draft) => {
      draft.name = currentState;
    });
    updateBundles({
      type: 'update',
      payload: { key: id.toString(), data: immerBundle }
    });
    dispatchWithoutControl(true);
    closeModal();
  };
  const handleCancel = () => {
    const { stateBundle } = activeBundleAndId;
    dispatchRenameLocally({
      contextKey: contextKeyMemo,
      value: stateBundle.name
    });
    closeModal();
  };

  const handleOpen = () => {
    const {
      stateBundle: { name }
    } = activeBundleAndId;
    dispatchRenameLocally({ contextKey: contextKeyMemo, value: name });
    openModal();
  };

  const gridColumns = sortedBundleList.length;

  const handleNewBundle = () => {
    let nextId = TransientIdOffset;
    while (transientBundleIds.includes(nextId)) {
      nextId = nextId + transientBundleIds.length;
    }
    const newBundle: WorkSeriesSchemaBundleLeanDto = {
      id: nextId,
      name: `Unnamed Bundle ${nextId}`,
      workProjectSeriesSchemaIds: []
    };
    updateBundles({
      type: 'update',
      payload: { key: nextId.toString(), data: newBundle }
    });
    setActiveTab(sortedBundleList.length);
    dispatchWithoutControl(true);
  };

  const activeBundle = sortedBundleList[activeTab];
  const { name: nameOfBundle } = sortedBundleList[activeTab];
  return (
    <Card>
      <Title className={'w-full flex items-center pb-2'}>
        Current Tab:{' '}
        <RenameButton
          onClick={handleOpen}
          currentName={nameOfBundle}
          className={'mx-2 '}
        />
        <TwoStageClick
          onClick={() => deleteBundle(activeBundleAndId.id)}
          className={'btn-sm'}
        >
          <TrashIcon className={'h-4 w-4'}></TrashIcon>
        </TwoStageClick>
        <span className={'grow'}></span>
        <span className={'grow-0'}>
          Curriculum Bundles - Year {yearGroup} - Total All Bundles:{' '}
          <Badge color={badgeColor}>{sumOfAllBundles}</Badge>
        </span>
      </Title>
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <div className={'w-full flex items-center mb-2'}>
          <Tab.List as={Fragment}>
            <div
              style={{
                gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                display: 'grid',
                width: 'calc(100% - 50px)',
                flexGrow: 1
              }}
            >
              {sortedBundleList.map((bundleFromList, index) => {
                const { name, workProjectSeriesSchemaIds } = bundleFromList;
                const workProjectSeriesSchemaDtos =
                  workProjectSeriesSchemaIds.map(
                    (schemaId) => curriculumModelsMap[schemaId]
                  );
                const totalPeriods = sumAllSchemas(workProjectSeriesSchemaDtos);

                return (
                  <TabStyled key={bundleFromList.id}>
                    {`${
                      name ? name : bundleFromList
                    } - Total Periods: ${totalPeriods.toString()}`}
                  </TabStyled>
                );
              })}
            </div>
          </Tab.List>

          <button
            className={` btn btn-sm btn-outline px-0 w-[50px] `}
            onClick={handleNewBundle}
          >
            <PlusCircleIcon className={'h-5 w-5'}></PlusCircleIcon>
          </button>
        </div>
        <Tab.Panels>
          {sortedBundleList.map(({ id }, index) => (
            <BundlePanel
              key={id}
              bundleId={id.toString()}
              schemaBundleIds={schemaBundles[index]}
              schemaOptions={schemaOptions}
            ></BundlePanel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      <RenameModal
        contextKey={contextKeyMemo}
        show={isOpen}
        onClose={closeModal}
        onConfirm={handleRenameBundle}
        onCancel={handleCancel}
        enterToConfirm={true}
      />
    </Card>
  );
}
