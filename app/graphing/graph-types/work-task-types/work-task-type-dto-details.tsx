'use client';
import { DataLink, DataNode } from '../../../api/zod-mods';
import { ProductComponentStateDto } from '../../../api/dtos/ProductComponentStateDtoSchema';
import React, { useContext } from 'react';
import { GenericNodeContext } from '../../nodes/generic-node-context-creator';
import { GenericLinkContext } from '../../links/generic-link-context-creator';
import { index } from 'd3';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { LeftCol } from '../organization/curriculum-delivery-details';
import { RenameButton } from '../../../components/buttons/rename-button';
import { RenameModal } from '../../../components/rename-modal/rename-modal';
import { useModal } from '../../../components/confirm-action-modal';
import { useNodeNameEditing } from '../../editing/functions/use-node-name-editing';

const WorkTaskTypeDtoDetailsListenerKey = 'work-task-type-details';

export default function WorkTaskTypeDtoDetails({
  node
}: {
  node: DataNode<WorkTaskTypeDto>;
}) {
  const { id } = node;
  const listenerKey = `${WorkTaskTypeDtoDetailsListenerKey}:${id}`;
  const { openModal, renameModalProps } = useNodeNameEditing(node, listenerKey);

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-6 gap-1 mb-1'}>
        <div className={LeftCol}>Name:</div>
        <div className={'col-start-2 col-span-5'}>
          <button
            onClick={openModal}
            className={'btn btn-ghost text-xs w-full btn-sm'}
          >
            {node.data.name}
            <PencilSquareIcon className={'h-4 w-4'}></PencilSquareIcon>
          </button>
        </div>
      </div>
      <RenameModal {...renameModalProps} />
    </div>
  );
}
