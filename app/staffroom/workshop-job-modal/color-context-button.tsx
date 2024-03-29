'use client';
import { ButtonHTMLAttributes, useContext } from 'react';
import { RunnableContext } from './runnable-context';
import { ColorCoding } from '../../generic/components/color/color-coding-context';
import { Button, ButtonProps } from '@nextui-org/react';

interface ColorContextButtonProps extends ButtonProps {
  contextKey: string;
}

export function ColorContextButton({
  children,
  contextKey,
  className,
  ...otherProps
}: ColorContextButtonProps) {
  const { callback } = useContext(RunnableContext);
  const colorCodingContext = useContext(ColorCoding);
  const colorCodingContextElement = colorCodingContext[contextKey];
  const hue = colorCodingContextElement?.hue;
  const id = hue?.id || 'gray';
  return (
    <Button
      size={'sm'}
      variant={'ghost'}
      className={`text-${id}-600 hover:bg-${id}-600 hover:border-${id}-600 leading-[0px] ${
        className ? className : ''
      }`}
      {...otherProps}
      onPress={callback}
    >
      {children}
    </Button>
  );
}
