import { Card } from '@nextui-org/card';
import React from 'react';

interface Props {
  children: React.ReactNode;
  height?: number;
}

function ToolCard({ children, height }: Props) {
  return (
    <Card
      className={`max-w-[100%] w-full p-0 sticky top-4 left-0 ${
        height ? '' : 'h-[65vh]'
      } text-center z-30 overflow-hidden`}
      style={height ? { height: `${height}px` } : {}}
    >
      {children}
    </Card>
  );
}

ToolCard.UpperSixth = function UpperSixth({ children }: Props) {
  return (
    <div className="flex z-10 p-0 items-center justify-center h-1/6 relative overflow-hidden">
      {children}
    </div>
  );
};

ToolCard.LowerFiveSixths = function LowerFiveSixths({ children }: Props) {
  return (
    <div className="relative overflow-auto h-5/6 border-t-2 w-full">
      {children}
    </div>
  );
};

export default ToolCard;
