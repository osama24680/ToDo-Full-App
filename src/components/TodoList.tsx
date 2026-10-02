import Button from "./ui/Button";
import useAuthenticatedQuery from "../Hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { useState } from "react";
import Input from "./ui/Input";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  console.log(userData);

  const configData = {
    queryKey: ["todos"],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData?.jwt}`,
      },
    },
  };
  const { isLoading, data } = useAuthenticatedQuery(configData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const onToggleModal = () => {
    setIsEditModalOpen((prevState) => !prevState);
  };
  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="space-y-1">
      {data.todos.length > 0 ? (
        data.todos.map((todo: string) => (
          <div className="flex items-center justify-between hover:bg-gray-100 even:bg-gray-100 duration-300 rounded-md p-3">
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center space-x-3 w-full justify-end">
              <Button size="sm" onClick={onToggleModal}>
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
          closeModal={onToggleModal}
          title="Edit Todo"
          description="Edit the selected todo item"
        >
          <Input value="Edit Todo" />
          <div className="flex justify-center items-center my-4 space-x-4">
            <Button className=" bg-indigo-700 hover:bg-gray-800 ">
              Update
            </Button>
            <Button variant="cancel" onClick={onToggleModal}>
              Cancel
            </Button>
          </div>
        </Modal>
      }
    </div>
  );
};

export default TodoList;
