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
  const timeoutRef = useRef(undefined);
  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    middleware: [offset({ mainAxis: 10 })]
  });
  const guardClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (clickPrimed && onClick) {
      onClick(e);
    } else {
      setClickPrimed(true);
      setTimeout(() => setClickPrimed(false), 2000);
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
