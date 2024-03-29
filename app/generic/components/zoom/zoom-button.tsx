'use client';
import { useContext } from 'react';
import { ZoomDispatchContext, ZoomType } from './zoom-context';

import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';

export default function ZoomButton({ direction }: { direction: ZoomType }) {
  const zoomDispatchContext = useContext(ZoomDispatchContext);
  const callback = zoomDispatchContext[direction];
  return (
    <Button
      className=" min-h-0 h-fit min-w-0 w-fit p-0 rounded-full"
      onClick={callback}
    >
      {direction == 'increment' ? (
        <PlusCircleIcon className="h-5 w-5"></PlusCircleIcon>
      ) : (
        <MinusCircleIcon className="h-5 w-5"></MinusCircleIcon>
      )}
    </Button>
  );
}
