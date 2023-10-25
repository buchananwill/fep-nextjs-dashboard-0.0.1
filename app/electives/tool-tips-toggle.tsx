'use client';
import { Text } from '@tremor/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import path from 'path';
import React, { useTransition } from 'react';

const ToolTipsToggle = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toolTips = useSearchParams()?.get('toolTips') === 'show';

  const handleToggleClick = () => {
    const params = new URLSearchParams(window.location.search);

    if (toolTips) {
      params.delete('toolTips');
    } else {
      params.set('toolTips', 'show');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <label className="flex items-center">
      <Text>Tool tips:</Text>
      <input
        type="checkbox"
        name="tool-tips"
        className="toggle toggle-xs ml-1"
        checked={toolTips}
        onClick={handleToggleClick}
      ></input>
    </label>
  );
};

export default ToolTipsToggle;
