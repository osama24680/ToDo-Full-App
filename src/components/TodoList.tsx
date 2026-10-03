import Button from "./ui/Button";
import useAuthenticatedQuery from "../Hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../Config/axios.config";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
    documentId: "",
  });

  const configData = {
    queryKey: ["todos", todoToEdit.documentId],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  };
  const { isLoading, data } = useAuthenticatedQuery(configData);

  const onCloseEditModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsEditModalOpen(false);
  };
  const onOpenEditModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsEditModalOpen(true);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTodoToEdit((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };
  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdated(true);
    console.log("Updated todo:", todoToEdit);

    const { title, description } = todoToEdit;

    try {
      const { status } = await axiosInstance.put(
        `/todos/${todoToEdit.documentId}`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        },
      );
      if (status === 200) {
        onCloseEditModal();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsUpdated(false);
    }
  };
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="space-y-1">
      {data.todos.length > 0 ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 even:bg-gray-100 duration-300 rounded-md p-3"
          >
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center space-x-3 w-full justify-end">
              <Button size="sm" onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button variant="danger" size="sm">
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2 className="text-center text-gray-500">No todos found.</h2>
      )}
      {
        <Modal
          isOpen={isEditModalOpen}
          closeModal={onCloseEditModal}
          title="Edit Todo"
          description="Edit the selected todo item"
        >
          <form onSubmit={(e) => onSubmitHandler(e)} className="space-y-4">
            <Input
              name="title"
              value={todoToEdit.title}
              onChange={(e) => onChangeHandler(e)}
            />
            <Textarea
              name="description"
              value={todoToEdit.description}
              onChange={(e) => onChangeHandler(e)}
            />
            <div className="flex justify-center items-center my-4 space-x-4">
              <Button
                className=" bg-indigo-700 hover:bg-gray-800 "
                isLoading={isUpdated}
                type="submit"
              >
                Update
              </Button>
              <Button variant="cancel" onClick={onCloseEditModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      }
    </div>
  );
};

export default TodoList;
