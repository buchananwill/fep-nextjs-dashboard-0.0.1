import { Card } from '@nextui-org/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

function RightHandToolCard({ children }: Props) {
  return (
    <Card className="max-w-sm ml-2 p-0 sticky top-4 h-[65vh] max-h-[65vh] text-center">
      {children}
    </Card>
  );
}

RightHandToolCard.UpperSixth = function UpperSixth({ children }: Props) {
  return (
    <div className="flex z-10 p-0 items-center justify-center h-1/6 relative">
      {children}
    </div>
  );
};

RightHandToolCard.LowerFiveSixths = function LowerFiveSixths({
  children
}: Props) {
  return (
    <div className="relative overflow-y-scroll h-5/6 border-t-2 min-w-full">
      {children}
    </div>
  );
};

export default RightHandToolCard;
