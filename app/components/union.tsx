import React from 'react';

function Union({ size, className }: { size: number; className: string }) {
  const circles = [
    { cx: '67.181', cy: '100.034' },
    { cx: '139.108', cy: '100.034' }
  ];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 184.574 184.574"
    >
      <g>
        {circles.map((circle, index) => (
          <circle
            key={index}
            cx={circle.cx}
            cy={circle.cy}
            r="45.18"
            className="blackCircle"
          ></circle>
        ))}
        <path
          className="whitePath"
          d="M61.213 158.729c-12.843 ... 10.856 .284z"
        ></path>
        <path
          className="whitePath"
          d="M146.17 159.388c12.826 ... 10.84 .29z"
        ></path>
      </g>
      <style jsx>{`
        .blackCircle {
          fill: #000;
          stroke: #000;
          stroke-width: 6;
        }
        .whitePath {
          fill: #fff;
          stroke: #fff;
          stroke-width: 8.229;
        }
      `}</style>
    </svg>
  );
}

export default Union;
