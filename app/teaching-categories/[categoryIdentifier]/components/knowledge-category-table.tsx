import { PropsWithChildren } from 'react';

export function KnowledgeCategoryTable({ children }: PropsWithChildren) {
  return (
    <div className={'h-[60vh]'}>
      <table className={'relative'}>{children}</table>
    </div>
  );
}

export function KnowledgeCategoryTableHeader({ children }: PropsWithChildren) {
  return (
    <thead
      className={'sticky top-0 bg-white opacity-100 z-10 border-collapse p-0 '}
    >
      <tr className={'border-collapse pb-2'}>{children}</tr>
    </thead>
  );
}

export function KnowledgeCategoryTableHeaderCell({
  children
}: PropsWithChildren) {
  return (
    <th scope={'col'} className={'border-0 border-collapse p-0 '}>
      <div className={'flex items-center p-2 justify-between border'}>
        {children}
      </div>
    </th>
  );
}

export function KnowledgeCategoryTableCell({ children }: PropsWithChildren) {
  return (
    <td>
      <div className={'flex items-center px-2 w-full '}>{children}</div>
    </td>
  );
}

export function KnowledgeCategoryTableBody({ children }: PropsWithChildren) {
  return <tbody>{children}</tbody>;
}

export function KnowledgeCategoryTableRow({ children }: PropsWithChildren) {
  return <tr className={'odd:bg-slate-50'}>{children}</tr>;
}
