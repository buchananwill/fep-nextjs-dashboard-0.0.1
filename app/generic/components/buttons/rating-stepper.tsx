import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { HUE_OPTIONS } from '../color/color-context';

export function RatingStepper({
  handleDecrement,
  handleIncrement,
  ratingValue
}: {
  handleDecrement: () => void;
  ratingValue: number;
  handleIncrement: () => void;
}) {
  return (
    <div className="flex col px-2">
      <button
        className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
        onClick={handleDecrement}
      >
        <MinusIcon className=" h-4 w-4"></MinusIcon>
      </button>
      <div
        className={`w-7 rounded-md px-2 bg-${HUE_OPTIONS[ratingValue].id}-400 justify-center text-center`}
      >
        {ratingValue}
      </div>
      <button
        className="border-2 rounded-md p-1 mx-1 hover:bg-gray-600 hover:text-gray-50"
        onClick={handleIncrement}
      >
        <PlusIcon className=" h-4 w-4"></PlusIcon>
      </button>
    </div>
  );
}
