import React, { useRef, useState } from 'react';
import { Badge } from '@tremor/react';
import { offset, useFloating } from '@floating-ui/react';
import { GenericButtonProps } from './rename-button';
import { Button, ButtonProps } from '@nextui-org/button';
import { PressEvent } from '@react-types/shared';
import { isNotUndefined } from '../../../api/main';

export function TwoStageClick({
  children,
  onPress,
  standardAppearance = 'ghost',
  primedAppearance = 'danger',
  primedMessage = 'Confirm delete?',
  className,
  ...props
}: {
  standardAppearance?: 'light' | 'ghost';
  primedAppearance?: 'danger' | 'primary';
  primedMessage?: string;
} & ButtonProps) {
  const [clickPrimed, setClickPrimed] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    middleware: [offset({ mainAxis: 10 })]
  });

  const guardClick = (e: PressEvent) => {
    if (clickPrimed && isNotUndefined(onPress)) {
      onPress(e);
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
        onPress={guardClick}
        {...props}
      >
        {children}
      </Button>
      {clickPrimed && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className={'bg-white bg-opacity-100 w-fit h-fit rounded-md z-10'}
        >
          <Badge color={'red'} className={''}>
            {primedMessage}
          </Badge>
        </div>
      )}
    </div>
  );
}
