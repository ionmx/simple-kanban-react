import React, { MouseEventHandler, useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { createTask, getBoard } from '../services/KanbanService';
import { BoardCompleteProps } from '../interfaces'


const Board = () => {
  const [board, setBoard] = useState<null | BoardCompleteProps>(null);
  const { id } = useParams();
  const navigate = useNavigate();

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
    const board_id = desc.dataset.board;
    const column_id = desc.dataset.column;
    const position = desc.dataset.position;
    const key = event.key || event.keyCode;

    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      createTask(board_id, column_id, desc.value, position).then(response => {
        // FIXME: I think it's best to push new task item to board/column but don't know how...
        // board?.columns[0].tasks.push(response.data);
        getBoard(id).then(response => {
          setBoard(response.data);
        });
        desc.value = '';
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      desc.value = '';
      desc.classList.add("hidden");
      const newTaskButton = document.getElementById("button-" + column_id);
      newTaskButton?.classList.remove("hidden");
    }


  }

  useEffect(() => {
    getBoard(id).then(response => {
      setBoard(response.data);
    });
  }, [id]);

  if (!board) {
    return <></>
  }

  const columnsLength = Object.keys(board.columns).length;
  let columnCount = 0;
  let position = 0;

  return (
    <div className="container mx-auto mt-4">
      <h1 className="font-bold text-3xl mb-2">{board.title}</h1>
      <p className="text-sm text-gray-400">{board.description}</p>
      <div className={`grid gap-4  grid-cols-${columnsLength + 1}`}>
        {board.columns.map((column) => {
          position = 0;
          columnCount += 1;
          return (
            <div key={column.id} className="my-4 max-w-sm min-h-48 rounded border bg-slate-200 shadow-lg p-2">
              <h3 className="font-bold text-l">{column.title}</h3>
              {column.tasks.map((task) => {
                position += 1;
                return (
                  <div key={task.id} className="my-2 rounded border bg-white p-2 pb-8 font-bold text-sm hover:cursor-grab">
                    {task.description}
                  </div>
                )
              })}
              <textarea id={`new-task-${column.id}`} data-position={position + 1} data-column={column.id} data-board={board.id} className="my-2 w-full h-12 p-1 text-xs resize-none hidden" placeholder="What needs to be done?" onKeyDown={submitNewTask}></textarea>
              <button id={`button-${column.id}`} className="w-full p-2 my-2 bg-slate-100 rounded-lg text-sm text-slate-800 font-bold" onClick={showNewTask} data-column={column.id}><span className="text-green-400">+</span> Add Task</button>
            </div>
          );
        })}
      </div>
      <div className="text-center">
        <button className="pt-8 text-xs text-blue-800 underline" onClick={() => navigate('/')}>Return to boards list</button>
      </div>

    </div>
  );
}

export default Board;