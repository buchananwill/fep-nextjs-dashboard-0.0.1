import {
  useSelectiveContextControllerString,
  useSelectiveContextDispatchString
} from '../selective-context/selective-context-manager-string';
import { useSelectiveContextKeyMemo } from '../selective-context/use-selective-context-listener';
import {
  ConfirmActionModal,
  ConfirmActionModalProps,
  useModal
} from '../confirm-action-modal';
import { TextInput } from '@tremor/react';

export const RenameModalWrapperContextKey = 'rename-modal-wrapper';
export const RenameModalWrapperListener = `${RenameModalWrapperContextKey}:listener`;

export function RenameModal({
  contextKey,
  listenerKey,
  children,
  ...props
}: { contextKey: string; listenerKey?: string } & ConfirmActionModalProps) {
  const combinedKey = useSelectiveContextKeyMemo(
    contextKey,
    listenerKey || RenameModalWrapperListener
  );
  const { currentState, dispatchWithoutControl } =
    useSelectiveContextDispatchString(contextKey, combinedKey);

  return (
    <ConfirmActionModal {...props} enterToConfirm={true}>
      {children ? (
        children
      ) : (
        <TextInput
          value={currentState}
          onValueChange={dispatchWithoutControl}
        />
      )}
    </ConfirmActionModal>
  );
}
