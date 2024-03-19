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

export default function WorkTaskTypeDtoDetails({
  node
}: {
  node: DataNode<WorkTaskTypeDto>;
}) {
  const nodeContext = useContext(GenericNodeContext);
  const linkContext = useContext(GenericLinkContext);
  const nodes = (nodeContext?.nodes as DataNode<WorkTaskTypeDto>[]) || [];
  const links = (linkContext?.links as DataLink<WorkTaskTypeDto>[]) || [];
  const useModal1 = useModal();

  const noTransformation = {};

  return (
    <div className={'mt-1'}>
      <div className={'grid grid-cols-6 gap-1 mb-1'}>
        <div className={LeftCol}>Block:</div>
        <div className={'col-start-2 col-span-5'}>
          <RenameButton></RenameButton>
        </div>
      </div>
    </div>
  );
}
