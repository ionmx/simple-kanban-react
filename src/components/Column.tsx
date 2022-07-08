import { BoardCompleteProps, ColumnProps, TaskProps } from "../interfaces";
import { KeyboardEvent, MouseEvent, FocusEvent } from 'react'
import Task from "./Task";
import { createTask, updateColumn, deleteColumn } from '../services/KanbanService';
import { useBoard } from "../context/BoardContext";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { activityIndicatorOff, activityIndicatorOn } from "./ActivityIndicator";
import { XIcon } from "@heroicons/react/outline";


const Column = (column: ColumnProps) => {
  const board = useBoard()?.board;
  const setBoard = useBoard()?.setBoard;

  const editColumn = (event: KeyboardEvent<HTMLInputElement>) => {
    const title: HTMLInputElement = event.currentTarget;
    const boardId = title.dataset.board;
    const columnId = title.dataset.column;
    const columnIndex = title.dataset.index as unknown as number;

    const key = event.key || event.keyCode;


    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      updateColumn(boardId, columnId, title.value).then(response => {
        activityIndicatorOff();
        const boardCopy = { ...board } as BoardCompleteProps;
        const newColumn = response.data as ColumnProps;
        boardCopy.columns[columnIndex].title = newColumn.title;
        if (setBoard) {
          setBoard(boardCopy);
          hideEditColumn(title);
        }
        title.value = '';
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      hideEditColumn(title);
    }
  };

  const enableEditColumn = (event: MouseEvent<HTMLDivElement>) => {
    const div: HTMLDivElement = event.currentTarget;
    const column = div.dataset.column;
    const input = document.getElementById(`column-input-${column}`);
    div.classList.add('hidden');
    input?.classList.remove('hidden');
    input?.focus();
  }

  const hideEditColumn = (title: HTMLInputElement) => {
    const column = title.dataset.column;
    const text = document.getElementById(`column-text-${column}`);
    title.value = `${title.dataset.original}`;
    title.classList.add('hidden');
    text?.classList.remove('hidden');
  }

  const onBlurEditColumn = (event: FocusEvent<HTMLInputElement>) => {
    const title: HTMLInputElement = event.currentTarget;
    hideEditColumn(title);
  }

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
    const key = event.key || event.keyCode;


    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      createTask(boardId, columnId, desc.value).then(response => {
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

  const removeColumn = (event: MouseEvent<HTMLDivElement>) => {
    const div: HTMLDivElement = event.currentTarget;
    const boardId = div.dataset.board;
    const columnId = div.dataset.column;
    const columnIndex = div.dataset.index as unknown as number;
    const boardCopy = { ...board } as BoardCompleteProps;

    if (boardCopy.columns[columnIndex].tasks.length > 0) {
      alert('Column is not empty');
      return;
    }

    if (window.confirm('Are you sure?')) {
      deleteColumn(boardId, columnId).then(response => {
        boardCopy.columns.splice(columnIndex, 1);
        if (setBoard) {
          setBoard(boardCopy);
        }
      });
    }
  }

  return (
    <Draggable draggableId={`column-${column.id}`} index={column.index}>
      {(provided, snapshot) => (
        <div
          key={column.id}
          className={`my-4 max-w-sm min-h-48 p-1 rounded-lg bg-slate-100
                      ${snapshot.isDragging
              ? "drop-shadow-lg"
              : ""
            }`
          }
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="group">
            <div
              className="hidden group-hover:block hover:cursor-pointer h-4 w-4 m-1 text-gray-400 float-right"
              data-board={column.board_id}
              data-column={column.id}
              data-index={column.index}
              onClick={removeColumn}>
              <XIcon
                aria-hidden="true"
              />
            </div>
            <div
              id={`column-text-${column.id}`}
              className="font-medium text-xs py-2 pl-1"
              data-column={column.id}
              onClick={enableEditColumn}
              {...provided.dragHandleProps}
            >
              {column.title}
            </div>
          </div>

          <input
            id={`column-input-${column.id}`}
            className="hidden rounded w-full p-2 text-sm resize-none outline-none drop-shadow-sm border-blue-500 border-2"
            data-original={column.title}
            data-board={column.board_id}
            data-column={column.id}
            data-index={column.index}
            onKeyDown={editColumn}
            onBlur={onBlurEditColumn}
            defaultValue={column.title} />

          <Droppable droppableId={`${column.index}`} type="task">
            {(provided) => (
              <div {...provided.droppableProps}
                ref={provided.innerRef}>
                {column.tasks.map((task, index) => (
                  <Task key={task.id} {...task} index={index} board_id={column.board_id} column_id={column.id} column_index={column.index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <textarea id={`new-task-${column.id}`}
            className="rounded w-full h-14 p-2 text-sm resize-none hidden outline-none drop-shadow-sm border-blue-500 border-2"
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
      )}
    </Draggable>
  )
}

export default Column;