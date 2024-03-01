import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PropsWithChildren, useState } from 'react';

export function DisclosureThatGrowsOpen({
  children,
  label
}: { label: string } & PropsWithChildren) {
  const [showSliders, setShowSliders] = useState(false);

  return (
    <div className={'flex flex-col w-96 mt-2 '}>
      <button
        className={`btn ${showSliders ? 'btn-primary' : ''}`}
        onClick={() => setShowSliders(!showSliders)}
      >
        {label}
        <ChevronDownIcon
          className={`w-6 h-6 ${
            !showSliders ? 'rotate-90 transform' : ''
          } transition-transform duration-500`}
        ></ChevronDownIcon>
      </button>

      <div
        className={`mt-2 border-2 rounded-lg border-slate-300 ${
          showSliders
            ? 'h-60 mb-2 overflow-auto border-opacity-100'
            : 'h-0 overflow-auto border-opacity-0'
        }`}
        style={{
          transition: '0.3s ease-in',
          transitionProperty: 'height, opacity '
        }}
      >
        {children}
      </div>
    </div>
  );
}
