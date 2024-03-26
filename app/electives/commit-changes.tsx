'use client';
import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  useTransition
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { updateElectiveAssignments } from './api/request-elective-preferences';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import { StandardTooltipContentOld } from '../generic/components/tooltips/standard-tooltip-content-old';
import {
  ConfirmActionModal,
  useModal
} from '../components/modals/confirm-action-modal';

import { UpdateElectivePreference } from './elective-reducers';
import { ElectivePreferenceDTO } from '../api/dtos/ElectivePreferenceDTOSchema';

interface Props {
  children: React.ReactNode;
}

const CommitChanges = ({ children }: Props) => {
  const [transitionPending, startTransition] = useTransition();
  const [commitPending, setCommitPending] = useState(false);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { showTooltips } = useContext(TooltipsContext);
  let { isOpen, closeModal, openModal } = useModal();
  const electiveState = useContext(ElectiveContext);
  const [enabled, setEnabled] = useState(false);
  const { modifiedPreferences } = electiveState;

  useEffect(() => {
    for (let modifiedPreference of modifiedPreferences) {
      if (modifiedPreference[1].size > 0) {
        setEnabled(true);
        break;
      } else {
        setEnabled(false);
      }
    }
  }, [setEnabled, modifiedPreferences]);

  const dispatch = useContext(ElectiveDispatchContext);

  const assignmentConflictCount = useSearchParams()?.get('assignmentConflict');

  const conflictCountInt =
    assignmentConflictCount && parseInt(assignmentConflictCount);

  async function handleCommitClick() {
    setCommitPending(true);

    const response = await updateElectiveAssignments(electiveState);
    if (response) {
      const updatedAssignments: ElectivePreferenceDTO[] = await response.json();
      updatedAssignments.forEach((preference) => {
        const dispatchRequest: UpdateElectivePreference = {
          type: 'updateElectivePreference',
          electivePreference: preference
        };
        dispatch(dispatchRequest);
      });
    }

    setCommitPending(false);

    dispatch({
      type: 'clearModifications'
    });

    // replace(redirectUrl, { scroll: false });
  }

  const spinner =
    commitPending || transitionPending ? (
      <span className="absolute loading loading-spinner loading-lg"></span>
    ) : (
      <></>
    );

  return (
    <div className="indicator mx-2">
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <button
            className={`btn normal-case`}
            disabled={!enabled}
            onClick={() => openModal()}
          >
            {!enabled && conflictCountInt && (
              <span className="indicator-item badge badge-error">
                {conflictCountInt}
              </span>
            )}
            {children}
            {spinner}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <StandardTooltipContentOld>
            Submit all unsaved edits to the database.
          </StandardTooltipContentOld>
        </TooltipContent>
      </Tooltip>
      <ConfirmActionModal
        show={isOpen}
        onClose={closeModal}
        onConfirm={() => {
          closeModal();
          handleCommitClick();
        }}
        onCancel={() => {
          closeModal();
        }}
      >
        <p>Commit changes to the database</p>
      </ConfirmActionModal>
    </div>
  );
};

export default CommitChanges;
