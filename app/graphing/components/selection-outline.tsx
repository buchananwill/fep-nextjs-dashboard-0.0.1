import { PropsWithChildren } from 'react';
import { DataNode } from '../../api/zod-mods';
import { useNodeSelectedListener } from '../nodes/node-interaction-context';

export default function SelectionOutline<T>({
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
