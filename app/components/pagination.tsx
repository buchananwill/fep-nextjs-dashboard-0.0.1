'use client';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/20/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function Pagination({
  first,
  pageNumber,
  last,
  lastPage
}: {
  first: boolean;
  last: boolean;
  pageNumber: number;
  lastPage?: number;
}) {
  const svgClassName = 'h-5 w-5 ';
  const buttonClassName = 'btn  relative btn-primary btn-outline';
  const appRouterInstance = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [buttonActive, setButtonActive] = useState<number | undefined>(
    undefined
  );

  function directToPage(nextPageNum: number) {
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      params.set('page', nextPageNum.toString());
      const redirectUrl = `${pathname}?${params.toString()}`;
      appRouterInstance.push(redirectUrl);
    });
  }

  useEffect(() => {
    if (!pending) {
      setButtonActive(undefined);
    }
  }, [pending]);

  const handleClick = (forwards: boolean) => {
    const nextPageNum = forwards ? pageNumber + 1 : pageNumber - 1;
    setButtonActive(forwards ? 3 : 2);
    directToPage(nextPageNum);
  };

  const toFirstPage = () => {
    setButtonActive(1);
    directToPage(0);
  };
  const toLastPage = () => {
    setButtonActive(4);
    if (lastPage) directToPage(lastPage);
  };

  const loadingSpinner = 'loading loading-spinner loading-xs absolute';

  return (
    <div className={'my-2 gap-x-1 flex'}>
      {!!lastPage && (
        <button
          className={`${buttonClassName}`}
          disabled={first || pending}
          onClick={toFirstPage}
        >
          {buttonActive === 1 && <span className={loadingSpinner}></span>}
          <ChevronDoubleLeftIcon
            className={svgClassName}
          ></ChevronDoubleLeftIcon>
        </button>
      )}
      <button
        className={`${buttonClassName}`}
        disabled={first || pending}
        onClick={() => handleClick(false)}
      >
        {buttonActive === 2 && <span className={loadingSpinner}></span>}
        <ArrowLeftIcon className={svgClassName}></ArrowLeftIcon>
      </button>
      <button
        className={`${buttonClassName}`}
        onClick={() => handleClick(true)}
        disabled={last || pending}
      >
        {buttonActive === 3 && <span className={loadingSpinner}></span>}
        <ArrowRightIcon className={svgClassName}></ArrowRightIcon>
      </button>
      {!!lastPage && (
        <button
          className={`${buttonClassName}`}
          disabled={last || pending}
          onClick={toLastPage}
        >
          {buttonActive === 4 && <span className={loadingSpinner}></span>}
          <ChevronDoubleRightIcon
            className={svgClassName}
          ></ChevronDoubleRightIcon>
        </button>
      )}
    </div>
  );
}
