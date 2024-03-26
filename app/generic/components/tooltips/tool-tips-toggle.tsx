'use client';
import { Text } from '@tremor/react';
import React, { useContext } from 'react';

import { useSelectiveContextControllerBoolean } from '../selective-context/selective-context-manager-boolean';
import { useTooltipsContext } from './tooltips-context-provider';

const ToolTipsToggle = () => {
  const { showTooltips, setShowTooltips } = useTooltipsContext();

  return (
    <label className="flex items-center">
      <Text className={'text-gray-200'}>Tooltips:</Text>
      <input
        type="checkbox"
        name="tool-tips"
        className="toggle toggle-xs ml-1 toggle-success"
        checked={showTooltips}
        onChange={() => setShowTooltips(!showTooltips)}
      ></input>
    </label>
  );
};

export default ToolTipsToggle;
