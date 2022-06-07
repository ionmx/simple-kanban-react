import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardProps } from './interfaces';
import { getAllBoards } from './services/KanbanService';


function App() {
  const [boards, setBoards] = useState<null | BoardProps[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    getAllBoards().then(response => {
      setBoards(response.data);
    });
  }, []);

  if (!boards) {
    return <></>
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-4 gap-4">
        {boards.map((board) => {
          return (
            <div className="my-4 max-w-sm h-48 rounded border bg-white overflow-hidden shadow-lg hover:cursor-pointer" onClick={() => navigate(`/board/${board.id}`)} >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{board.title}</div>
                <p className="text-gray-700 text-base">{board.description}</p>
              </div>
            </div>
          );
        })
        }
        <div className="my-4 max-w-sm h-48 rounded border bg-white overflow-hidden shadow-lg hover:cursor-pointer">
          <div className="px-6 py-4 text-center">
            <div className="font-bold text-8xl mb-2 text-green-400">+</div>
            <p className="text-gray-500 text-base">ADD BOARD</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


