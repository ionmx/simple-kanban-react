import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardProps } from './interfaces';
import BoardCard from './components/BoardCard';
import AddBoardForm from './components/AddBoardForm';
import { getAllBoards } from './services/KanbanService';


function App() {
  const [boards, setBoards] = useState<null | BoardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBoards().then(response => {
      setBoards(response.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <></>
  }

  return (
    <div className="container mx-auto mt-4">
      <h1 className="font-bold text-3xl mb-2">Boards</h1>
      <div className="grid p-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {boards?.map((board) => {
          return (
            <BoardCard key={board.id} {...board}></BoardCard>
          );
        })
        }
        <AddBoardForm></AddBoardForm>
      </div>
    </div>
  );
}

export default App;


