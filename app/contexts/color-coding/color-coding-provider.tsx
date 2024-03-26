'use client';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  ModalColorSelectContext,
  ColorCoding,
  ColorCodingDispatch
} from './context';
import { useColorState } from '../../components/color/color-selector';
import {
  ColorState,
  defaultColorState,
  HUE_OPTIONS,
  LIGHTNESS_OPTIONS
} from '../color/color-context';
import {
  ColorSelectModal,
  useModal
} from '../../components/color/color-select-modal';
import { produce } from 'immer';

const someSubjects = ['Maths', 'Art', 'Science'];

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
            // ...modalInitialState
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
