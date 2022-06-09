import { useBoard } from "../context/BoardContext";
import DefaultContainer from "../components/DefaultContainer"
import Column from "../components/Column"
import { useNavigate } from 'react-router-dom';
import { idText } from "typescript";


const CompleteBoard = () => {
  const board = useBoard()?.board;
  const navigate = useNavigate();
  let columnsLength = 0;
  if (board) {
    columnsLength = Object.keys(board.columns).length;
  }
  
  let columnCount = 0;
  let position = 0;
  return (
    <DefaultContainer title={board?.title} description={board?.description}>
      <div className={`grid gap-4  grid-cols-${columnsLength + 1}`}>
        {board?.columns.map((column) => {
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
    </DefaultContainer>
  )
}

export default CompleteBoard;