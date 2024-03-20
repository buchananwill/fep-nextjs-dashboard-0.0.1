'use client';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { ProductComponentStateDto } from '../../../api/dtos/ProductComponentStateDtoSchema';
import React, { Fragment, PropsWithChildren, useContext } from 'react';
import { GenericNodeContext } from '../../nodes/generic-node-context-creator';
import { GenericLinkContext } from '../../links/generic-link-context-creator';
import { index } from 'd3';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import {
  LeftCol,
  NodeDetailsListBoxButton,
  NodeDetailsListBoxOption,
  NodeDetailsListBoxOptions
} from '../organization/curriculum-delivery-details';
import { RenameButton } from '../../../components/buttons/rename-button';
import { RenameModal } from '../../../components/rename-modal/rename-modal';
import { useModal } from '../../../components/confirm-action-modal';
import { useNodeNameEditing } from '../../editing/functions/use-node-name-editing';
import { useServiceCategoryContext } from '../../../work-types/lessons/use-service-category-context';
import { node } from 'prop-types';
import { Listbox } from '@headlessui/react';

const WorkTaskTypeDtoDetailsListenerKey = 'work-task-type-details';

function ColumnOne({ children }: PropsWithChildren) {
  return <div className={LeftCol}>{children}</div>;
}

function ColumnsTwoToFour({ children }: PropsWithChildren) {
  return <div className={'col-start-2 col-span-3'}>{children}</div>;
}

export default function WorkTaskTypeDtoDetails({
  node
}: {
  node: DataNode<WorkTaskTypeDto>;
}) {
  const { id, data } = node;
  const {
    name,
    serviceCategoryKnowledgeDomainDescriptor,
    serviceCategoryKnowledgeLevelDescriptor,
    knowledgeDomainId,
    knowledgeLevelId
  } = data;
  const listenerKey = `${WorkTaskTypeDtoDetailsListenerKey}:${id}`;
  const { openModal, renameModalProps } = useNodeNameEditing(node, listenerKey);
  const { domainMap, levelMap } = useServiceCategoryContext();

  const handleKnowledgeDomainChange = (id: string) => {
    console.log('New id:', id);
  };

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-3 gap-1 mb-1'}>
        <ColumnOne>Name:</ColumnOne>
        <ColumnsTwoToFour>
          <button
            onClick={openModal}
            className={'btn text-xs w-full overflow-hidden flex flex-nowrap'}
          >
            <span className={' truncate ...'}>{node.data.name}</span>
            <PencilSquareIcon className={'h-4 w-4'}></PencilSquareIcon>
          </button>
        </ColumnsTwoToFour>
        <ColumnOne>{serviceCategoryKnowledgeDomainDescriptor}</ColumnOne>
        <ColumnsTwoToFour>
          <Listbox
            value={knowledgeDomainId.toString()}
            onChange={handleKnowledgeDomainChange}
          >
            <Listbox.Button as={NodeDetailsListBoxButton}>
              {domainMap[knowledgeDomainId.toString()].name}
            </Listbox.Button>
            <Listbox.Options
              as={NodeDetailsListBoxOptions}
              optionsWidth={'w-60'}
            >
              {Object.values(domainMap).map((kD) => (
                <Listbox.Option
                  value={kD.id.toString()}
                  key={`kDomain-${kD.id.toString()}`}
                  as={Fragment}
                >
                  {({ selected, active }) => (
                    <NodeDetailsListBoxOption
                      selected={selected}
                      active={active}
                    >
                      {kD.name}
                    </NodeDetailsListBoxOption>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </ColumnsTwoToFour>
      </div>
      <RenameModal {...renameModalProps} />
    </div>
  );
}
