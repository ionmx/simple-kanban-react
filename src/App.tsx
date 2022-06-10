import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardProps } from './interfaces';
import BoardCard from './components/BoardCard';
import AddBoardForm from './components/AddBoardForm';
import { getAllBoards } from './services/KanbanService';
import DefaultContainer from "./components/DefaultContainer";
import { activityIndicatorOff, activityIndicatorOn } from './components/ActivityIndicator';

function App() {
  const [boards, setBoards] = useState<null | BoardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    activityIndicatorOn();
    getAllBoards().then(response => {
      setBoards(response.data);
      setLoading(false);
      activityIndicatorOff();
    });
  }, []);

  if (loading) {
    return <></>
  }

  return (
    <DefaultContainer title="Boards" description="">
      <div className="grid p-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {boards?.map((board) => {
          return (
            <BoardCard key={board.id} {...board}></BoardCard>
          );
        })
        }
        <AddBoardForm></AddBoardForm>
      </div>
    </DefaultContainer>
  );
}

export default App;


