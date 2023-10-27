'use client';
import React, { useContext } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Fragment, useState, useTransition } from 'react';
import { ElectivesContext } from './electives-context';
import { updateElectiveAssignments } from '../api/request-elective-preferences';

interface Props {
  children: React.ReactNode;
}

const CommitChanges = ({ children }: Props) => {
  const disabled = useSearchParams()?.get('unsaved') !== 'true';

  const electivePreferences = useContext(ElectivesContext);

  const assignmentConflictCount = useSearchParams()?.get('assignmentConflict');

  const conflictCountInt =
    assignmentConflictCount && parseInt(assignmentConflictCount);

  async function handleCommitClick() {
    const updated = await updateElectiveAssignments(electivePreferences);
    console.log('Now updated:', updated);
  }

  return (
    <div className="indicator mx-2">
      <button
        className="btn normal-case"
        disabled={disabled}
        onClick={() => handleCommitClick()}
      >
        {!disabled && conflictCountInt && (
          <span className="indicator-item badge badge-error">
            {conflictCountInt}
          </span>
        )}
        {children}
      </button>
    </div>
  );
};

export default CommitChanges;
