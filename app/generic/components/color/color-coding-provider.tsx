'use client';
import React, { ReactNode, useContext, useState } from 'react';
import {
  ColorCoding,
  ColorCodingDispatch,
  ModalColorSelectContext
} from './color-coding-context';
import { useColorState } from './color-selector';
import { ColorState, defaultColorState } from './color-context';
import { ColorSelectModal } from './color-select-modal';
import { produce } from 'immer';
import { useModal } from '../modals/confirm-action-modal';

export default function ColorCodingProvider({
  children
}: {
  children: ReactNode;
}) {
  const context = useContext(ColorCoding);
  const [stringKey, setStringKey] = useState<string>('');

  const [colorCodingState, setColorCoding] = useState(context);

  const modalInitialState = { ...useColorState(defaultColorState) };

  const { isOpen, closeModal, openModal } = useModal();

  const handleColorConfirm = (updatedColorStateValue: ColorState) => {
    setColorCoding(() => {
      return produce(colorCodingState, (draft) => {
        draft[stringKey] = {
          hue: updatedColorStateValue.hue,
          lightness: updatedColorStateValue.lightness
        };
      });
    });
  };

  return (
    <ColorCoding.Provider value={colorCodingState}>
      <ColorCodingDispatch.Provider value={{ setColorCoding: setColorCoding }}>
        <ModalColorSelectContext.Provider
          value={{
            setModalText: setStringKey,
            stringKey: stringKey,
            openModal: openModal,
            onConfirm: handleColorConfirm,
            onCancel: () => closeModal(),
            onClose: closeModal
          }}
        >
          {children}
          <ColorSelectModal show={isOpen} initialState={modalInitialState}>
            {stringKey}
          </ColorSelectModal>
        </ModalColorSelectContext.Provider>
      </ColorCodingDispatch.Provider>
    </ColorCoding.Provider>
  );
}
