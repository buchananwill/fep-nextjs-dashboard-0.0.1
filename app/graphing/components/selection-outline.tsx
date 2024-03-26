import { PropsWithChildren } from 'react';

export default function SelectionOutline({
  showOutline,
  children
}: PropsWithChildren & { showOutline: boolean }) {
  return (
    <div
      className={`${
        showOutline
          ? 'outline outline-2 outline-offset-1 outline-blue-400 rounded-lg max-w-full border-0 p-0 m-0'
          : ''
      }`}
    >
      {children}
    </div>
  );
}
