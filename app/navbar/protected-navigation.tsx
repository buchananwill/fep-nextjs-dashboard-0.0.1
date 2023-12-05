import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { classNames } from '../utils/class-names';

interface Props {
  onConfirm: Function;
  children: string;
  isActive: boolean;
  requestConfirmation: boolean;
  classNames: string;
}
const ProtectedNavigation = ({
  onConfirm,
  children: buttonText,
  isActive,
  requestConfirmation,
  classNames: moreClassNames
}: Props) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={requestConfirmation ? openModal : () => onConfirm()}
        className={classNames(
          isActive
            ? 'border-slate-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
          moreClassNames
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        {buttonText}
      </button>

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
                    Unsafe Navigation
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You have unsaved changes that will be lost if you proceed.
                      Discard changes?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <span></span>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-200 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      Cancel navigation
                    </button>
                    <span></span>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-200 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        onConfirm();
                        closeModal();
                      }}
                    >
                      Discard
                    </button>
                    <span></span>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProtectedNavigation;
