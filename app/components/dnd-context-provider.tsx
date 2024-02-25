'use client';
import { DndContext, DndContextProps } from '@dnd-kit/core';
import React, { PropsWithChildren } from 'react';

export function DndContextProvider({
  children,
  ...props
}: PropsWithChildren<DndContextProps>) {
  return <DndContext {...props}>{children}</DndContext>;
}
