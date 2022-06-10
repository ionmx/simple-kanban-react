import { useBoard } from "../context/BoardContext";
import DefaultContainer from "../components/DefaultContainer"
import Column from "../components/Column"
import { useNavigate } from 'react-router-dom';
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { BoardCompleteProps, ColumnProps, TaskProps } from "../interfaces";
import { moveTask } from "../services/KanbanService";


const CompleteBoard = () => {
  const board = useBoard()?.board;
  const setBoard = useBoard()?.setBoard;
  const navigate = useNavigate();

  let columnsLength = 0;
  if (board) {
    columnsLength = Object.keys(board.columns).length;
  }

  let columnCount = 0;
  let position = 0;

  const removeFromColumn = (column: ColumnProps, index: number) => {
    const result = Array.from(column.tasks);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToColumn = (column: ColumnProps, index: number, element: TaskProps) => {
    const result = Array.from(column.tasks);
    result.splice(index, 0, element);
    return result;
  };

  const onDragEnd = (result: DropResult) => {

    if (!result.destination) {
      return;
    }

    const taskId = parseInt(result.draggableId);

    const sourceColumnIndex = parseInt(result.source?.droppableId);
    const sourceIndex = result.source?.index;
    const sourceColumnId = board?.columns[sourceColumnIndex].id;

    const destinationColumnIndex = parseInt(result.destination?.droppableId);
    const destinationIndex = result.destination?.index;
    const destinationColumnId = board?.columns[destinationColumnIndex].id;

    console.log(`MOVE: ${taskId} FROM<${sourceColumnId}>: ${sourceColumnIndex}[${sourceIndex}] TO<${destinationColumnId}>: ${destinationColumnIndex}[${destinationIndex}]`);
    
    moveTask(board?.id as number, sourceColumnId as number, taskId, destinationColumnId as number, destinationIndex).then(response => {

      const boardCopy = { ...board } as BoardCompleteProps;

      // Remove task from source column 
      const sourceColumn = boardCopy.columns[sourceColumnIndex];
      const [removedElement, newsourceColumn] = removeFromColumn(
        sourceColumn,
        sourceIndex
      );
      boardCopy.columns[sourceColumnIndex].tasks = newsourceColumn as TaskProps[];

      // Add removed task to destination column
      const destinationColumn = boardCopy.columns[destinationColumnIndex];
      boardCopy.columns[destinationColumnIndex].tasks = addToColumn(
        destinationColumn,
        destinationIndex,
        removedElement as TaskProps
      );

      if (setBoard) {
        setBoard(boardCopy);
      }

    });

  };

  return (
    <DefaultContainer title={board?.title} description={board?.description}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={`grid gap-4  grid-cols-${columnsLength + 1}`}>
          {board?.columns.map((column, index) => {
            position = 0;
            columnCount += 1;
            return (
              <Column key={column.id} {...column} index={index}></Column>
            );
          })}
        </div>
        <div className="text-center my-8">
          <button className="text-xs text-blue-800 underline" onClick={() => navigate('/')}>Return to boards index.</button>
        </div>
      </DragDropContext>
    </DefaultContainer>
  )
}

export default CompleteBoard;