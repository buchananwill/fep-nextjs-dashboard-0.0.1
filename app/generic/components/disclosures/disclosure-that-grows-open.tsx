import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { PropsWithChildren, useState } from 'react';
import { Button } from '@nextui-org/button';

export function DisclosureThatGrowsOpen({
  children,
  label,
  heightWhenOpen,
  showBorder = false
}: {
  label: string;
  heightWhenOpen: string;
  showBorder?: boolean;
} & PropsWithChildren) {
  const [showSliders, setShowSliders] = useState(false);

  return (
    <div className={`flex flex-col w-96 `}>
      <Button
        color={`${showSliders ? 'primary' : 'default'}`}
        onPress={() => setShowSliders(!showSliders)}
      >
        {label}
        <ChevronDownIcon
          className={`w-6 h-6 ${
            !showSliders ? 'rotate-90 transform' : ''
          } transition-transform duration-500`}
        ></ChevronDownIcon>
      </Button>

      <div
        className={`mt-2 rounded-lg border-slate-300 ${
          showSliders
            ? `${heightWhenOpen} mb-2 overflow-hidden border-opacity-100 `
            : 'h-0 overflow-hidden border-opacity-0'
        } ${showBorder && showSliders && 'border-2'}`}
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
