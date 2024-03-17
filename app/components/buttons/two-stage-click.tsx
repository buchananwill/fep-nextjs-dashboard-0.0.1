import React, { useRef, useState } from 'react';
import { Badge } from '@tremor/react';
import { offset, useFloating } from '@floating-ui/react';
import { GenericButtonProps } from './rename-button';

export function TwoStageClick({
  children,
  onClick,
  standardAppearance = 'btn-outline',
  primedAppearance = 'btn-error',
  primedMessage = 'Confirm delete?',
  className,
  ...props
}: {
  standardAppearance?: 'btn-outline' | 'btn-ghost';
  primedAppearance?: 'btn-error' | 'btn-primary';
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
    <button
      className={`relative btn transition-colors duration-500  ${
        clickPrimed ? primedAppearance : standardAppearance
      } ${className}`}
      {...props}
      onClick={guardClick}
      ref={refs.setReference}
    >
      {clickPrimed && (
        <Badge
          ref={refs.setFloating}
          style={floatingStyles}
          color={primedAppearance === 'btn-error' ? 'red' : 'blue'}
          onClick={guardClick}
        >
          {primedMessage}
        </Badge>
      )}
      {children}
    </button>
  );
}
