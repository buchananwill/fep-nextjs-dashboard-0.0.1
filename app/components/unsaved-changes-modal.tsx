import {
  ConfirmActionModal,
  ConfirmActionModalProps
} from './confirm-action-modal';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import React from 'react';

export interface UnsavedChangesProps {
  unsavedChanges: boolean;
  handleOpen: () => void;
}

export function UnsavedChangesModal({
  handleOpen,
  unsavedChanges,
  children,
  ...modalProps
}: UnsavedChangesProps & ConfirmActionModalProps) {
  return (
    <>
      {unsavedChanges && (
        <div
          className={
            'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-0 rounded-md hover:bg-gray-50 group cursor-pointer'
          }
        >
          <button onClick={handleOpen} className={'flex items-center p-2'}>
            Unsaved Ch-Ch-Changes{' '}
            <ExclamationTriangleIcon
              className={
                'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
              }
            ></ExclamationTriangleIcon>
          </button>
        </div>
      )}
      <ConfirmActionModal {...modalProps}>
        {children ? children : <p>Save changes to database?</p>}
      </ConfirmActionModal>
    </>
  );
}
