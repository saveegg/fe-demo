"use client";

import { useTodos as useTodo } from "@/store/todo";
import axios from "axios";
import { useFormik } from "formik";
import { BiLoaderAlt } from "react-icons/bi";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import * as yup from "yup";

type Props = {};

export type Todo = {
  id: string;
  beId: number;
  task: string;
  completed: boolean;
  createdAt: Date;
};

const taskSchema = yup.object().shape({
  todo: yup.string().min(5).required("Valid task is required"),
});

const AddTodo = (props: Props) => {
  const [Loading, setLoading] = useState(false);
  // const handleFormSubmit = (e: React.FocusEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   handleAddTodo(values.todo);
  // };

  const onTaskAdded = async () => {
    try {
        setLoading(true);
        // const response = await axios.post("/api/usertask", { title: values.todo });

        // // Get existing todos from localStorage or initialize an empty array
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
      toast.success("task added successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleAddTodo } = useTodo();
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
  } = useFormik({
    initialValues: {
      todo: "",
    },
    validationSchema: taskSchema,
    onSubmit: (values: { todo: string }, formikHelpers: any) => {
      handleAddTodo(values.todo);
      formikHelpers.resetForm();
    },
  });

  useEffect(() => {
    setIsSubmitting(isValid);
  }, [isValid]);

  return (
    <form
      className="grid gap-5 grid-cols-3 grid-rows-1 px-5 my-8 items-center"
      onSubmit={handleSubmit}
    >
      <input
        className={` ${
          errors.todo && touched.todo
            ? `text-white rounded-lg p-3 placeholder:text-black/30 block w-full shadow-sm focus:outline-none focus:border-red-600 border-2 bg-transparent border-red-600 placeholder:text-gray-400 transition-all`
            : ``
        } text-white rounded-lg p-3 lg:mr-5 placeholder:text-black/30 block py-1.5 w-full
          shadow-sm  focus:outline-none border-2 bg-transparent border-gray-600
           placeholder:text-gray-400  focus:border-blue-600 transition-all col-span-3 lg:col-span-2 row-span-1`}
        type="text"
        name="todo"
        placeholder="Write your task...."
        value={values.todo}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <button
        onClick={onTaskAdded}
        className={`px-6 py-2 hover:opacity-70 rounded-full col-span-3 lg:col-span-1 ${
          errors.todo && touched.todo
            ? "bg-red-600 shake-horizontal"
            : "bg-blue-600"
        } ${
          (isSubmitting && !errors.todo) || touched.todo
            ? "bg-blue-600"
            : "bg-red-600 shake-horizontal"
        }`}
      >
        <p className="flex justify-center items-center gap-3">
          Add task
          <span>{Loading ? <BiLoaderAlt className="animate-spin" /> : ""}</span>
        </p>
      </button>
      {errors.todo && touched.todo && (
        <p className="text-red-600 row-span-1 col-span-3">{errors.todo}</p>
      )}
    </form>
  );
};

export default AddTodo;
