export function CardSkeleton({ n = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skeleton h-40 w-full rounded-xl" />
      ))}
    </div>
  );
}
