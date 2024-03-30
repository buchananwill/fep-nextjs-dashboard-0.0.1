'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ElectiveContext, ElectiveDispatchContext } from './elective-context';
import { updateElectiveAssignments } from './api/update-elective-preferences';
import TooltipsContext from '../generic/components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../generic/components/tooltips/tooltip';
import { StandardTooltipContentOld } from '../generic/components/tooltips/standard-tooltip-content-old';

import { UpdateElectivePreference } from './elective-reducers';
import {
  ConfirmActionModal,
  useModal
} from '../generic/components/modals/confirm-action-modal';
import { Button } from '@nextui-org/button';

interface Props {
  children: React.ReactNode;
}

const CommitChanges = ({ children }: Props) => {
  const [commitPending, setCommitPending] = useState(false);

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

  async function handleCommitClick() {
    setCommitPending(true);

    const response = await updateElectiveAssignments(electiveState);

    response.forEach((preference) => {
      const dispatchRequest: UpdateElectivePreference = {
        type: 'updateElectivePreference',
        electivePreference: preference
      };
      dispatch(dispatchRequest);
    });
    if (response.length > 0) {
      setCommitPending(false);
      dispatch({
        type: 'clearModifications'
      });
    } else console.error('No update information in response.');
  }

  const spinner = commitPending ? (
    <span className="absolute loading loading-spinner loading-lg"></span>
  ) : (
    <></>
  );

  return (
    <>
      <Tooltip enabled={showTooltips}>
        <TooltipTrigger>
          <Button
            isDisabled={!enabled}
            color={'default'}
            onClick={() => openModal()}
          >
            {children}
            {spinner}
          </Button>
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
    </>
  );
};

export default CommitChanges;
