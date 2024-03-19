'use client';
import { DataNode } from '../../../api/zod-mods';
import React, { useContext, useMemo } from 'react';
import { CheckIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import { WorkProjectSeriesSchemaDto } from '../../../api/dtos/WorkProjectSeriesSchemaDtoSchema';
import { isNotNull } from '../../editing/graph-edits';
import { useCurriculumModelContext } from '../../../curriculum/delivery-models/contexts/use-curriculum-model-context';
import { useSingleBundleAssignment } from '../../../curriculum/delivery-models/contexts/use-bundle-assignments-context';
import { useBundleItemsContext } from '../../../curriculum/delivery-models/contexts/use-bundle-Items-context';
import { Listbox } from '@headlessui/react';
import { SchemaBundleKeyPrefix } from '../../../curriculum/delivery-models/[yearGroup]/bundles/bundle-editor';
import { OrganizationDto } from '../../../api/dtos/OrganizationDtoSchema';
import { useSelectiveContextDispatchBoolean } from '../../../components/selective-context/selective-context-manager-boolean';
import { UnsavedBundleAssignmentsKey } from '../../../curriculum/delivery-models/contexts/bundle-assignments-provider';
import {
  RenameModal,
  RenameModalProps,
  RenameModalWrapperContextKey
} from '../../../components/rename-modal/rename-modal';
import {
  ConfirmActionModalProps,
  useModal
} from '../../../components/confirm-action-modal';
import { useSelectiveContextControllerString } from '../../../components/selective-context/selective-context-manager-string';
import { useSelectiveContextKeyMemo } from '../../../components/selective-context/use-selective-context-listener';
import { useDirectSimRefEditsDispatch } from '../../editing/use-graph-edit-button-hooks';
import { GraphContext } from '../../graph/graph-context-creator';
import { UnsavedNodeDataContextKey } from './curriculum-delivery-graph';
import { resetLinks } from '../../editing/add-nodes-button';

import { sumAllSchemas } from '../../../curriculum/delivery-models/functions/sum-delivery-allocations';
import { SimulationNodeDatum } from 'd3';
import { HasNumberIdDto } from '../../../api/dtos/HasNumberIdDtoSchema';
import { HasNameDto } from '../../../api/dtos/HasNameDtoSchema';

export const EmptySchemasArray = [] as WorkProjectSeriesSchemaDto[];
const cellFormatting = 'px-2 text-xs';

export const LeftCol = 'text-xs w-full text-center h-full grid items-center';
export const CurriculumDetailsListenerKey = 'curriculum-details';

function useNodeNameEditing<T extends HasNumberIdDto & HasNameDto>(
  node: DataNode<T>,
  componentListenerKey: string
) {
  const { isOpen, closeModal, openModal } = useModal();
  const renameModalContextKey = useSelectiveContextKeyMemo(
    `${RenameModalWrapperContextKey}:${node.data.id}`,
    componentListenerKey
  );
  const { currentState, dispatchUpdate } = useSelectiveContextControllerString(
    renameModalContextKey,
    componentListenerKey,
    node.data.name
  );

  const { uniqueGraphName } = useContext(GraphContext);
  const unsavedGraphContextKey = useSelectiveContextKeyMemo(
    UnsavedNodeDataContextKey,
    uniqueGraphName
  );

  const {
    currentState: unsavedGraph,
    dispatchWithoutControl: dispatchUnsavedGraph
  } = useSelectiveContextDispatchBoolean(
    unsavedGraphContextKey,
    componentListenerKey,
    false
  );

  const { nodeListRef, incrementSimVersion, linkListRef } =
    useDirectSimRefEditsDispatch<OrganizationDto>(componentListenerKey);
  const handleConfirmRename = () => {
    if (nodeListRef && linkListRef) {
      // const copiedElements = [...nodeListRef.current];
      const currentElement = nodeListRef.current[node.index!];

      currentElement.data.name = currentState;
      const resetLinks1 = resetLinks(linkListRef.current);
      console.log(
        resetLinks1,
        currentElement,
        currentState,
        nodeListRef.current
      );
      linkListRef.current = resetLinks1;
      // nodeListRef.current = copiedElements;
      incrementSimVersion();
      dispatchUnsavedGraph(true);
    }

    closeModal();
  };

  const handleCancelRename = () => {
    dispatchUpdate({
      contextKey: renameModalContextKey,
      value: node.data.name
    });
    closeModal();
  };

  const renameModalProps: RenameModalProps & ConfirmActionModalProps = {
    contextKey: renameModalContextKey,
    onConfirm: handleConfirmRename,
    onCancel: handleCancelRename,
    onClose: closeModal,
    show: isOpen
  };

  return {
    openModal,
    renameModalProps
  };
}

export default function CurriculumDeliveryDetails({
  node
}: {
  node: DataNode<OrganizationDto>;
}) {
  const { assignmentOptional, removeAssignment, setAssignment } =
    useSingleBundleAssignment(node.id.toString());
  const { bundleItemsMap } = useBundleItemsContext();
  const { selectiveListenerKey, selectiveContextKey } = useMemo(() => {
    const selectiveContextKey = `${SchemaBundleKeyPrefix}${assignmentOptional}`;
    const selectiveListenerKey = `${selectiveContextKey}:${node.id}`;
    return { selectiveContextKey, selectiveListenerKey };
  }, [assignmentOptional, node]);
  const { curriculumModelsMap, dispatch } = useCurriculumModelContext();
  const { currentState: unsaved, dispatchWithoutControl } =
    useSelectiveContextDispatchBoolean(
      UnsavedBundleAssignmentsKey,
      selectiveListenerKey,
      false
    );

  const schemaIdList = useMemo(() => {
    if (assignmentOptional) {
      const bundleItemsMapElement = bundleItemsMap[assignmentOptional];
      return bundleItemsMapElement.workProjectSeriesSchemaIds;
    } else return [];
  }, [bundleItemsMap, assignmentOptional]);

  const { openModal, renameModalProps } = useNodeNameEditing(
    node,
    `${CurriculumDetailsListenerKey}:${node.id}`
  );

  const { schemas, bundleRowSpan } = useMemo(() => {
    const schemas = schemaIdList
      .map((schemaId) => {
        return curriculumModelsMap[schemaId];
      })
      .filter(isNotNull<WorkProjectSeriesSchemaDto>);
    const bundleRowSpan = `span ${Math.max(schemaIdList.length, 1)}`;
    if (schemas.length > 0) return { schemas, bundleRowSpan };
    // }
    // }
    return { schemas: EmptySchemasArray, bundleRowSpan: 'span 1' };
  }, [schemaIdList, curriculumModelsMap]);

  const totalAllocation = useMemo(() => sumAllSchemas(schemas), [schemas]);

  const elements = schemas.map((workProjectSeriesSchema) => {
    return (
      <CourseSummary
        key={`${node.data.id}-${workProjectSeriesSchema.id}`}
        course={workProjectSeriesSchema}
      />
    );
  });

  const handleAssignmentChange = (assignmentId: string) => {
    console.log('Expected assigment', assignmentId);
    setAssignment(assignmentId);
    dispatchWithoutControl(true);
  };

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-6 gap-1 mb-1'}>
        <div className={LeftCol}>Block:</div>
        <div className={'col-start-2 col-span-5'}>
          <button className={'btn btn-xs w-full'} onClick={openModal}>
            <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
            {node.data.name} - Total Periods: {totalAllocation}
          </button>
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(6, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${Math.max(
            elements.length,
            1
          )}, minmax(0, 1fr))`,
          marginBottom: '0.25rem'
        }}
      >
        <div
          className={LeftCol}
          style={{
            gridRow: bundleRowSpan
          }}
        >
          Bundle:
        </div>
        <div
          style={{
            gridColumn: `span 5`,
            gridRow: bundleRowSpan
          }}
        >
          <Listbox value={assignmentOptional} onChange={handleAssignmentChange}>
            <Listbox.Button className={'btn w-full h-full relative'}>
              <div>{...elements}</div>
            </Listbox.Button>
            <Listbox.Options
              className={
                'absolute z-10 w-60 bg-gray-50 translate-y-2 drop-shadow-xl rounded-lg p-1'
              }
            >
              {Object.entries(bundleItemsMap).map((bundle) => (
                <Listbox.Option
                  value={bundle[0]}
                  key={`bundle-${bundle[0]}`}
                  className={({ active }) =>
                    `w-full grid grid-cols-6 items-center ${
                      active ? 'bg-emerald-300' : ''
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={'flex justify-center w-full'}>
                        {selected ? (
                          <CheckIcon className={'w-5 h-5 '}></CheckIcon>
                        ) : null}
                      </span>
                      <span className={'col-span-5'}>
                        Bundle {bundle[1].id}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
      </div>
      <RenameModal {...renameModalProps} />
    </div>
  );
}

function CourseSummary({
  course
}: {
  course: WorkProjectSeriesSchemaDto;
}): React.JSX.Element {
  return (
    <div className={cellFormatting}>
      {course.workTaskType.name.substring(9)}, total periods:{' '}
      {course.deliveryAllocations
        .map((da) => da.count * da.deliveryAllocationSize)
        .reduce((prev, curr) => prev + curr, 0)}
    </div>
  );
}
