import React, { PropsWithChildren } from 'react';
import { LeftCol } from '../organization/curriculum-delivery-details';
import { DataNode } from '../../../api/zod-mods';
import { WorkTaskTypeDto } from '../../../api/dtos/WorkTaskTypeDtoSchema';
import { useNodeNameEditing } from '../../editing/functions/use-node-name-editing';
import { Button } from '@nextui-org/button';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import RenameModal from '../../../generic/components/modals/rename-modal';

export const WorkTaskTypeDtoDetailsListenerKey = 'work-task-type-details';

export function ColumnOne({ children }: PropsWithChildren) {
  return <div className={LeftCol}>{children}</div>;
}

export function ColumnsTwoToFour({ children }: PropsWithChildren) {
  return <div className={'col-start-2 col-span-3'}>{children}</div>;
}

export function RenameWorkTaskType({
  node
}: {
  node: DataNode<WorkTaskTypeDto>;
}) {
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
        <Button
          onClick={openModal}
          className={'text-xs w-full overflow-hidden flex flex-nowrap'}
        >
          <span className={' truncate ...'}>{name}</span>
          <PencilSquareIcon className={'h-4 w-4'}></PencilSquareIcon>
        </Button>
      </ColumnsTwoToFour>
      <RenameModal {...renameModalProps} />
    </>
  );
}
