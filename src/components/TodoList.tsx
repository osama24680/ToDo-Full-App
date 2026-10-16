import Button from "./ui/Button";
import useCustomQuery from "../Hooks/useCustomQuery";
import Modal from "./ui/Modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import { ITodo } from "../Interfaces";
import axiosInstance from "../Config/axios.config";
import TodoSkeleton from "./TodoSkeleton";
import LoadError from "./LoadError";
import { EditIcon, InboxIcon, PlusIcon, TrashIcon } from "./ui/Icons";

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
};

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
  const { isLoading, isError, data } = useCustomQuery(configData);

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

  const onSubmitUpdateTodo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdated(true);

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

  const todos: ITodo[] = data?.todos ?? [];
  const username: string = userData?.user?.username ?? "there";
  const withNotes = todos.filter((t) => t.description?.trim()).length;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const header = (
    <div className="surface relative mb-8 overflow-hidden p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet/25 blur-3xl" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-aqua">{today}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            {greeting()}, <span className="text-brand capitalize">{username}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">Here is everything on your plate.</p>
        </div>
        <Button onClick={onOpenAddModal}>
          <PlusIcon width={18} height={18} strokeWidth={2.5} />
          New todo
        </Button>
      </div>

      <div className="relative mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
        <div className="rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-inset ring-white/[0.06]">
          <p className="text-2xl font-bold text-white">{isLoading ? "–" : todos.length}</p>
          <p className="text-xs text-slate-400">Total todos</p>
        </div>
        <div className="rounded-xl bg-white/[0.04] px-4 py-3 ring-1 ring-inset ring-white/[0.06]">
          <p className="text-2xl font-bold text-white">{isLoading ? "–" : withNotes}</p>
          <p className="text-xs text-slate-400">With notes</p>
        </div>
      </div>
    </div>
  );

  // one render path, so the add/edit/delete modals are mounted in every state
  return (
    <div>
      {header}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <TodoSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <LoadError what="your todos" />
      ) : todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((todo, i) => (
            <li
              key={todo.id}
              className="surface group flex animate-fade-up items-start gap-4 p-5 transition hover:border-violet/30 hover:shadow-glow"
              style={{ animationDelay: `${Math.min(i, 10) * 40}ms` }}
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/5 text-xs font-bold text-slate-400 ring-1 ring-inset ring-white/10 group-hover:bg-brand group-hover:text-ink-900">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-semibold text-white">{todo.title}</h2>
                {todo.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-400">{todo.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1 transition sm:opacity-60 sm:group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${todo.title}`}
                  onClick={() => onOpenEditModal(todo)}
                >
                  <EditIcon width={17} height={17} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${todo.title}`}
                  className="hover:bg-rose-500/10 hover:text-rose-400"
                  onClick={() => openConfirmModal(todo)}
                >
                  <TrashIcon width={17} height={17} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="surface flex flex-col items-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/5 text-aqua ring-1 ring-inset ring-white/10">
            <InboxIcon width={28} height={28} />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-white">No todos yet</h2>
          <p className="mt-1 max-w-xs text-sm text-slate-400">
            Your list is clear. Add your first task and start getting things done.
          </p>
          <Button className="mt-6" onClick={onOpenAddModal}>
            <PlusIcon width={18} height={18} strokeWidth={2.5} />
            Create your first todo
          </Button>
        </div>
      )}

      {/* Update Modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModal={onCloseEditModal}
        title="Edit todo"
        description="Update the title or details of this task."
        icon={
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet/15 text-violet ring-1 ring-inset ring-violet/30">
            <EditIcon />
          </span>
        }
      >
        <form onSubmit={(e) => onSubmitUpdateTodo(e)} className="space-y-3">
          <Input name="title" value={todoToEdit.title} onChange={(e) => onChangeHandler(e)} />
          <Textarea name="description" value={todoToEdit.description} onChange={(e) => onChangeHandler(e)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="cancel" size="sm" onClick={onCloseEditModal}>
              Cancel
            </Button>
            <Button isLoading={isUpdated} type="submit" size="sm">
              Save changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Delete this todo?"
        description={`"${todoToEdit.title}" will be removed permanently. This action can't be undone.`}
        icon={
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/30">
            <TrashIcon />
          </span>
        }
      >
        <div className="flex justify-end gap-3">
          <Button type="button" variant="cancel" size="sm" onClick={closeConfirmModal}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onRemove}>
            Yes, delete
          </Button>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isOpenAddModal}
        closeModal={onCloseAddModal}
        title="New todo"
        description="What do you want to get done?"
        icon={
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-aqua/15 text-aqua ring-1 ring-inset ring-aqua/30">
            <PlusIcon />
          </span>
        }
      >
        <form onSubmit={(e) => onSubmitAddTodo(e)} className="space-y-3">
          <Input name="title" placeholder="Todo title" onChange={(e) => onChangeAddHandler(e)} />
          <Textarea name="description" placeholder="Add some details (optional)" onChange={(e) => onChangeAddHandler(e)} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="cancel" size="sm" onClick={() => setIsOpenAddModal(false)}>
              Cancel
            </Button>
            <Button isLoading={isUpdated} type="submit" size="sm">
              Add todo
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TodoList;
