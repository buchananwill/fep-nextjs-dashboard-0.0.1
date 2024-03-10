'use client';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { AddNodesButton, CloneFunction } from '../editing/add-nodes-button';
import { DataNode } from '../../api/zod-mods';
import { DisclosureThatGrowsOpen } from '../../components/disclosures/disclosure-that-grows-open';
import AddLinksButton from '../editing/add-links-button';
import { DeleteNodesButton } from '../editing/delete-nodes-button';
import { DeleteLinksButton } from '../editing/delete-links-button';
import React from 'react';
import { useSelectiveContextListenerFunction } from '../../components/selective-context/selective-context-manager-function';
import { GenericFunction } from '../../components/selective-context/selective-context-creator';

export function FallBackCloneFunction<T extends HasNumberIdDto>(
  original: DataNode<T>
): DataNode<T> {
  const { data } = original;
  const clonedData = { ...data };
  const clone = { ...original, data: clonedData };
  return { ...original, data: clonedData };
}

export const NodeCloneFunctionKey = 'node-clone-function';

export function NodeEditorDisclosure<T extends HasNumberIdDto>({
  propCloneFunction
}: {
  propCloneFunction?: CloneFunction<DataNode<T>>;
}) {
  const {
    currentFunction: { function: cloneFunction }
  } = useSelectiveContextListenerFunction<DataNode<T>, DataNode<T>>(
    NodeCloneFunctionKey,
    'node-editor-disclosure',
    { function: FallBackCloneFunction }
  );

  return (
    <div className={'sticky -top-0 w-full flex flex-col bg-slate-50 z-10 '}>
      <div className={'h-2'}></div>
      <DisclosureThatGrowsOpen
        label={'Edit Nodes'}
        heightWhenOpen={'h-[6.5rem]'}
      >
        <div className={'w-full grid grid-cols-3 gap-1 relative mb-1'}>
          <AddNodesButton
            relation={'sibling'}
            cloneFunction={propCloneFunction || cloneFunction}
          >
            Add Sibling
          </AddNodesButton>
          <AddNodesButton
            relation={'child'}
            cloneFunction={propCloneFunction || cloneFunction}
          >
            Add Child
          </AddNodesButton>
          <AddLinksButton>Join Nodes</AddLinksButton>
        </div>
        <div className={'w-full grid grid-cols-2 gap-1 relative'}>
          <DeleteNodesButton>Delete Nodes</DeleteNodesButton>
          <DeleteLinksButton>Delete Links</DeleteLinksButton>
        </div>
      </DisclosureThatGrowsOpen>
      <div className={'h-2  border-t'}></div>
    </div>
  );
}
