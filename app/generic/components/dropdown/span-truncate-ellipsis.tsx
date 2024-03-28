export function SpanTruncateEllipsis({ children }: { children: string }) {
  return <span className={'truncate ...'}>{children}</span>;
}
