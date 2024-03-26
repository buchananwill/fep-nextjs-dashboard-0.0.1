import React from 'react';
import { Text } from '@tremor/react';

function Intersection({
  size,
  children
}: {
  size: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center align-middle justify-between w-full grow">
      <Text className="inline p-0 mr-1 grow-0">
        {children}
        {': '}
      </Text>
      <span className={'grow'}></span>
      <svg
        className={'grow-0'}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 184.574 184.574"
      >
        <g transform="translate(-10.507 -32.222)">
          <circle
            cx={67.181}
            cy={125.034}
            r={45.18}
            style={{
              display: 'inline',
              fill: '#000',
              fillOpacity: 1,
              stroke: '#000',
              strokeWidth: 6,
              strokeDasharray: 'none',
              strokeOpacity: 1
            }}
          />
          <circle
            cx={139.108}
            cy={125.034}
            r={45.18}
            style={{
              display: 'inline',
              fill: '#000',
              fillOpacity: 1,
              stroke: '#000',
              strokeWidth: 6,
              strokeDasharray: 'none',
              strokeOpacity: 1
            }}
          />
          <path
            d="M10.507 32.222h184.574v184.574H10.507z"
            style={{
              fill: 'none',
              stroke: 'none',
              strokeWidth: 2.365,
              strokeDasharray: 'none',
              strokeOpacity: 1
            }}
          />
          <path
            d="M61.213 158.729c-12.843-2.232-22.995-12.063-26.142-25.313-1.032-4.346-1.188-10.35-.38-14.642 2.436-12.948 11.574-23.234 23.456-26.401 5.898-1.573 11.934-1.338 17.685.689 3.163 1.114 7.222 3.45 9.678 5.569 1.145.988 3.9 3.844 4.583 4.751l.525.697-1.1 1.87c-2.155 3.657-3.726 7.793-4.567 12.023-.628 3.154-.793 8.894-.35 12.158.745 5.498 2.882 11.454 5.475 15.267.31.455.538.902.507.994-.03.092-.629.841-1.33 1.665-4.37 5.132-10.563 8.876-17.184 10.389-2.335.534-8.492.695-10.856.284z"
            style={{
              display: 'inline',
              fill: '#fff',
              fillOpacity: 1,
              stroke: '#fff',
              strokeWidth: 8.22909,
              strokeDasharray: 'none',
              strokeOpacity: 1
            }}
          />
          <path
            d="M146.17 159.388c12.826-2.276 22.964-12.3 26.106-25.81 1.03-4.432 1.187-10.554.38-14.93-2.432-13.203-11.558-23.691-23.423-26.921-5.89-1.603-11.917-1.364-17.66.702-3.16 1.136-7.212 3.518-9.665 5.679-1.144 1.008-3.895 3.92-4.577 4.845l-.524.71 1.1 1.906c2.15 3.73 3.72 7.947 4.56 12.26.626 3.216.79 9.07.349 12.398-.745 5.606-2.878 11.68-5.468 15.567-.309.464-.537.92-.506 1.013.03.094.628.858 1.329 1.699 4.364 5.232 10.547 9.05 17.16 10.593 2.331.544 8.48.708 10.84.29z"
            style={{
              display: 'inline',
              fill: '#fff',
              fillOpacity: 1,
              stroke: '#fff',
              strokeWidth: 8.30383,
              strokeDasharray: 'none',
              strokeOpacity: 1
            }}
          />
        </g>
      </svg>
    </div>
  );
}

export default Intersection;
