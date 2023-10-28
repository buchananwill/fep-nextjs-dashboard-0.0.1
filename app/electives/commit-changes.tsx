'use client';
import React, { useContext } from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
  redirect,
  RedirectType
} from 'next/navigation';
import { Fragment, useState, useTransition } from 'react';
import { ElectivesContext } from './electives-context';
import { updateElectiveAssignments } from '../api/request-elective-preferences';
import { revalidateTag } from 'next/cache';
import { CacheSetting } from '../components/refresh-dropdown';

interface Props {
  children: React.ReactNode;
}

const CommitChanges = ({ children }: Props) => {
  const [transitionPending, startTransition] = useTransition();
  const [commitPending, setCommitPending] = useState(false);
  const [error, setError] = useState(null);
  const { refresh, replace } = useRouter();
  const pathname = usePathname();

  const disabled = useSearchParams()?.get('unsaved') !== 'true';

  const electivePreferences = useContext(ElectivesContext);

  const assignmentConflictCount = useSearchParams()?.get('assignmentConflict');

  const conflictCountInt =
    assignmentConflictCount && parseInt(assignmentConflictCount);

  async function handleCommitClick() {
    setCommitPending(true);

    const params = new URLSearchParams(window.location.search);

    params.delete('unsaved');
    params.set('cacheSetting', 'reload');
    const redirectUrl = `${pathname}?${params.toString()}`;

    updateElectiveAssignments(electivePreferences)
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

  const spinner = transitionPending ? (
    <span className="absolute loading loading-spinner loading-lg"></span>
  ) : (
    <></>
  );

  return (
    <div className="indicator mx-2">
      <button
        className={`btn normal-case`}
        disabled={disabled}
        onClick={() => handleCommitClick()}
      >
        {!disabled && conflictCountInt && (
          <span className="indicator-item badge badge-error">
            {conflictCountInt}
          </span>
        )}
        {children}
        {spinner}
      </button>
    </div>
  );
};

export default CommitChanges;
