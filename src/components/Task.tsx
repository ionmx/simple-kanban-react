import { TaskProps } from "../interfaces";

const Task = (task: TaskProps) => {
  return (
    <li className="my-2 rounded border bg-white p-2 pb-8 text-sm hover:cursor-grab drop-shadow-sm">{task.description}</li>
  );
}

export default Task;