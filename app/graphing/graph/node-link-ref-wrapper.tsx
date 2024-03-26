'use client';
import React, { PropsWithChildren } from 'react';
import { DataLink, DataNode } from '../../api/zod-mods';
import { GenericNodeRefContext } from '../nodes/generic-node-context-creator';
import { GenericLinkRefContext } from '../links/generic-link-context-creator';
import { GraphViewer } from './graph-viewer';

import { HasNumberIdDto } from '../../api/dtos/HasNumberIdDtoSchema';
import { UnsavedChangesModal } from '../../generic/components/modals/unsaved-changes-modal';

export interface UnsavedNodeChangesProps {
  unsavedChanges: boolean;
  handleOpen: () => void;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NodeLinkRefWrapper<T extends HasNumberIdDto>({
  unsavedNodeChangesProps,
  textList,
  titleList,
  nodeListRef,
  linkListRef,
  children
}: {
  nodeListRef: React.MutableRefObject<DataNode<T>[]>;
  linkListRef: React.MutableRefObject<DataLink<T>[]>;
  textList: string[];
  titleList: string[];
  unsavedNodeChangesProps?: UnsavedNodeChangesProps;
} & PropsWithChildren) {
  return (
    <GenericNodeRefContext.Provider value={nodeListRef}>
      <GenericLinkRefContext.Provider value={linkListRef}>
        <div className={'flex-col'}>
          <GraphViewer textList={textList} titleList={titleList}>
            {children}
          </GraphViewer>
        </div>
        {unsavedNodeChangesProps && (
          <UnsavedChangesModal {...unsavedNodeChangesProps}>
            <p>Save graph changes to database?</p>
          </UnsavedChangesModal>
        )}
      </GenericLinkRefContext.Provider>
    </GenericNodeRefContext.Provider>
  );
}
