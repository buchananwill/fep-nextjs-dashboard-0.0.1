'use client';
import { Text } from '@tremor/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import path from 'path';
import React, { useContext, useTransition } from 'react';
import TooltipsContext from './tooltips-context';

const ToolTipsToggle = () => {
  const { showTooltips, setShowTooltips } = useContext(TooltipsContext);

  return (
    <label className="flex items-center">
      <Text>Tool tips:</Text>
      <input
        type="checkbox"
        name="tool-tips"
        className="toggle toggle-xs ml-1"
        checked={showTooltips}
        onChange={() => {
          console.log('Changing toggle.');
          setShowTooltips(!showTooltips);
        }}
      ></input>
    </label>
  );
};

export default ToolTipsToggle;
