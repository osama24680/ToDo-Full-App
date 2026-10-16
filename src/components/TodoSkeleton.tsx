// Placeholder card that matches the shape of a real todo while data loads.
const TodoSkeleton = () => {
  return (
    <div className="surface flex items-start gap-4 p-5">
      <div className="skeleton h-6 w-6 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2.5">
        <div className="skeleton h-3.5 w-2/5" />
        <div className="skeleton h-3 w-4/5" />
        <div className="skeleton h-3 w-3/5" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-9 w-9 rounded-xl" />
        <div className="skeleton h-9 w-9 rounded-xl" />
      </div>
    </div>
  );
};

export default TodoSkeleton;
