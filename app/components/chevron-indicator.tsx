import { ChevronUpIcon } from '@heroicons/react/20/solid';
import React, { useContext } from 'react';
import { HslColorContext } from '../contexts/color/color-context';

export function ChevronIndicator(props: { open: boolean }) {
  const { current } = useContext(HslColorContext);
  return (
    <div
      className={'h-full mx-2'}
      style={{ backgroundColor: `${current.cssHSLA}` }}
    >
      <ChevronUpIcon
        className={`${!props.open ? 'rotate-180 transform' : ''} h-5 w-5 mr-1`}
      />
    </div>
  );
}
