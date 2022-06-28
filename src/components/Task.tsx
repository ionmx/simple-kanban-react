import { useBoard } from "../context/BoardContext";
import { Draggable } from "react-beautiful-dnd";
import { KeyboardEvent, MouseEvent, FocusEvent } from 'react'
import { BoardCompleteProps, TaskProps } from "../interfaces";
import { activityIndicatorOff, activityIndicatorOn } from "./ActivityIndicator";
import { updateTask, deleteTask } from '../services/KanbanService'
import { XIcon } from '@heroicons/react/outline'

const Task = (task: TaskProps) => {
  const board = useBoard()?.board;
  const setBoard = useBoard()?.setBoard;

  const editTask = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const desc: HTMLTextAreaElement = event.currentTarget;
    const boardId = desc.dataset.board;
    const columnId = desc.dataset.column;
    const taskId = desc.dataset.task;
    const columnIndex = desc.dataset.column_index as unknown as number;
    const taskIndex = desc.dataset.index as unknown as number;

    const key = event.key || event.keyCode;


    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      updateTask(boardId, columnId, taskId, desc.value).then(response => {
        activityIndicatorOff();
        const boardCopy = { ...board } as BoardCompleteProps;
        const newTask = response.data as TaskProps;
        boardCopy.columns[columnIndex].tasks[taskIndex] = newTask;
        if (setBoard) {
          setBoard(boardCopy);
          hideEditTask(desc);
        }
        desc.value = '';
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      hideEditTask(desc);
    }
  };

  const enableEditTask = (event: MouseEvent<HTMLDivElement>) => {
    const div: HTMLDivElement = event.currentTarget;
    const task = div.dataset.task;
    const textarea = document.getElementById(`task-textarea-${task}`);
    div.classList.add('hidden');
    textarea?.classList.remove('hidden');
    textarea?.focus();
  }

  const hideEditTask = (desc: HTMLTextAreaElement) => {
    const task = desc.dataset.task;
    const text = document.getElementById(`task-text-${task}`);
    desc.value = `${desc.dataset.original}`;
    desc.classList.add('hidden');
    text?.classList.remove('hidden');
  }

  const onBlurEditTask = (event: FocusEvent<HTMLTextAreaElement>) => {
    const desc: HTMLTextAreaElement = event.currentTarget;
    hideEditTask(desc);
  }

  const removeTask = (event: MouseEvent<HTMLDivElement>) => {
    const div: HTMLDivElement = event.currentTarget;
    const boardId = div.dataset.board;
    const columnId = div.dataset.column;
    const taskId = div.dataset.task;
    const columnIndex = div.dataset.column_index as unknown as number;
    const taskIndex = div.dataset.index as unknown as number;
    if (window.confirm('Are you sure?')) {
      deleteTask(boardId, columnId, taskId).then(response => {
        const boardCopy = { ...board } as BoardCompleteProps;
        boardCopy.columns[columnIndex].tasks.splice(taskIndex, 1);
        if (setBoard) {
          setBoard(boardCopy);
        }
      });
    }
  }


return (
  <Draggable draggableId={`${task.id}`} index={task.index}>
    {(provided, snapshot) => {
      return (
        <div
          className={`group mb-2 p-0 rounded border bg-white drop-shadow-sm 
                     ${snapshot.isDragging
              ? "drop-shadow-xl"
              : ""
            }`
          }
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            className="hidden group-hover:block hover:cursor-pointer h-4 w-4 m-1 text-gray-400 float-right"
            data-board={task.board_id}
            data-column={task.column_id}
            data-column_index={task.column_index}
            data-index={task.index}
            data-task={task.id}
            onClick={removeTask}>
            <XIcon
              aria-hidden="true"
            />
          </div>
          <div
            id={`task-text-${task.id}`}
            className="h-14 p-2"
            data-task={task.id}
            onClick={enableEditTask}>
            {task.description}
          </div>
          <textarea
            id={`task-textarea-${task.id}`}
            className="hidden rounded w-full p-2 text-sm resize-none outline-none drop-shadow-sm border-blue-500 border-2"
            data-original={task.description}
            data-board={task.board_id}
            data-column={task.column_id}
            data-column_index={task.column_index}
            data-index={task.index}
            data-task={task.id}
            onKeyDown={editTask}
            onBlur={onBlurEditTask}
            placeholder="What needs to be done?"
            defaultValue={task.description}>
          </textarea>
        </div>
      )
    }
    }
  </Draggable>
);
}

export default Task;