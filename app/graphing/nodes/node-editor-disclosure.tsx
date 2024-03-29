'use client';
import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { AddNodesButton } from '../editing/buttons/add-nodes-button';
import { DataNode } from '../../api/zod-mods';

import AddLinksButton from '../editing/buttons/add-links-button';
import { DeleteNodesButton } from '../editing/buttons/delete-nodes-button';
import { DeleteLinksButton } from '../editing/buttons/delete-links-button';
import React from 'react';
import { useSelectiveContextListenerFunction } from '../../selective-context/components/typed/selective-context-manager-function';
import InvertLinksButton from '../editing/buttons/invert-links-button';
import { DisclosureThatGrowsOpen } from '../../generic/components/disclosures/disclosure-that-grows-open';
import { CloneFunction } from '../editing/buttons/clone-function';

export function FallBackCloneFunction<T extends HasNumberIdDto>(
  original: DataNode<T>
): DataNode<T> {
  const { data } = original;
  const clonedData = { ...data };
  return { ...original, data: clonedData };
}

export const NodeCloneFunctionKey = 'node-clone-function';

export const ListenerKey = 'node-editor-disclosure';

export const ShowNodeEditingKey = 'show-node-editing';

export function NodeEditorDisclosure<T extends HasNumberIdDto>({}: {
  propCloneFunction?: CloneFunction<DataNode<T>>;
}) {
  const {
    currentFunction: { cachedFunction: cloneFunction }
  } = useSelectiveContextListenerFunction<DataNode<T>, DataNode<T>>(
    NodeCloneFunctionKey,
    ListenerKey,
    { cachedFunction: FallBackCloneFunction }
  );

  // const { isTrue: showNodeEditing } = useSelectiveContextListenerBoolean(
  //   ShowNodeEditingKey,
  //   ListenerKey,
  //   false
  // );
  //
  //

  return (
    <div className={'sticky -top-0 w-full flex flex-col bg-slate-50 z-10 '}>
      <div className={'h-2'}></div>
      <DisclosureThatGrowsOpen
        label={'Edit Graph'}
        heightWhenOpen={'h-[9.5rem]'}
      >
        <div className={'w-full grid grid-cols-2 gap-1 relative mb-1'}>
          <AddNodesButton relation={'sibling'} cloneFunction={cloneFunction}>
            Add Sibling
          </AddNodesButton>
          <AddNodesButton relation={'child'} cloneFunction={cloneFunction}>
            Add Child
          </AddNodesButton>
        </div>
        <div className={'w-full grid grid-cols-2 gap-1 relative mb-1'}>
          <AddLinksButton>Add Links</AddLinksButton>
          <InvertLinksButton>Invert Links</InvertLinksButton>
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
