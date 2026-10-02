import { useEffect, useState } from "react";
import Button from "./ui/Button";
import axiosInstance from "../Config/axios.config";

import { useQuery } from "@tanstack/react-query";
const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  console.log(userData);

  const { isLoading, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/me?populate=todos", {
        headers: {
          Authorization: `Bearer ${userData?.jwt}`,
        },
      });
      console.log(data.todos);
      return data;
    },
  });
  console.log(data);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="space-y-1">
      {data.length > 0 ? (
        data.todos.map((todo: string) => (
          <div className="flex items-center justify-between hover:bg-gray-100 even:bg-gray-100 duration-300 rounded-md p-3">
            <p className="w-full font-semibold">{todo.title}</p>
            <div className="flex items-center space-x-3 w-full justify-end">
              <Button size="sm">Edit</Button>
              <Button variant="danger" size="sm">
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2 className="text-center text-gray-500">No todos found.</h2>
      )}
    </div>
  );
};

export default TodoList;
