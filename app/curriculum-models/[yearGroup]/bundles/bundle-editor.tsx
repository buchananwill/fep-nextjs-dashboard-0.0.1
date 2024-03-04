'use client';
import { WorkSeriesSchemaBundleLeanDto } from '../../../api/dtos/WorkSeriesSchemaBundleLeanDtoSchema';
import { Card, Title } from '@tremor/react';
import { useSelectiveContextControllerStringList } from '../../../components/selective-context/selective-context-manager-string-list';
import { Tab } from '@headlessui/react';
import { TabStyled } from '../../../components/tab-layouts/tab-styled';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useCurriculumModelContext } from '../../contexts/use-curriculum-model-context';
import { sumAllSchemas } from '../../../graphing/components/curriculum-delivery-details';
import { usePathname } from 'next/navigation';
import { BundlePanel } from './bundle-panel';
import {
  RenameModal,
  RenameModalWrapperContextKey
} from '../../../components/rename-modal/rename-modal';
import { useModal } from '../../../components/confirm-action-modal';
import { useBundleItemsContext } from '../../contexts/use-bundle-Items-context';
import { useSelectiveContextControllerString } from '../../../components/selective-context/selective-context-manager-string';
import { useSelectiveContextKeyMemo } from '../../../components/selective-context/use-selective-context-listener';
import { produce } from 'immer';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import {
  useSelectiveContextControllerBoolean,
  useSelectiveContextDispatchBoolean
} from '../../../components/selective-context/selective-context-manager-boolean';
import { UnsavedChangesModal } from '../../../components/unsaved-changes-modal';

export const BundleEditorKey = 'bundles-editor';

export const UnsavedBundleEdits = `Unsaved-${BundleEditorKey}`;

export const SchemaBundleKeyPrefix = 'schema-bundle';

export const StaticSchemaIdList: string[] = [];

function bundleSort(
  bun1: WorkSeriesSchemaBundleLeanDto,
  bun2: WorkSeriesSchemaBundleLeanDto
) {
  return bun1.id - bun2.id;
}

export function BundleEditor({
  schemaOptions
}: {
  schemaOptions: { [key: string]: string };
}) {
  const { bundleItemsMap, dispatch } = useBundleItemsContext();

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
  const { currentState: currentBundles, dispatchUpdate } =
    useSelectiveContextControllerStringList(
      BundleEditorKey,
      BundleEditorKey,
      bundleIds
    );
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

  const { dispatchUpdate: dispatchBundleToSchemaList } =
    useSelectiveContextControllerStringList(
      `${BundleEditorKey}:schemalists`,
      BundleEditorKey,
      StaticSchemaIdList
    );

  useEffect(() => {
    sortedBundleList.forEach((bundle) => {
      dispatchBundleToSchemaList({
        contextKey: `${SchemaBundleKeyPrefix}:${bundle.id}`,
        value: bundle.workProjectSeriesSchemaIds
      });
    });
  }, [sortedBundleList, dispatchBundleToSchemaList]);

  const [activeTab, setActiveTab] = useState(0);

  const { isOpen, closeModal, openModal } = useModal();

  function getActiveBundleAndId() {
    const activeLeanDto = sortedBundleList[activeTab];
    const { id } = activeLeanDto;
    const stateBundle = bundleItemsMap[activeLeanDto.id.toString()];
    return { id, stateBundle };
  }

  const handleRenameBundle = () => {
    const { id, stateBundle } = getActiveBundleAndId();
    const immerBundle = produce(stateBundle, (draft) => {
      draft.name = currentState;
    });
    dispatch({
      type: 'update',
      payload: { key: id.toString(), data: immerBundle }
    });
    dispatchWithoutControl(true);
    closeModal();
  };
  const handleCancel = () => {
    const { stateBundle } = getActiveBundleAndId();
    dispatchRenameLocally({
      contextKey: contextKeyMemo,
      value: stateBundle.name
    });
    closeModal();
  };

  const handleOpen = () => {
    const {
      stateBundle: { name }
    } = getActiveBundleAndId();
    dispatchRenameLocally({ contextKey: contextKeyMemo, value: name });
    openModal();
  };

  if (
    currentBundles === undefined ||
    (currentBundles && currentBundles.length == 0)
  ) {
    return <Card>No bundles!</Card>;
  }

  const gridColumns = currentBundles.length;

  return (
    <Card>
      <Title>
        Curriculum Bundles - Year {yearGroup} -{' '}
        <button
          className={'btn btn-primary btn-outline btn-sm'}
          onClick={handleOpen}
        >
          {sortedBundleList[activeTab].name}
          <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
        </button>
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
              {currentBundles.map((id, index) => {
                const workSeriesSchemaBundleLeanDto = sortedBundleList[index];
                const { name, workProjectSeriesSchemaIds } =
                  workSeriesSchemaBundleLeanDto;
                const workProjectSeriesSchemaDtos =
                  workProjectSeriesSchemaIds.map(
                    (schemaId) => curriculumModelsMap[schemaId]
                  );
                const totalPeriods = sumAllSchemas(workProjectSeriesSchemaDtos);

                return (
                  <TabStyled key={id}>
                    {`${
                      name ? name : id
                    } - Total Periods: ${totalPeriods.toString()}`}
                  </TabStyled>
                );
              })}
            </div>
          </Tab.List>

          <button className={` btn btn-sm btn-outline px-0 w-[50px] `}>
            <PlusCircleIcon className={'h-5 w-5'}></PlusCircleIcon>
          </button>
        </div>
        <Tab.Panels>
          {currentBundles.map((bundleId, index) => (
            <BundlePanel
              key={bundleId}
              bundleId={bundleId}
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
