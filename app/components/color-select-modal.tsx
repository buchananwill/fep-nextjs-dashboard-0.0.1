'use client';
import React, { Fragment, ReactNode, useContext, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ColorSelector, { useColorState } from './color-selector';
import { ColorState } from './color-context';
import { ModalColorSelectContext } from '../subject-color-coding/context';

export function useModal() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return { isOpen, closeModal, openModal };
}

export function ColorSelectModal({
  onCancel,
  onClose,
  onConfirm,
  show,
  children,
  initialState
}: {
  show: boolean;
  initialState: ColorState;
  onClose: () => void;
  onConfirm: (colorState: ColorState) => void;
  onCancel: () => void;
  children?: ReactNode;
}) {
  console.log('Color select modal: ', initialState);
  const { lessonText } = useContext(ModalColorSelectContext);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-fit transform overflow-visible rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="max-w-fit text-lg font-medium leading-6 text-gray-900"
                >
                  Select Color for {children}
                </Dialog.Title>
                <div className="flex mt-2 justify-center">
                  <div className="text-sm text-gray-500">
                    <ColorSelector colorState={initialState}></ColorSelector>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <span></span>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-emerald-200 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => {
                      onConfirm(initialState);
                      onClose();
                    }}
                  >
                    Confirm
                  </button>
                  <span></span>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-orange-200 px-4 py-2 text-sm font-medium text-orange-900 hover:bg-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onCancel}
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
  );
}
