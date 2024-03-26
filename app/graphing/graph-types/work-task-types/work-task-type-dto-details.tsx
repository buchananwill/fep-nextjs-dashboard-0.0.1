'use client';
import { DataNode } from '../../../api/zod-mods';
import React, { Fragment, PropsWithChildren } from 'react';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import {
  LeftCol,
  NodeDetailsListBoxButton,
  NodeDetailsListBoxOption,
  NodeDetailsListBoxOptions
} from '../organization/curriculum-delivery-details';

import { useNodeNameEditing } from '../../editing/functions/use-node-name-editing';
import { useServiceCategoryContext } from '../../../work-types/lessons/use-service-category-context';
import { Listbox } from '@headlessui/react';
import { StringMap } from '../../../contexts/string-map-context/string-map-reducer';
import { useDirectSimRefEditsDispatch } from '../../editing/functions/use-graph-edit-button-hooks';
import { RenameModal } from '../../../generic/components/modals/rename-modal';

const WorkTaskTypeDtoDetailsListenerKey = 'work-task-type-details';

function ColumnOne({ children }: PropsWithChildren) {
  return <div className={LeftCol}>{children}</div>;
}

function ColumnsTwoToFour({ children }: PropsWithChildren) {
  return <div className={'col-start-2 col-span-3'}>{children}</div>;
}

function RenameWorkTaskType({ node }: { node: DataNode<WorkTaskTypeDto> }) {
  const {
    id,
    data: { name }
  } = node;
  const listenerKey = `${WorkTaskTypeDtoDetailsListenerKey}:${id}`;
  const { openModal, renameModalProps } = useNodeNameEditing(node, listenerKey);
  return (
    <>
      <ColumnOne>Name:</ColumnOne>
      <ColumnsTwoToFour>
        <button
          onClick={openModal}
          className={'btn text-xs w-full overflow-hidden flex flex-nowrap'}
        >
          <span className={' truncate ...'}>{name}</span>
          <PencilSquareIcon className={'h-4 w-4'}></PencilSquareIcon>
        </button>
      </ColumnsTwoToFour>
      <RenameModal {...renameModalProps} />
    </>
  );
}

export default function WorkTaskTypeDtoDetails({
  node
}: {
  node: DataNode<WorkTaskTypeDto>;
}) {
  const { id, data } = node;
  const {
    serviceCategoryKnowledgeDomainDescriptor,
    serviceCategoryKnowledgeLevelDescriptor,
    knowledgeDomainId,
    knowledgeLevelId
  } = data;

  const { domainMap, levelMap } = useServiceCategoryContext();
  const editListenerKey = `${WorkTaskTypeDtoDetailsListenerKey}-${id}`;

  const { incrementSimVersion, nodeListRef } =
    useDirectSimRefEditsDispatch<WorkTaskTypeDto>(editListenerKey);

  const handleKnowledgeDomainChange = (domainId: string) => {
    const updatedDomain = domainMap[domainId];
    if (nodeListRef === null) return;
    const find = nodeListRef.current.find((n) => n.id === id);
    if (find === undefined) return;
    find.data.knowledgeDomainId = updatedDomain.id;
    find.data.knowledgeDomainName = updatedDomain.name;
    incrementSimVersion();
  };
  const handleKnowledgeLevelChange = (id: string) => {
    console.log('(Not implemented) New id:', id);
  };

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-3 gap-1 mb-1'}>
        <RenameWorkTaskType node={node} />
        <AssignItemFromObjectEntries
          itemDescriptor={serviceCategoryKnowledgeDomainDescriptor}
          currentAssignment={knowledgeDomainId.toString()}
          onChange={handleKnowledgeDomainChange}
          optionsMap={domainMap}
          labelAccessor={(kd) => kd.name}
          idAccessor={(kd) => kd.id.toString()}
        />
        <AssignItemFromObjectEntries
          itemDescriptor={serviceCategoryKnowledgeLevelDescriptor}
          currentAssignment={knowledgeLevelId.toString()}
          onChange={handleKnowledgeLevelChange}
          optionsMap={levelMap}
          labelAccessor={(kl) => kl.name}
          idAccessor={(kl) => kl.id.toString()}
        />
      </div>
    </div>
  );
}

function AssignItemFromObjectEntries<T>({
  itemDescriptor,
  currentAssignment,
  onChange,
  optionsMap,
  labelAccessor,
  idAccessor
}: {
  itemDescriptor: string;
  currentAssignment: string;
  onChange: (value: string) => void;
  optionsMap: StringMap<T>;
  labelAccessor: (item: T) => string;
  idAccessor: (item: T) => string;
}) {
  return (
    <>
      <ColumnOne>{itemDescriptor}</ColumnOne>
      <ColumnsTwoToFour>
        <Listbox value={currentAssignment} onChange={onChange}>
          <Listbox.Button as={NodeDetailsListBoxButton}>
            {labelAccessor(optionsMap[currentAssignment])}
          </Listbox.Button>
          <Listbox.Options as={NodeDetailsListBoxOptions} optionsWidth={'w-60'}>
            {Object.values(optionsMap).map((option) => (
              <Listbox.Option
                value={idAccessor(option)}
                key={`${itemDescriptor}-${idAccessor(option)}`}
                as={Fragment}
              >
                {({ selected, active }) => (
                  <NodeDetailsListBoxOption selected={selected} active={active}>
                    {labelAccessor(option)}
                  </NodeDetailsListBoxOption>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </ColumnsTwoToFour>
    </>
  );
}
