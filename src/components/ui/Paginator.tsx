import { ArrowLeftIcon, ArrowRightIcon } from "./Icons";

interface IProps {
  page: number;
  pageCount: number;
  total: number;
  isLoading: boolean;
  onClickPrev: () => void;
  onClickNext: () => void;
}

const navButton =
  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-200 ring-1 ring-inset ring-white/10 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

const Paginator = ({ page, pageCount, onClickPrev, isLoading, total, onClickNext }: IProps) => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 pt-2 sm:flex-row">
      <p className="text-sm text-slate-400">
        Page <span className="font-semibold text-white">{page}</span> of{" "}
        <span className="font-semibold text-white">{pageCount || 1}</span>
        <span className="mx-2 text-slate-600">·</span>
        <span className="font-semibold text-white">{total ?? 0}</span> records
      </p>

      <div className="flex items-center gap-2">
        <button type="button" className={navButton} disabled={page === 1 || isLoading} onClick={onClickPrev}>
          <ArrowLeftIcon width={16} height={16} />
          Previous
        </button>
        <button
          type="button"
          className={navButton}
          disabled={!pageCount || page === pageCount || isLoading}
          onClick={onClickNext}
        >
          Next
          <ArrowRightIcon width={16} height={16} />
        </button>
      </div>
    </div>
  );
};

export default Paginator;
