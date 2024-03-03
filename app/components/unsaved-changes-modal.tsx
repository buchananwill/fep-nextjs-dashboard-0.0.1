import {
  ConfirmActionModal,
  ConfirmActionModalProps
} from './confirm-action-modal';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import React from 'react';

export function UnsavedChangesModal({
  handleOpen,
  unsavedChanges,
  children,
  ...modalProps
}: {
  unsavedChanges: boolean;
  handleOpen: () => void;
} & ConfirmActionModalProps) {
  return (
    <>
      {unsavedChanges && (
        <div
          className={
            'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
          }
          onClick={handleOpen}
        >
          Unsaved Ch-Ch-Changes{' '}
          <ExclamationTriangleIcon
            className={
              'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
            }
          ></ExclamationTriangleIcon>
        </div>
      )}
      <ConfirmActionModal {...modalProps}>
        {children ? children : <p>Save changes to database?</p>}
      </ConfirmActionModal>
    </>
  );
}
