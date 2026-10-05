/** Thin diagonal arrow, 1px stroke at any size. Size it with the className (e.g. width/height in em). */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 19 19 5M8 5h11v11" fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
