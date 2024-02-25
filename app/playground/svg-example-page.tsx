'use client';
import { RootSvgContext } from './root-svg-context';
import { ExampleSvgCanvas } from './example-svg-canvas';
import React from 'react';

export default function SvgExamplePage() {
  return (
    <RootSvgContext.Provider value={'test-svg-root'}>
      <ExampleSvgCanvas />
    </RootSvgContext.Provider>
  );
}
