import { createContext, useContext, useEffect, useState, ElementType } from "react";
import { BoardCompleteProps } from '../interfaces'
import { getBoard } from '../services/KanbanService';
import { useParams } from 'react-router-dom';



interface BoardProviderProps {
  children?: JSX.Element | JSX.Element[];
};

export const BoardContext = createContext<BoardCompleteProps | null>(null);

export function useBoard(): BoardCompleteProps | null {
  const context = useContext(BoardContext);
  return context;
}

export function BoardProvider({ children }: BoardProviderProps): JSX.Element {
  
  const [board, setBoard] = useState<BoardCompleteProps | null>(null);
  const [boardLoading, setBoardLoading] = useState<boolean>(true);

  const { id } = useParams();

  

  useEffect(() => {

    getBoard(id).then(response => {
      console.log('==============')
      console.log(response.data);
      setBoard(response.data);
      setBoardLoading(false);
      console.log('---------');
      console.log(board);
    });

      // getBoard(id).then(response => {
      //   console.log('SI ENTRO');
      //   console.log(id);
      //   setBoardLoading(false);
      //   setBoard(response.data);
      //   console.log(board);
      //   console.log(boardLoading);
      // });

  }, [id]);

  if (boardLoading) {
    return <></>
  }

  return (
    <BoardContext.Provider value={board}>
      {children}
    </BoardContext.Provider>
  );
}