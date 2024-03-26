import React from 'react';
import { Text } from '@tremor/react';

function Union({
  size,
  children
}: {
  size: number;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-row items-center justify-between align-middle grow">
      <Text className="inline p-0 mr-1 grow-0">
        {children}
        {': '}
      </Text>
      <span className={'grow'}></span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 184.574 184.574"
        className="stroke-current hover:stroke-emerald-500 grow-0"
      >
        <g transform="translate(-10.507 -32.222)">
          <circle
            cx={67.181}
            cy={125.034}
            r={45.18}
            style={{
              display: 'inline',

              fillOpacity: 1,
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
              fillOpacity: 1,
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
            d="M61.677 157.804c-12.898-2.1-23.094-11.351-26.254-23.82-1.037-4.09-1.193-9.741-.382-13.78 2.446-12.185 11.624-21.864 23.556-24.845 5.924-1.48 11.985-1.259 17.761.648 3.177 1.048 7.253 3.246 9.72 5.24 1.15.93 3.916 3.618 4.602 4.472l.527.656-1.105 1.759a35.153 35.153 0 0 0-4.586 11.315c-.63 2.968-.796 8.37-.351 11.442.748 5.173 2.894 10.779 5.499 14.367.31.428.54.849.509.935-.031.087-.632.792-1.337 1.567-4.389 4.83-10.607 8.353-17.257 9.777-2.345.502-8.528.654-10.902.267zM143.028 157.804c12.898-2.1 23.094-11.351 26.254-23.82 1.036-4.09 1.193-9.741.382-13.78-2.446-12.185-11.624-21.864-23.556-24.845-5.924-1.48-11.986-1.259-17.762.648-3.176 1.048-7.252 3.246-9.719 5.24-1.15.93-3.917 3.618-4.603 4.472l-.527.656 1.106 1.759a35.153 35.153 0 0 1 4.586 11.315c.63 2.968.796 8.37.351 11.442-.749 5.173-2.894 10.779-5.499 14.367-.31.428-.54.849-.51.935.032.087.633.792 1.338 1.567 4.388 4.83 10.607 8.353 17.257 9.777 2.345.502 8.528.654 10.902.267z"
            style={{
              display: 'inline',
              fill: 'none',
              fillOpacity: 1,
              stroke: '#fff',
              strokeWidth: 8,
              strokeDasharray: 'none',
              strokeOpacity: 1
            }}
          />
        </g>
      </svg>
    </div>
  );
}

export default Union;
