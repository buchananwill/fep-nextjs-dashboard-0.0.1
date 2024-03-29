'use client';
import { PropsWithChildren } from 'react';
import GenericSelectiveContextManager from '../base/generic-selective-context-manager';
import { SelectContextGlobal } from './selective-context-creator-global';
import {
  useSelectiveContextController,
  UseSelectiveContextParams
} from '../../hooks/generic/use-selective-context-controller';
import { useSelectiveContextListener } from '../../hooks/generic/use-selective-context-listener';
import { useSelectiveContextDispatch } from '../../hooks/generic/use-selective-context-dispatch';

export default function SelectiveContextManagerGlobal({
  children
}: PropsWithChildren) {
  return (
    <GenericSelectiveContextManager {...SelectContextGlobal}>
      {children}
    </GenericSelectiveContextManager>
  );
}

export function useSelectiveContextAnyController<T>({
  contextKey,
  initialValue,
  listenerKey
}: UseSelectiveContextParams<T>) {
  return useSelectiveContextController<T>(
    contextKey,
    listenerKey,
    initialValue,
    SelectContextGlobal.listenerRefContext,
    SelectContextGlobal.latestValueRefContext,
    SelectContextGlobal.dispatchContext
  );
}
export function useSelectiveContextAnyDispatch<T>({
  contextKey,
  listenerKey,
  initialValue
}: UseSelectiveContextParams<T>) {
  return useSelectiveContextDispatch<T>(
    contextKey,
    listenerKey,
    initialValue,
    SelectContextGlobal.listenerRefContext,
    SelectContextGlobal.latestValueRefContext,
    SelectContextGlobal.dispatchContext
  );
}

export function useSelectiveContextGlobalListener<T>({
  contextKey,
  listenerKey,
  initialValue
}: UseSelectiveContextParams<T>) {
  return useSelectiveContextListener<T>(
    contextKey,
    listenerKey,
    initialValue,
    SelectContextGlobal.listenerRefContext,
    SelectContextGlobal.latestValueRefContext
  );
}
