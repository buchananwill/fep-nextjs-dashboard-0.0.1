import { XMarkIcon } from '@heroicons/react/24/outline';
import { Overlay } from './overlay';

export function DeletedOverlay({
  show,
  handleUnDelete
}: {
  show: boolean;
  handleUnDelete?: () => void;
}) {
  return (
    <>
      {show && (
        <Overlay>
          <button
            className={
              'w-full h-full btn-outline transition-colors duration-500'
            }
            onClick={handleUnDelete}
          >
            <XMarkIcon className={'h-full w-full opacity-50'}></XMarkIcon>
          </button>
        </Overlay>
      )}
    </>
  );
}
