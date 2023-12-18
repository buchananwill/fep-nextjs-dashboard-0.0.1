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
import TooltipsContext from '../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import { StandardTooltipContent } from '../components/tooltips/standard-tooltip-content';
import { ConfirmationModal, useModal } from '../components/confirmation-modal';
import { ElectivePreferenceDTO } from '../api/dto-interfaces';
import { UpdateElectivePreference } from './elective-reducers';
import { router } from 'next/client';
import { el } from 'date-fns/locale';

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

    // const params = new URLSearchParams(window.location.search);

    // params.delete('unsaved');
    // params.set('cacheSetting', 'reload');
    // const redirectUrl = `${pathname}?${params.toString()}`;

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
          <StandardTooltipContent>
            Submit all unsaved edits to the database.
          </StandardTooltipContent>
        </TooltipContent>
      </Tooltip>
      <ConfirmationModal
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
      </ConfirmationModal>
    </div>
  );
};

export default CommitChanges;
