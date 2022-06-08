import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getBoard } from '../services/KanbanService';
import { BoardCompleteProps } from '../interfaces'


const Board = () => {
  const [board, setBoard] = useState<null | BoardCompleteProps>(null);
  const { id } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto mt-4">
      <h1 className="font-bold text-3xl mb-2">{board.title}</h1>
      <p className="text-sm text-gray-400">{board.description}</p>
      <div className={`grid gap-4  grid-cols-${columnsLength + 1}`}>
        {board.columns.map((column) => {
          columnCount += 1;
          return (
            <div key={column.id} className="my-4 max-w-sm min-h-48 rounded border bg-slate-200 shadow-lg p-3">
              <h3 className="font-bold text-l">{column.title}</h3>
              {column.tasks.map((task) => {
                return (
                  <div className="my-4 rounded border bg-white p-2 pb-8 font-bold text-sm hover:cursor-grab">
                    {task.description}
                  </div>
                )
              })}
              { columnCount === 1? <button className="w-full p-2 mt-4 bg-slate-100 rounded-lg text-sm text-slate-800 font-bold"><span className="text-green-400">+</span> Add Task</button> : <></> }
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