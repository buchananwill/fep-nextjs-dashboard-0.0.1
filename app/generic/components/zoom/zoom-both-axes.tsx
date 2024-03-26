'use client';
import { useContext } from 'react';
import { ZoomScaleContext, ZoomScaleDispatch } from './zoom-scale-context';
import { ZoomContext, ZoomDispatchContext } from './zoom-context';
import ZoomButton from './zoom-button';

export default function ZoomBothAxes({
  xIncrement = 0.1,
  xLowerBound = 0.5,
  xUpperBound = 2,
  yIncrement = 0.1,
  yUpperBound = 2,
  yLowerBound = 0.5
}: {
  xIncrement?: number;
  xUpperBound?: number;
  xLowerBound?: number;
  yIncrement?: number;
  yUpperBound?: number;
  yLowerBound?: number;
}) {
  const xFactor = 1 + xIncrement;
  const yFactor = 1 + yIncrement;
  const { y, x } = useContext(ZoomScaleContext);
  const { setYScale, setXScale } = useContext(ZoomScaleDispatch);

  const incrementY = () => {
    if (y < yUpperBound) setYScale(y * yFactor);
  };
  const decrementY = () => {
    if (y > yLowerBound) setYScale(y / yFactor);
  };

  const incrementX = () => {
    if (x < xUpperBound) setXScale(x * xFactor);
  };
  const decrementX = () => {
    if (x > xLowerBound) setXScale(x / xFactor);
  };

  return (
    <div className="mb-2 flex p-1 rounded-xl shadow-lg border-gray-400 border align-middle items-center">
      <ZoomContext.Provider value={{ xZoom: x, yZoom: y }}>
        <ZoomDispatchContext.Provider
          value={{ increment: incrementX, decrement: decrementX }}
        >
          <ZoomButton direction={'decrement'} />
          <ZoomDispatchContext.Provider
            value={{
              increment: incrementY,
              decrement: decrementY
            }}
          >
            <div className="flex flex-col">
              <ZoomButton direction={'increment'} />
              <ZoomButton direction={'decrement'} />
            </div>
          </ZoomDispatchContext.Provider>
          <ZoomButton direction={'increment'} />
        </ZoomDispatchContext.Provider>
      </ZoomContext.Provider>
    </div>
  );
}
