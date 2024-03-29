import React, { useRef, useState } from 'react';
import { Badge } from '@tremor/react';
import { offset, useFloating } from '@floating-ui/react';
import { GenericButtonProps } from './rename-button';
import { Button } from '@nextui-org/react';

export function TwoStageClick({
  children,
  onClick,
  standardAppearance = 'ghost',
  primedAppearance = 'danger',
  primedMessage = 'Confirm delete?',
  className,
  ...props
}: {
  standardAppearance?: 'light' | 'ghost';
  primedAppearance?: 'danger' | 'primary';
  primedMessage?: string;
} & GenericButtonProps) {
  const [clickPrimed, setClickPrimed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    middleware: [offset({ mainAxis: 10 })]
  });

  const guardClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (clickPrimed && onClick) {
      onClick(e);
      setClickPrimed(false);
      if (timeoutRef.current !== undefined) clearTimeout(timeoutRef.current);
    } else {
      setClickPrimed(true);
      timeoutRef.current = setTimeout(() => setClickPrimed(false), 2000);
    }
  };

  return (
    <div className={'w-fit h-fit'} ref={refs.setReference}>
      <Button
        className={`z-10 relative transition-colors duration-500 ${className}`}
        /*{...props}*/
        color={clickPrimed ? primedAppearance : 'default'}
        variant={standardAppearance}
        size={'sm'}
        onClick={guardClick}
      >
        {children}
      </Button>
      {clickPrimed && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={'bg-white bg-opacity-100 w-fit h-fit rounded-md'}
        >
          <Badge color={'red'} onClick={guardClick}>
            {primedMessage}
          </Badge>
        </div>
      )}
    </div>
  );
}
