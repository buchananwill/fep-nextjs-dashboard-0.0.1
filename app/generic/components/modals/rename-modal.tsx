import { TextInput } from '@tremor/react';
import { useEffect, useRef } from 'react';
import {
  ConfirmActionModal,
  ConfirmActionModalProps
} from './confirm-action-modal';
import { useSelectiveContextKeyMemo } from '../../../selective-context/hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatchString } from '../../../selective-context/components/typed/selective-context-manager-string';
import { RenameModalWrapperContextKey } from '../../../selective-context/keys/modal-keys';

export const RenameModalWrapperListener = `${RenameModalWrapperContextKey}:listener`;

export interface RenameModalProps {
  contextKey: string;
  listenerKey?: string;
  errorMessage?: string;
  error?: boolean;
}

export function RenameModal({
  contextKey,
  listenerKey,
  children,
  error,
  errorMessage = 'Please choose unique, non-empty name',
  show,
  ...props
}: RenameModalProps & ConfirmActionModalProps) {
  const combinedKey = useSelectiveContextKeyMemo(
    contextKey,
    listenerKey || RenameModalWrapperListener
  );
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchString(contextKey, combinedKey);

  const textInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (show) {
      textInput.current?.focus();
    }
  });

  return (
    <ConfirmActionModal {...props} enterToConfirm={true} show={show}>
      {children ? (
        children
      ) : (
        <TextInput
          ref={textInput}
          value={currentState}
          onValueChange={dispatchWithoutControl}
          error={error}
          errorMessage={errorMessage}
        />
      )}
    </ConfirmActionModal>
  );
}
