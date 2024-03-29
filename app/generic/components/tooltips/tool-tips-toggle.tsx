'use client';
import { Switch } from '@tremor/react';
import React from 'react';
import { useTooltipsContext } from './tooltips-context-provider';

const ToolTipsToggle = () => {
  const { showTooltips, setShowTooltips } = useTooltipsContext();

  return (
    <label className="flex items-center">
      <p className={'text-gray-400'}>Tooltips:</p>
      <Switch
        // type="checkbox"
        name="tool-tips"
        // className="toggle toggle-xs ml-1 toggle-success"
        checked={showTooltips}
        onChange={() => setShowTooltips((prev) => !prev)}
      ></Switch>
    </label>
  );
};

export default ToolTipsToggle;
