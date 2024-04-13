'use client';
import { DataNode } from '../api/zod-mods';
import { AssetDto } from '../api/dtos/AssetDtoSchema';
import { Button } from '@nextui-org/button';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import React from 'react';
import { LeftCol } from '../graphing/graph-types/organization/curriculum-delivery-details';
import { useNodeNameEditing } from '../graphing/editing/functions/use-node-name-editing';
import RenameModal from '../generic/components/modals/rename-modal';

export default function PremisesDetails({
  node
}: {
  node: DataNode<AssetDto>;
}) {
  const { openModal, renameModalProps } = useNodeNameEditing(
    node,
    `asset:${node.id}:details`
  );

  return (
    <div className={'grid grid-cols-6 gap-1 mb-1'}>
      <div className={LeftCol}>Block:</div>
      <div className={'col-start-2 col-span-5'}>
        <Button className={'w-full '} onClick={openModal} size={'sm'}>
          <PencilSquareIcon className={'w-4 h-4'}></PencilSquareIcon>
          {node.data.name}
        </Button>
      </div>
      <RenameModal {...renameModalProps} />
    </div>
  );
}
