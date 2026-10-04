import useCustomQuery from "../Hooks/useCustomQuery";
import { ITodo } from "../interfaces";
import TodoSkeleton from "../components/TodoSkeleton";
import Paginator from "../components/ui/Paginator";

interface IProps {}
const TodosPage = ({}: IProps) => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const configData = {
    queryKey: ["paginatedTodos"],
    url: "/todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  };
  const { isLoading, data } = useCustomQuery(configData);
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
    <div className=" space-y-4">
      {data?.data?.length > 0 ? (
        data?.data?.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 even:bg-gray-100 duration-300 rounded-md p-3"
          >
            <h3 className="w-full font-semibold">
              <b>
                {todo.id} -{todo.title}
              </b>{" "}
              <br />
              {todo.description}
            </h3>
          </div>
        ))
      ) : (
        <h2 className="text-center text-gray-500">No todos found here.</h2>
      )}
      <Paginator />
    </div>
  );
};

export default TodosPage;
