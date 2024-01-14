"use client";

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export type Todo = {
  id: string;
  beId?: number;
  task: string;
  completed: boolean;
  createdAt: Date;
};

export type TodoContext = {
  todos: Todo[];
  handleAddTodo: (task: string) => void;
  toggleTodoCompleted: (id: string) => void;
  handleTodoDelete: (id: string) => void;
  handleSelectAll: () => void;
  handleDeleteAll: () => void;
};

export const todosContext = createContext<TodoContext | null>(null);

const handleLoadAll = async (): Promise<Todo[]> => {
  const response = await axios.post("/api/usertasks");

  const tasksFromApi: any[] = response.data.data;

  // Map fields to match your Todo type
  const tasks: Todo[] = tasksFromApi.map(apiTask => ({
    id: Math.random().toString(),
    beId: apiTask.id,
    task: apiTask.title,
    completed: false,
    createdAt: new Date(apiTask.apiCreatedAt),
  }));

  localStorage.setItem("todos", JSON.stringify(tasks));
  
  return tasks;
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  // const [todos, setTodos] = useState<Todo[]>(() => {
  //   const newTodos =
  //     typeof localStorage !== "undefined"
  //       ? localStorage.getItem("todos") || "[]"
  //       : "[]";
  //   return JSON.parse(newTodos) as Todo[];
  // });
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const newTodos = await handleLoadAll();
      setTodos(newTodos);
    };

    fetchData();
  }, []);

  const handleSelectAll = () => {
    /*setTodos((prev) => {
      const reversedTodos = prev.every((task) => task.completed);
      const updatedTodos = prev.map((task) => ({
        ...task,
        completed: !reversedTodos,
      }));
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      return updatedTodos;
    });*/
  };

  const handleDeleteAll = () => {
    /* setTodos((prev) => {
      const deleteTodo = prev.filter((task) => !task.completed);
      localStorage.setItem("todos", JSON.stringify(deleteTodo));
      return deleteTodo;
    });*/
  };

  //task add, update, delete methods are defined here

  const handleAddTodo = async (task: string) => {
    const response = await axios.post("/api/usertask", { title: task });
    const newTodos: Todo[] = await handleLoadAll();

    setTodos((prev) => {
      return newTodos;
    });

    // Get existing todos from localStorage or initialize an empty array
    // const existingTodosJSON = localStorage.getItem('todos');
    // const existingTodos: Todo[] = existingTodosJSON ? JSON.parse(existingTodosJSON) : [];

    // // Find the index of the todo with the same ID
    // const todoIndex = existingTodos.findIndex((todo) => todo.task === values.todo);

    // console.log(' FIND ', values.todo);

    // if (todoIndex !== -1) {
    //   // Update the todo in the array
    //   existingTodos[todoIndex].beId = response.data.data.id;

    //   // Save the updated array back to localStorage
    //   localStorage.setItem('todos', JSON.stringify(existingTodos));
    // } else {
    //   // console.log('Todo not found for update.');
    //   console.log(' Not Found ');
    // }

    /*setTodos((prev) => {
      const newTodos: Todo[] = [
        {
          id: Math.random().toString(),
          task,
          completed: false,
          createdAt: new Date(),
        },
        ...prev,
      ];
      console.log(' Triggered handleAddTodo');
      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });*/
  };
  const toggleTodoCompleted = (id: string) => {
    setTodos((prev) => {
      const newTodos = prev.map((task) => {
        if (task.id === id) return { ...task, completed: !task.completed };
        return task;
      });
      localStorage.setItem("todos", JSON.stringify(newTodos));
      return newTodos;
    });
  };

  const handleTodoDelete = async (id: string) => {
    // Get existing todos from localStorage or initialize an empty array
    const existingTodosJSON = localStorage.getItem('todos');
    const existingTodos: Todo[] = existingTodosJSON ? JSON.parse(existingTodosJSON) : [];

    // Find the index of the todo with the same ID
    const todoIndex = existingTodos.findIndex((todo) => todo.id === id);

    const response = await axios.post("/api/deletetask", { id: existingTodos[todoIndex].beId });

    const newTodos: Todo[] = await handleLoadAll();

    setTodos((prev) => {
      return newTodos;
    });

    /* setTodos((prev) => {
      const deleteTodo = prev.filter((task) => task.id !== id);
      localStorage.setItem("todos", JSON.stringify(deleteTodo));
      return deleteTodo;
    });*/
  };

  return (
    <todosContext.Provider
      value={{
        todos,
        handleAddTodo,
        toggleTodoCompleted,
        handleTodoDelete,
        handleSelectAll,
        handleDeleteAll,
      }}
    >
      {children}
    </todosContext.Provider>
  );
};

export function useTodos() {
  const todosContextValue = useContext(todosContext);
  if (!todosContextValue) {
    throw new Error("useTodos used outside of provider");
  }
  return todosContextValue;
}
