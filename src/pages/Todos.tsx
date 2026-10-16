import useCustomQuery from "../Hooks/useCustomQuery";
import { ITodo } from "../Interfaces";
import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";
import { useState } from "react";
import Button from "../components/ui/Button";
import axiosInstance from "../Config/axios.config";
import toast from "react-hot-toast";
import { InboxIcon, SparkIcon } from "../components/ui/Icons";
import LoadError from "../components/LoadError";

const sortOptions = [
  { value: "ASC", label: "Oldest" },
  { value: "DESC", label: "Latest" },
];

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [newDataCounter, setNewDataCounter] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("ASC");
  const configData = {
    queryKey: [page, pageSize, sortBy, newDataCounter],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  };
  const { isLoading, isError, data } = useCustomQuery(configData);
  const onClickNext = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const onClickPrev = () => {
    setPage((prevPage) => prevPage - 1);
  };
  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  };
  const onGenerateTodos = async () => {
    setIsGenerating(true);
    // Faker is only needed here, so it's loaded on demand (English locale only)
    // instead of shipping ~2 MB of fake-data locales to every visitor.
    const { faker } = await import("@faker-js/faker/locale/en");
    for (let i = 1; i <= 10; i++) {
      try {
        await axiosInstance.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(5),
              description: faker.lorem.paragraph(2),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData?.jwt}`,
            },
          },
        );
        setNewDataCounter((prev) => prev + 1);
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
    setIsGenerating(false);
    toast.success("10 random todos generated");
  };
  const { pageCount, total } = data?.meta?.pagination || {};
  const todos: ITodo[] = data?.data ?? [];
  // numbering continues across pages
  const offset = (page - 1) * pageSize;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-medium text-aqua">Workspace</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">All todos</h1>
        <p className="text-sm text-slate-400">Browse every todo with server-side pagination and sorting.</p>
      </div>

      {/* ---------- Toolbar ---------- */}
      <div className="surface mb-5 flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" size="sm" onClick={onGenerateTodos} isLoading={isGenerating}>
          {!isGenerating && <SparkIcon width={16} height={16} />}
          Generate 10 random todos
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-white/[0.04] p-1 ring-1 ring-inset ring-white/[0.06]" role="group" aria-label="Sort by">
            {sortOptions.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setSortBy(o.value)}
                aria-pressed={sortBy === o.value}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  sortBy === o.value ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="page-size">
            Page size
          </label>
          <select
            id="page-size"
            className="rounded-xl border border-white/10 bg-ink-850 px-3 py-2 text-sm text-slate-200 outline-none focus:border-violet/60"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option value={10}>10 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
        </div>
      </div>

      {/* ---------- List ---------- */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <TodoSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <LoadError what="todos" />
      ) : todos.length > 0 ? (
        <ul className="surface divide-y divide-white/[0.06] overflow-hidden">
          {todos.map((todo, i) => (
            <li key={todo.id} className="flex items-start gap-4 px-5 py-4 transition hover:bg-white/[0.03]">
              <span className="mt-0.5 w-8 shrink-0 font-mono text-xs font-semibold text-slate-500">
                {String(offset + i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold capitalize text-white">{todo.title}</h3>
                {todo.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-400">{todo.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface flex flex-col items-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-aqua ring-1 ring-inset ring-white/10">
            <InboxIcon width={28} height={28} />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-white">Nothing here yet</h2>
          <p className="mt-1 max-w-xs text-sm text-slate-400">Generate some random todos to try out pagination.</p>
        </div>
      )}

      <div className="mt-6">
        <Paginator
          page={page}
          pageCount={pageCount}
          total={total}
          isLoading={isLoading}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
        />
      </div>
    </div>
  );
};

export default TodosPage;
