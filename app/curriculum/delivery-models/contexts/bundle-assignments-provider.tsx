'use client';
import React, { PropsWithChildren } from 'react';
import {
  BundleAssignmentsContext,
  BundleAssignmentsContextDispatch
} from './use-bundle-assignments-context';
import {
  StringMap,
  useStringMapReducer
} from '../../../contexts/string-map-context/string-map-reducer';
import { useSelectiveContextControllerBoolean } from '../../../selective-context/components/typed/selective-context-manager-boolean';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

import { Text } from '@tremor/react';
import {
  ConfirmActionModal,
  useModal
} from '../../../generic/components/modals/confirm-action-modal';
import { WorkSeriesBundleAssignmentDto } from '../../../api/dtos/WorkSeriesBundleAssignmentDtoSchema';
import { useBundleItemsContext } from './use-bundle-Items-context';
import { putList } from '../../../api/READ-ONLY-generated-actions/WorkSeriesBundleAssignment';
import { getPayloadArray } from '../use-editing-context-dependency';

export function parseStringStringToIntInt(
  entry: [string, string]
): [number, number] {
  return [parseInt(entry[0]), parseInt(entry[1])];
}

export function applyStringKeysToIntValues(
  keyNames: [string, string],
  values: [number, number]
) {
  return { [keyNames[0]]: values[0], [keyNames[1]]: values[1] };
}

export const UnsavedBundleAssignmentsKey = 'bundle-assignments-unsaved';

const UnsavedBundleAssignmentsProvider = `${UnsavedBundleAssignmentsKey}:provider`;

export function BundleAssignmentsProvider({
  bundleAssignments,
  children
}: {
  bundleAssignments: StringMap<WorkSeriesBundleAssignmentDto>;
} & PropsWithChildren) {
  const [bundleAssignmentState, dispatch] =
    useStringMapReducer(bundleAssignments);

  const { currentState: unsavedChanges, dispatchUpdate } =
    useSelectiveContextControllerBoolean(
      UnsavedBundleAssignmentsKey,
      UnsavedBundleAssignmentsProvider,
      false
    );

  const { openModal, isOpen, closeModal } = useModal();
  const { bundleItemsMap } = useBundleItemsContext();

  const handleConfirm = () => {
    const curriedMapper = (numberTuple: [number, number]) => {
      return applyStringKeysToIntValues(['longOne', 'longTwo'], numberTuple);
    };
    const mappedAssignments = Object.values(bundleAssignmentState);

    putList(mappedAssignments).then((r) => {
      if (r.status < 300 && r.data) {
        const payloadArray = getPayloadArray(r.data, (assignmentDto) =>
          assignmentDto.organizationId.toString()
        );
        dispatch({ type: 'updateAll', payload: payloadArray });
        dispatchUpdate({
          contextKey: UnsavedBundleAssignmentsKey,
          update: false
        });
      }
    });
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <BundleAssignmentsContext.Provider value={bundleAssignmentState}>
      <BundleAssignmentsContextDispatch.Provider value={dispatch}>
        {children}
        {unsavedChanges && (
          <div
            className={
              'z-40 flex items-center border-gray-200 shadow-lg border-2 bg-gray-100 fixed top-16 right-16 p-2 rounded-md hover:bg-gray-50 group cursor-pointer'
            }
            onClick={() => openModal()}
          >
            Unsaved Ch-Ch-Changes{' '}
            <ExclamationTriangleIcon
              className={
                'p-1 h-8 w-8 text-red-500 group-hover:opacity-100 opacity-50 '
              }
            ></ExclamationTriangleIcon>
          </div>
        )}
        <ConfirmActionModal
          show={isOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        >
          <Text>
            Confirm changes to Curriculum Delivery Bundle Assignments?
          </Text>
        </ConfirmActionModal>
      </BundleAssignmentsContextDispatch.Provider>
    </BundleAssignmentsContext.Provider>
  );
}
