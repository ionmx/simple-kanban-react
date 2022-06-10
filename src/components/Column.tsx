import { BoardCompleteProps, ColumnProps, TaskProps } from "../interfaces";
import Task from "./Task";
import { createTask, getBoard } from '../services/KanbanService';
import { useBoard } from "../context/BoardContext";
import { Droppable } from "react-beautiful-dnd";
import { activityIndicatorOff, activityIndicatorOn } from "./ActivityIndicator";


const Column = (column: ColumnProps) => {
  const board = useBoard()?.board;
  const setBoard = useBoard()?.setBoard;


  const showNewTask = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button: HTMLButtonElement = event.currentTarget;
    const col = button.dataset.column;
    const newTaskDesc = document.getElementById("new-task-" + col);
    const newTaskButton = document.getElementById("button-" + col);
    newTaskButton?.classList.add("hidden");
    newTaskDesc?.classList.remove("hidden");
    newTaskDesc?.focus();
  }

  const submitNewTask = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const desc: HTMLTextAreaElement = event.currentTarget;
    const boardId = desc.dataset.board;
    const columnId = desc.dataset.column;
    const columnIndex = desc.dataset.index as unknown as number;
    const position = desc.dataset.position;
    const key = event.key || event.keyCode;


    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      createTask(boardId, columnId, desc.value, position).then(response => {
        activityIndicatorOff();
        const boardCopy = { ...board } as BoardCompleteProps;
        const newTask = response.data as TaskProps;
        boardCopy.columns[columnIndex].tasks.push(newTask);
        if (setBoard) {
          setBoard(boardCopy);
        }
        desc.value = '';
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      hideTaskForm(desc);
    }
  }

  const onBlurNewTask = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const desc: HTMLTextAreaElement = event.currentTarget;
    hideTaskForm(desc);
  }

  const hideTaskForm = (desc: HTMLTextAreaElement) => {
    const columnId = desc.dataset.column;
    desc.value = '';
    desc.classList.add("hidden");
    const newTaskButton = document.getElementById("button-" + columnId);
    newTaskButton?.classList.remove("hidden");
  }

  let position = 0;

  return (
    <div key={column.id} className="my-4 max-w-sm min-h-48 p-1 rounded-lg bg-slate-100">
      <h3 className="font-medium uppercase text-xs py-2 pl-1">{column.title}</h3>

      <Droppable droppableId={`${column.index}`}>
        {(provided) => (
          <div {...provided.droppableProps} 
            ref={provided.innerRef}>
            {column.tasks.map((task, index) => (
              <Task key={task.id} {...task} index={index}/>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <textarea id={`new-task-${column.id}`}
        className="rounded w-full h-14 p-2 text-sm resize-none hidden outline-none drop-shadow-sm border-blue-500 border-2"
        data-position={position + 1}
        data-index={column.index}
        data-column={column.id}
        data-board={board?.id}
        onKeyDown={submitNewTask}
        onBlur={onBlurNewTask}
        placeholder="What needs to be done?"
      />
      <button id={`button-${column.id}`}
        className="w-full p-2 mb-2 hover:bg-slate-200 rounded-lg text-sm text-slate-800 font-medium text-left"
        data-column={column.id}
        onClick={showNewTask} >
        <span className="text-green-400">+</span> Add Task
      </button>

    </div>
  )
}

export default Column;