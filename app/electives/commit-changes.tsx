'use client';
import React, { Fragment, useContext, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ElectiveContext } from './elective-context';
import { updateElectiveAssignments } from './api/request-elective-preferences';
import TooltipsContext from '../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import { StandardTooltipContent } from '../components/tooltips/standard-tooltip-content';
import { ConfirmationModal, useModal } from '../components/confirmation-modal';

interface Props {
  children: React.ReactNode;
}

const CommitChanges = ({ children }: Props) => {
  const [transitionPending, startTransition] = useTransition();
  const [commitPending, setCommitPending] = useState(false);
  const [error, setError] = useState(null);
  const { replace } = useRouter();
  const pathname = usePathname();
  const { showTooltips } = useContext(TooltipsContext);
  let { isOpen, closeModal, openModal } = useModal();

  const disabled = useSearchParams()?.get('unsaved') !== 'true';

  const electiveState = useContext(ElectiveContext);

  const assignmentConflictCount = useSearchParams()?.get('assignmentConflict');

  const conflictCountInt =
    assignmentConflictCount && parseInt(assignmentConflictCount);

  async function handleCommitClick() {
    setCommitPending(true);

    const params = new URLSearchParams(window.location.search);

    params.delete('unsaved');
    params.set('cacheSetting', 'reload');
    const redirectUrl = `${pathname}?${params.toString()}`;

    updateElectiveAssignments(electiveState)
      .then(() => {
        setCommitPending(false);
      })
      .then(() => {
        startTransition(() => {
          replace(redirectUrl);
        });
      })
      .catch((error) => {
        setError(error);
        setCommitPending(false);
      })
      .finally(() => {
        params.delete('cacheSetting');
        const finalRedirect = `${pathname}?${params.toString()}`;
        replace(finalRedirect);
      });
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
            disabled={disabled || commitPending}
            onClick={() => openModal()}
          >
            {!disabled && conflictCountInt && (
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
