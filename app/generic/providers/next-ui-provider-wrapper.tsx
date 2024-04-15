'use client';
import { PropsWithChildren } from 'react';
import { NextUIProvider } from '@nextui-org/react';

export default function NextUiProviderWrapper({ children }: PropsWithChildren) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
