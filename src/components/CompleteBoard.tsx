import { useBoard } from "../context/BoardContext";
import DefaultContainer from "../components/DefaultContainer"
import Column from "../components/Column"
import { useNavigate } from 'react-router-dom';
import { idText } from "typescript";
import { DragDropContext, DropResult } from "react-beautiful-dnd";


const CompleteBoard = () => {
  const board = useBoard()?.board;
  const navigate = useNavigate();
  let columnsLength = 0;
  if (board) {
    columnsLength = Object.keys(board.columns).length;
  }

  let columnCount = 0;
  let position = 0;
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    console.log(result);
    const taskId = result.draggableId;
    const sourceId = result.source?.droppableId;
    const sourceIndex = result.source?.index;
    const destinationId = result.destination?.droppableId;
    const destinationIndex = result.destination?.index;
    console.log(`MOVE: ${taskId} FROM: ${sourceId}[${sourceIndex}] TO: ${destinationId}[${destinationIndex}]`);
  };

  return (
    <DefaultContainer title={board?.title} description={board?.description}>
      <DragDropContext onDragEnd={onDragEnd}>
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
      </DragDropContext>
    </DefaultContainer>
  )
}

export default CompleteBoard;