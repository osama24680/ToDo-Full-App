import useCustomQuery from "../Hooks/useCustomQuery";
import { ITodo } from "../interfaces";
import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";
import { useState } from "react";
import Button from "../components/ui/Button";

interface IProps {}
const TodosPage = ({}: IProps) => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("ASC");
  const configData = {
    queryKey: [page, pageSize, sortBy],
    url: `/todos?pagination[pageSize]=${pageSize}&pagination[page]=${page}&sort=createdAt:${sortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  };
  const { isLoading, data } = useCustomQuery(configData);
  console.log(data);
  const onClickNext = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const onClickPrev = () => {
    setPage((prevPage) => prevPage - 1);
  };
  const onChangePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  };
  const onChangeSortBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  const { pageCount, total } = data?.meta?.pagination || {};
  if (isLoading) {
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <TodoSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between space-x-2">
        {/* <Button
          size="sm"
          onClick={onGenerateTodos}
          title="Generate 100 records"
        >
          Generate todos
        </Button> */}
        <div className="flex items-center justify-between space-x-2 text-md">
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={sortBy}
            onChange={onChangeSortBy}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className=" space-y-4">
        {data?.data?.length > 0 ? (
          data?.data?.map((todo: ITodo, id: number) => (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 even:bg-gray-100 duration-300 rounded-md p-3"
            >
              <h3 className="w-full font-semibold">
                <b>
                  {id + 1}. {todo.title}
                </b>{" "}
                <br />
                {todo.description}
              </h3>
            </div>
          ))
        ) : (
          <h2 className="text-center text-gray-500">No todos found here.</h2>
        )}
        <Paginator
          page={page}
          pageCount={pageCount}
          total={total}
          isLoading={isLoading}
          onClickNext={onClickNext}
          onClickPrev={onClickPrev}
        />
      </div>
    </>
  );
};

export default TodosPage;
