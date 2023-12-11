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
import { ElectiveContext } from './elective-context';
import { updateElectiveAssignments } from '../api/request-elective-preferences';
import { revalidateTag } from 'next/cache';
import { CacheSetting } from '../components/refresh-dropdown';
import { Dialog, Transition } from '@headlessui/react';
import TooltipsContext from '../components/tooltips/tooltips-context';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '../components/tooltips/tooltip';
import { StandardTooltipContent } from '../components/tooltips/standard-tooltip-content';

interface Props {
  children: React.ReactNode;
}

const CommitChanges = ({ children }: Props) => {
  const [transitionPending, startTransition] = useTransition();
  const [commitPending, setCommitPending] = useState(false);
  const [error, setError] = useState(null);
  const { replace } = useRouter();
  const pathname = usePathname();
  let [isOpen, setIsOpen] = useState(false);
  const { showTooltips } = useContext(TooltipsContext);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

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
      <Tooltip>
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Commit Changes
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Commit changes to the database?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <span></span>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-200 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModal();
                        handleCommitClick();
                      }}
                    >
                      Confirm
                    </button>
                    <span></span>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-200 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      Cancel
                    </button>
                    <span></span>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CommitChanges;
