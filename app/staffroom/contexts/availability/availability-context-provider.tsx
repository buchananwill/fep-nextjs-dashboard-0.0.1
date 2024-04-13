'use client';
import { ReactNode, useReducer } from 'react';
import {
  AvailabilityContext,
  AvailabilityContextInterface,
  AvailabilityDispatchContext
} from './availability-context';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import availabilityReducer from './availability-reducer';
import { updateAvailabilities } from '../../../api/actions/custom/availability';
import {
  ConfirmActionModal,
  ConfirmActionModalProps,
  useModal
} from '../../../generic/components/modals/confirm-action-modal';

export default function AvailabilityContextProvider({
  children,
  initialData
}: {
  children: ReactNode;
  initialData: AvailabilityContextInterface;
}) {
  const [reducerState, dispatch] = useReducer(availabilityReducer, initialData);
  const { unsavedChanges } = reducerState;
  const { show, openModal, onClose } = useModal();

  const confirmChanges = () => {
    const { providerAvailability } = reducerState;

    updateAvailabilities(providerAvailability).then((r) => {
      if (r.status >= 200 && r.status <= 300) {
        console.log('(Success!');
        dispatch({ type: 'clearUnsavedAvailability' });
      } else {
        console.log('(Not implemented) Failure...');
      }
    });
    onClose();
  };

  const cancelChanges = () => {
    dispatch({ type: 'setAvailabilityData', data: initialData });
    dispatch({ type: 'clearUnsavedAvailability' });
    onClose();
  };

  const contextForModal: ConfirmActionModalProps = {
    show: show,
    onConfirm: confirmChanges,
    onCancel: cancelChanges,
    onClose: onClose
  };

  const dispatchContext = {
    dispatch: dispatch
  };

  return (
    <AvailabilityContext.Provider value={reducerState}>
      <AvailabilityDispatchContext.Provider value={dispatchContext}>
        {children}
        {unsavedChanges && (
          <div
            className={
              'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
            }
            onClick={() => openModal()}
          >
            Unsaved Changes{' '}
            <ExclamationTriangleIcon
              className={
                'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
              }
            ></ExclamationTriangleIcon>
          </div>
        )}
        <ConfirmActionModal title={'Confirm Changes'} {...contextForModal}>
          <div>Send updated availability to database?</div>
        </ConfirmActionModal>
      </AvailabilityDispatchContext.Provider>
    </AvailabilityContext.Provider>
  );
}
