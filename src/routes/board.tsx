import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { getBoard } from '../services/KanbanService';
import { BoardCompleteProps } from '../interfaces'
import Column from "../components/Column";


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
            <Column key={column.id} {...column}></Column>
          );
        })}
      </div>
      <div className="text-center my-8">
        <button className="text-xs text-blue-800 underline" onClick={() => navigate('/')}>Return to boards list</button>
      </div>

    </div>
  );
}

export default Board;