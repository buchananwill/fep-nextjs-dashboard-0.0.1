'use client';
import { ReactNode, useState } from 'react';
import { HoverWidthContext } from './hover-width-context';

export function HoverWidth({
  width: initialWidth,
  maxWidth,
  children,
  className,
  style
}: {
  width: number;
  maxWidth?: number;
  children: ReactNode;
  className?: string;
  style?: {};
}) {
  const [width, setWidth] = useState(initialWidth);
  const [isWide, setIsWide] = useState(false);
  const wide = maxWidth ? maxWidth : 200;
  const toggle = () => {
    setIsWide(!isWide);
    const currentWidth = isWide ? wide : initialWidth;
    setWidth(currentWidth);
  };

  const contextValue = {
    isWide: isWide,
    toggle: toggle
  };

  return (
    <div
      className={className}
      onMouseOver={() => setIsWide(true)}
      onMouseOut={() => setIsWide(false)}
      style={{
        width: `${isWide ? wide : initialWidth}px`,
        transition: 'width 1s',
        ...style
      }}
    >
      <HoverWidthContext.Provider value={contextValue}>
        {children}
      </HoverWidthContext.Provider>
    </div>
  );
}
