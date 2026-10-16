import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "../components/ui/Icons";

const PageNotFound = () => {
  return (
    <div className="bg-grid fixed inset-0 flex items-center justify-center px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet/20 blur-[120px]" />
      <div className="relative animate-fade-up text-center">
        <p className="text-brand text-[8rem] font-extrabold leading-none tracking-tighter sm:text-[10rem]">404</p>
        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">This page wandered off</h1>
        <p className="mx-auto mt-3 max-w-sm text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          reloadDocument
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-ink-900 shadow-glow transition hover:brightness-110"
        >
          <ArrowLeftIcon width={16} height={16} />
          Back to my todos
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
