'use client';
import { Switch, Text } from '@tremor/react';
import React from 'react';
import { useTooltipsContext } from './tooltips-context-provider';

const ToolTipsToggle = () => {
  const { showTooltips, setShowTooltips } = useTooltipsContext();

  return (
    <label className="flex items-center">
      <Text className={'text-gray-200'}>Tooltips:</Text>
      <Switch
        // type="checkbox"
        name="tool-tips"
        // className="toggle toggle-xs ml-1 toggle-success"
        checked={showTooltips}
        onChange={() => setShowTooltips(!showTooltips)}
      ></Switch>
    </label>
  );
};

export default ToolTipsToggle;
