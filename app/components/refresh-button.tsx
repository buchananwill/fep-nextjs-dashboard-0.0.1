'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import React from 'react';

export const RefreshButton = ({
  currentSetting
}: {
  currentSetting: string;
}) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const onRefreshButtonClick = () => {
    const params = new URLSearchParams(window.location.search);

    if (currentSetting === 'no-cache') {
      params.delete('cacheSetting');
    } else {
      params.set('cacheSetting', 'no-cache');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const color = currentSetting === 'no-cache' ? 'emerald' : 'red';

  const [isPending, startTransition] = useTransition();
  return (
    <button
      className={`btn bg-${color}-400 hover:bg-${color}-500 normal-case w-1/6`}
      onClick={() => onRefreshButtonClick()}
    >
      {currentSetting === 'no-cache' ? 'Keeping it fresh' : 'Letting it cache'}
      {isPending && (
        <div className="absolute left-2 top-2 flex items-center justify-center">
          <span className="loading loading-ring loading-sm"></span>
        </div>
      )}
    </button>
  );
};
