'use client';
import { Text } from '@tremor/react';
import React, { useContext } from 'react';
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
          setShowTooltips(!showTooltips);
        }}
      ></input>
    </label>
  );
};

export default ToolTipsToggle;
