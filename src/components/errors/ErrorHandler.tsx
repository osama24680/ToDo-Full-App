import { Link, useLocation } from "react-router-dom";
import { AlertIcon } from "../ui/Icons";

interface IProps {
  statusCode?: number;
  title?: string;
}

const ErrorHandler = ({ statusCode = 500, title = "Server Error" }: IProps) => {
  const { pathname } = useLocation();

  return (
    <div className="bg-grid fixed inset-0 flex items-center justify-center p-6">
      <div className="surface relative w-full max-w-md animate-fade-up p-8 text-center">
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/30">
          <AlertIcon width={26} height={26} />
        </span>
        <h2 className="mt-5 text-2xl font-bold text-white">
          {statusCode} · {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Something went wrong on our side. Try refreshing the page — if it keeps happening, please get in touch.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link
            to="/"
            reloadDocument
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 ring-1 ring-inset ring-white/10 transition hover:bg-white/5 hover:text-white"
          >
            Home
          </Link>
          <Link
            to={pathname}
            reloadDocument
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-ink-900 shadow-glow transition hover:brightness-110"
          >
            Refresh
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;
