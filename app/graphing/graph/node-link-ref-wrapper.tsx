import React, { PropsWithChildren } from 'react';
import { DataLink, DataNode } from '../../api/zod-mods';
import { OrganizationDto } from '../../api/dtos/OrganizationDtoSchema';
import { GenericNodeRefContext } from '../nodes/generic-node-context-creator';
import { GenericLinkRefContext } from '../links/generic-link-context-creator';
import { GraphViewer } from './graph-viewer';
import { UnsavedChangesModal } from '../../components/unsaved-changes-modal';

export function NodeLinkRefWrapper({
  handleOpen,
  onClose,
  onConfirm,
  show,
  textList,
  titleList,
  unsavedChanges,
  nodeListRef,
  linkListRef,
  children
}: {
  nodeListRef: React.MutableRefObject<DataNode<OrganizationDto>[]>;
  linkListRef: React.MutableRefObject<DataLink<OrganizationDto>[]>;
  textList: string[];
  titleList: string[];
  unsavedChanges: boolean;
  handleOpen: () => void;
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
} & PropsWithChildren) {
  return (
    <GenericNodeRefContext.Provider value={nodeListRef}>
      <GenericLinkRefContext.Provider value={linkListRef}>
        <div className={'flex-col'}>
          <GraphViewer textList={textList} titleList={titleList}>
            {children}
          </GraphViewer>
        </div>
        <UnsavedChangesModal
          unsavedChanges={unsavedChanges}
          handleOpen={handleOpen}
          show={show}
          onClose={onClose}
          onConfirm={onConfirm}
          onCancel={onClose}
        >
          <p>Save graph changes to database?</p>
        </UnsavedChangesModal>
      </GenericLinkRefContext.Provider>
    </GenericNodeRefContext.Provider>
  );
}
