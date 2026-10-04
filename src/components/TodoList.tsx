import Button from "./ui/Button";
import useCustomQuery from "../Hooks/useCustomQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../interfaces";
import axiosInstance from "../Config/axios.config";
import TodoSkeleton from "./TodoSkeleton";
import { faker } from "@faker-js/faker";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [queryVersion, setQueryVersion] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
    documentId: "",
  });
  const [todoToAdd, setTodoToAdd] = useState<ITodo>({
    title: "",
    description: "",
  });

  const configData = {
    queryKey: ["todos", queryVersion],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  };
  const { isLoading, data } = useCustomQuery(configData);

  const onCloseAddModal = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModal(false);
  };
  const onOpenAddModal = () => {
    setIsOpenAddModal(true);
  };
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

  const onChangeAddHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTodoToAdd((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
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

  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
  };
  const onRemove = async () => {
    try {
      await axiosInstance.delete(`/todos/${todoToEdit.documentId}`, {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`,
        },
      });
      setQueryVersion((prevVersion) => prevVersion + 1);
      closeConfirmModal();
    } catch (error) {
      console.error("Error removing todo:", error);
    }
  };

  const onGenerateTodos = async () => {
    for (let i = 1; i <= 100; i++) {
      try {
        const { data } = await axiosInstance.post(
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
        console.log(data);
      } catch (error) {
        console.error("Error updating todo:", error);
      }
    }
  };
  const onSubmitUpdateTodo = async (e: FormEvent<HTMLFormElement>) => {
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
        setQueryVersion((prevVersion) => prevVersion + 1);
        onCloseEditModal();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsUpdated(false);
    }
  };

  const onSubmitAddTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdated(true);
    console.log("new todo:", todoToAdd);

    const { title, description } = todoToAdd;

    try {
      const data = await axiosInstance.post(
        `/todos`,
        { data: { title, description } },
        {
          headers: {
            Authorization: `Bearer ${userData?.jwt}`,
          },
        },
      );
      console.log(data);
      if (data.status === 200 || data.status === 201) {
        setQueryVersion((prevVersion) => prevVersion + 1);
        onCloseAddModal();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsUpdated(false);
    }
  };

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
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10 flex items-center space-x-3">
        <Button size="sm" onClick={onOpenAddModal}>
          Post New Todo
        </Button>
        <Button variant="outline" size="sm" onClick={onGenerateTodos}>
          Create Todos
        </Button>
      </div>
      {data?.todos?.length > 0 ? (
        data?.todos?.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 even:bg-gray-100 duration-300 rounded-md p-3"
          >
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center space-x-3 w-full justify-end">
              <Button size="sm" onClick={() => onOpenEditModal(todo)}>
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  openConfirmModal(todo);
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2 className="text-center text-gray-500">No todos found.</h2>
      )}
      {/* Update Modal */}
      {
        <Modal
          isOpen={isEditModalOpen}
          closeModal={onCloseEditModal}
          title="Edit Todo"
          description="Edit the selected todo item"
        >
          <form onSubmit={(e) => onSubmitUpdateTodo(e)} className="space-y-4">
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
              <Button type="button" variant="cancel" onClick={onCloseEditModal}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      }
      {/* Delete Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this todo from your store ?"
        description="Deleting this todo will remove it permenantly from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3 mt-4">
          <Button variant="danger" onClick={onRemove}>
            Yes , Remove
          </Button>
          <Button type="button" variant="cancel" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
      {/* Add Modal */}
      <Modal
        isOpen={isOpenAddModal}
        closeModal={onCloseAddModal}
        title="Add New Todo"
        description="Fill in the details to create a new todo item"
      >
        <form onSubmit={(e) => onSubmitAddTodo(e)} className="space-y-4">
          <Input
            name="title"
            placeholder="Todo title"
            onChange={(e) => onChangeAddHandler(e)}
          />
          <Textarea
            name="description"
            placeholder="Todo description"
            onChange={(e) => onChangeAddHandler(e)}
          />
          <div className="flex justify-center items-center my-4 space-x-4">
            <Button
              className="bg-indigo-700 hover:bg-gray-800"
              isLoading={isUpdated}
              type="submit"
            >
              Add Todo
            </Button>
            <Button
              type="button"
              variant="cancel"
              onClick={() => setIsOpenAddModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
