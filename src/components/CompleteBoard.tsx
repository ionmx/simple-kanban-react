import { useBoard } from "../context/BoardContext";
import DefaultContainer from "../components/DefaultContainer"
import Column from "../components/Column"
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { BoardCompleteProps, ColumnProps, TaskProps } from "../interfaces";
import { moveColumn, moveTask } from "../services/KanbanService";
import { activityIndicatorOff, activityIndicatorOn } from "./ActivityIndicator";


const CompleteBoard = () => {
  const board = useBoard()?.board;
  const setBoard = useBoard()?.setBoard;
  const navigate = useNavigate();

  let columnsLength = 0;
  if (board) {
    columnsLength = Object.keys(board.columns).length;
  }

  const onDragEnd = (result: DropResult) => {

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

    if (!result.destination) {
      return;
    }

    if (
      result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index
    ) {
      return;
    }

    const boardCopy = { ...board } as BoardCompleteProps;

    const sourceId = parseInt(result.source?.droppableId);
    const sourceIndex = result.source?.index;
    const destinationId = parseInt(result.destination?.droppableId);
    const destinationIndex = result.destination?.index;


    // MOVE COLUMN
    // -----------
    if (result.type === 'column') {
      const columnId = parseInt(result.draggableId);
      const cols = boardCopy.columns;
      const removedColumn = cols.splice(sourceIndex, 1);
      cols.splice(destinationIndex, 0, removedColumn[0]);

      if (setBoard) {
        setBoard(boardCopy);
      }

      activityIndicatorOn();
      moveColumn(
        board?.id as number,
        columnId as number,
        destinationIndex)
        .then(response => {
          activityIndicatorOff();
        });
      return;
    }

    // MOVE TASK
    //----------
    const taskId = parseInt(result.draggableId);
    const sourceColumnId = board?.columns[sourceId].id;
    const destinationColumnId = board?.columns[destinationId].id;

    // Remove task from source column 
    const sourceColumn = boardCopy.columns[sourceId];
    const [removedElement, newSourceColumn] = removeFromColumn(
      sourceColumn,
      sourceIndex
    );
    boardCopy.columns[sourceId].tasks = newSourceColumn as TaskProps[];

    // Add removed task to destination column
    const destinationColumn = boardCopy.columns[destinationId];
    boardCopy.columns[destinationId].tasks = addToColumn(
      destinationColumn,
      destinationIndex,
      removedElement as TaskProps
    );

    if (setBoard) {
      setBoard(boardCopy);
    }

    activityIndicatorOn();
    moveTask(
      board?.id as number,
      taskId,
      destinationColumnId as number,
      destinationIndex)
      .then(response => {
        activityIndicatorOff();
      });

  };

  return (
    <DefaultContainer title={board?.title} description={board?.description}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <div
              className={`grid gap-4  grid-cols-${columnsLength + 1}`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {board?.columns.map((column, index) => {
                return (
                  <Column key={column.id} {...column} index={index}></Column>
                );
              })}
              {provided.placeholder}
            </div>
          )}

        </Droppable>
        <div className="text-center my-8">
          <button className="text-xs text-blue-800 underline" onClick={() => navigate('/')}>Return to boards index.</button>
        </div>
      </DragDropContext>
    </DefaultContainer>
  )
}

export default CompleteBoard;