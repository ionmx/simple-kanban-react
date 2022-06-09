import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { BoardCompleteProps } from '../interfaces'
import { getBoard } from '../services/KanbanService';
import { useParams } from 'react-router-dom';

interface BoardProviderProps {
  children?: JSX.Element | JSX.Element[];
};

interface BoardContextProps {
  board: BoardCompleteProps | null;
  setBoard: Dispatch<SetStateAction<BoardCompleteProps | null>>;
}

export const BoardContext = createContext<BoardContextProps | null>(null);

export function useBoard(): BoardContextProps | null {
  const context = useContext(BoardContext);
  return context;
}

export function BoardProvider({ children }: BoardProviderProps): JSX.Element {
  const [board, setBoard] = useState<BoardCompleteProps | null>(null);
  const [boardLoading, setBoardLoading] = useState<boolean>(true);
  const { id } = useParams();

  useEffect(() => {
    getBoard(id).then(response => {
      setBoard(response.data);
      setBoardLoading(false);
    });
  }, [id]);

  if (boardLoading) {
    return <></>
  }

  return (
    <BoardContext.Provider value={{board, setBoard}}>
      {children}
    </BoardContext.Provider>
  );
}