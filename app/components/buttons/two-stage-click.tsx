import React, { useRef, useState } from 'react';
import { Badge } from '@tremor/react';
import { offset, useFloating } from '@floating-ui/react';

export function TwoStageClick({
  children,
  onClick,
  ...props
}: {} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
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
        clickPrimed ? 'btn-error' : 'btn-outline'
      } btn-sm `}
      {...props}
      onClick={guardClick}
      ref={refs.setReference}
    >
      {clickPrimed && (
        <Badge
          ref={refs.setFloating}
          style={floatingStyles}
          color={'red'}
          onClick={guardClick}
        >
          Confirm delete?
        </Badge>
      )}
      {children}
    </button>
  );
}
