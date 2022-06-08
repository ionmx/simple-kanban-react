import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardProps } from './interfaces';
import { getAllBoards, createBoard } from './services/KanbanService';


function App() {
  const [boards, setBoards] = useState<null | BoardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const showAddBoardForm = () => {
    const f = document.getElementById("flip-add-form");
    const i = document.getElementById("new-board-title");
    f?.classList.add("show-form");
    i?.focus();
  }
  
  const hideAddBoardForm = () => {
    const f = document.getElementById("flip-add-form");
    f?.classList.remove("show-form");
  }
  
  const createNewBoard = () => {
    const title = document.getElementById('new-board-title') as HTMLInputElement | null;
    const description = document.getElementById('new-board-description') as HTMLTextAreaElement | null;
    createBoard(title?.value, description?.value).then(response => {
      navigate(`/board/${response.data.id}`);
    })
  }

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
            <div key={board.id} className="my-1 max-w-sm h-48 rounded border bg-white overflow-hidden shadow-lg hover:cursor-pointer" onClick={() => navigate(`/board/${board.id}`)} >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{board.title}</div>
                <p className="text-gray-700 text-base">{board.description}</p>
              </div>
            </div>
          );
        })
        }
        <div id="flip-add-form" className="flip-container">
          <div className="flipper">
            <div className="front my-1 max-w-sm rounded border bg-white overflow-hidden shadow-lg hover:cursor-pointer" onClick={() => showAddBoardForm()} >
              <div className="px-6 py-4 text-center">
                <div className="font-bold text-8xl mb-2 text-green-400">+</div>
                <p className="text-gray-500 text-base">ADD BOARD</p>
              </div>
            </div>
            <div className="back my-1 max-w-sm rounded border bg-white overflow-hidden shadow-lg">
              <div className="bg-slate-600 text-white font-bold p-2">
                Add Board...
                <button className="float-right text-l text-white" onClick={() => hideAddBoardForm()}>&#x2715;</button>
              </div>
              <div className="p-2">
                <input className="border w-full mb-2 p-2 text-xs font-bold" id="new-board-title" placeholder="Title..." />
                <textarea className="border w-full h-12 p-2 text-xs" id="new-board-description" placeholder="Description..."></textarea>
                <button className="bg-green-400 p-1 rounded w-full text-white" onClick={() => createNewBoard()}>Add Board</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


