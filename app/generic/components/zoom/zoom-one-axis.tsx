'use client';
import { useContext } from 'react';
import { ZoomScaleContext, ZoomScaleDispatch } from './zoom-scale-context';
import { ZoomContext, ZoomDispatchContext } from './zoom-context';
import ZoomButton from './zoom-button';

export default function ZoomOneAxis({
  increment = 0.1,
  lowerBound = 0.5,
  upperBound = 2,
  axis = 'x'
}: {
  increment?: number;
  upperBound?: number;
  lowerBound?: number;
  axis?: 'x' | 'y';
}) {
  const factor = 1 + increment;
  const { y, x } = useContext(ZoomScaleContext);
  const { setYScale, setXScale } = useContext(ZoomScaleDispatch);

  const incrementZoom = () => {
    if (axis == 'x') {
      if (x < upperBound) setXScale(x * factor);
    } else if (axis == 'y') {
      if (y < upperBound) setYScale(y * factor);
    }
  };
  const decrementZoom = () => {
    if (axis == 'x') {
      if (x > lowerBound) setXScale(x / factor);
    } else if (axis == 'y') {
      if (y > lowerBound) setYScale(y / factor);
    }
  };

  return (
    <div className="mb-2 flex p-1 rounded-xl shadow-lg border-gray-400 border align-middle items-center h-fit w-fit bg-white">
      <ZoomContext.Provider value={{ xZoom: x, yZoom: y }}>
        <ZoomDispatchContext.Provider
          value={{ increment: incrementZoom, decrement: decrementZoom }}
        >
          <ZoomButton direction={'decrement'} />

          <ZoomButton direction={'increment'} />
        </ZoomDispatchContext.Provider>
      </ZoomContext.Provider>
    </div>
  );
}
