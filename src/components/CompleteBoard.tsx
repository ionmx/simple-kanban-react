import { useBoard } from "../context/BoardContext";
import Column from "../components/Column"
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { BoardCompleteProps, ColumnProps, TaskProps } from "../interfaces";
import { deleteBoard, createColumn, moveColumn, moveTask, updateBoardDescription, updateBoardTitle } from "../services/KanbanService";
import { activityIndicatorOff, activityIndicatorOn } from "./ActivityIndicator";


const CompleteBoard = () => {
  const board = useBoard()?.board;
  const setBoard = useBoard()?.setBoard;
  const navigate = useNavigate();

  let columnsLength = 0;
  if (board) {
    columnsLength = Object.keys(board.columns).length + 1;
  }

  const removeBoard = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const boardId = event.currentTarget.dataset.board;

    if (window.confirm('Are you sure?')) {
      activityIndicatorOn();
      deleteBoard(boardId).then(response => {
        activityIndicatorOff();
        navigate('/');
      }).catch(error => {
        activityIndicatorOff();
        console.log(error);
      }).finally(() => {
        activityIndicatorOff();
      }
      );
    }

  };

  const showColumnForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button: HTMLButtonElement = event.currentTarget;
    const placeholder = document.getElementById('newColumnPlaceholder');
    const inputColumn = document.getElementById('newColumnInput');
    placeholder?.classList.add('rounded-lg')
    placeholder?.classList.add('bg-slate-100');
    button.classList.add('hidden');
    inputColumn?.classList.remove('hidden');
    inputColumn?.focus();
  }

  const hideColumnForm = () => {
    const button = document.getElementById('addColumnButton');
    const placeholder = document.getElementById('newColumnPlaceholder');
    const inputColumn = document.getElementById('newColumnInput') as HTMLInputElement;
    placeholder?.classList.remove('rounded-lg')
    placeholder?.classList.remove('bg-slate-100');
    button?.classList.remove('hidden');
    inputColumn?.classList.add('hidden');
    inputColumn.value = '';
  }

  const submitNewColumn = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key || event.keyCode;
    const title: HTMLInputElement = event.currentTarget;
    const boardId = title.dataset.board;

    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      createColumn(boardId, title.value).then(response => {
        activityIndicatorOff();
        const boardCopy = { ...board } as BoardCompleteProps;
        const newColumn = response.data as ColumnProps;
        newColumn.tasks = [];
        boardCopy.columns.push(newColumn);
        if (setBoard) {
          setBoard(boardCopy);
        }
        title.value = '';
        hideColumnForm();
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      hideColumnForm();
    }
  }
  const onBlurNewColumn = () => {
    hideColumnForm();
  }

  const enableBoardTitleEdit = (event: React.MouseEvent<HTMLHeadElement>) => {
    const h1 = event.currentTarget;
    const title = document.getElementById('board-title-input');
    h1.classList.add('hidden');
    title?.classList.remove('hidden');
    title?.focus();

  }

  const editBoardTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key || event.keyCode;
    const title: HTMLInputElement = event.currentTarget;
    const boardId = title.dataset.board;

    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      updateBoardTitle(boardId, title.value).then(response => {
        activityIndicatorOff();
        const boardCopy = { ...board } as BoardCompleteProps;
        boardCopy.title = title.value;
        if (setBoard) {
          setBoard(boardCopy);
        }
        hideBoardTitleEdit();
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      hideBoardTitleEdit();
    }
  }

  const onBlurBoardTitle = () => {
    hideBoardTitleEdit();
  }

  const hideBoardTitleEdit = () => {
    const h1 = document.getElementById('board-title');
    const titleInput = document.getElementById('board-title-input') as HTMLInputElement;

    if (h1) {
      h1.classList.remove('hidden');
      h1.innerHTML = `${h1.dataset.original}`;
    }

    if (titleInput) {
      titleInput.classList.add('hidden');
      titleInput.value = `${h1?.dataset.original}`;
    }

  }

  const enableBoardDescriptionEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    const desc = event.currentTarget;
    const descTextarea = document.getElementById('board-desc-textarea');
    desc.classList.add('hidden');
    descTextarea?.classList.remove('hidden');
    descTextarea?.focus();

  }

  const editBoardDescription = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = event.key || event.keyCode;
    const desc: HTMLTextAreaElement = event.currentTarget;
    const boardId = desc.dataset.board;

    // Submit on Enter key pressed
    if (key === 'Enter' || key === 13) {
      event.preventDefault();
      activityIndicatorOn();
      updateBoardDescription(boardId, desc.value).then(response => {
        activityIndicatorOff();
        const boardCopy = { ...board } as BoardCompleteProps;
        boardCopy.description = desc.value;
        if (setBoard) {
          setBoard(boardCopy);
        }
        hideBoardDescriptionEdit();
      })
    }

    // Cancel on Escape key pressed
    if (key === 'Escape' || key === 27) {
      hideBoardDescriptionEdit();
    }
  }

  const onBlurBoardDescription = () => {
    hideBoardDescriptionEdit();
  }

  const hideBoardDescriptionEdit = () => {
    const desc = document.getElementById('board-desc');
    const descTextarea = document.getElementById('board-desc-textarea') as HTMLTextAreaElement;

    if (desc) {
      desc.classList.remove('hidden');
      desc.innerHTML = `${desc.dataset.original}`;
    }

    if (descTextarea) {
      descTextarea.classList.add('hidden');
      descTextarea.value = `${desc?.dataset.original}`;
    }

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
    <div className="container mx-auto mt-4">
      <h1
        id="board-title"
        className="hover:cursor-pointer border-2 border-white outline-none w-1/2 pl-2 sm:p-0 font-medium text-3xl mb-2"
        data-original={board?.title}
        data-board={board?.id}
        onClick={enableBoardTitleEdit}
      >{board?.title}</h1>
      <input
        id="board-title-input"
        className="hidden focus:border-blue-500 border-2 border-white outline-none w-1/2 pl-2 sm:p-0 font-medium text-3xl mb-2"
        data-board={board?.id}
        defaultValue={board?.title}
        onKeyDown={editBoardTitle}
        onBlur={onBlurBoardTitle}
      />
      <div
        id="board-desc"
        data-original={board?.description}
        data-board={board?.id}
        onClick={enableBoardDescriptionEdit}
        className="hover:cursor-pointer border-2 border-white resize-none outline-none w-1/2 text-m text-gray-400"
      >
        {board?.description}
      </div>
      <textarea
        id="board-desc-textarea"
        className="hidden focus:border-blue-500 border-2 border-white resize-none outline-none w-1/2 text-m text-gray-400"
        defaultValue={board?.description}
        data-board={board?.id}
        data-original={board?.description}
        onKeyDown={editBoardDescription}
        onBlur={onBlurBoardDescription}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <div
              className={`grid gap-4  
                          ${columnsLength === 1 ? 'grid-cols-1' : ''}
                          ${columnsLength === 2 ? 'grid-cols-2' : ''}
                          ${columnsLength === 3 ? 'grid-cols-3' : ''}
                          ${columnsLength === 4 ? 'grid-cols-4' : ''}
                          ${columnsLength === 5 ? 'grid-cols-5' : ''}
                          ${columnsLength === 6 ? 'grid-cols-6' : ''}
                          ${columnsLength === 7 ? 'grid-cols-7' : ''}
                          ${columnsLength === 8 ? 'grid-cols-8' : ''}
                          ${columnsLength === 9 ? 'grid-cols-9' : ''}`
              }
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {board?.columns.map((column, index) => {
                return (
                  <Column key={`column-${column.id}`} {...column} index={index} board_id={board.id}></Column>
                );
              })}
              {provided.placeholder}
              <div id="newColumnPlaceholder" className="my-4 max-w-sm min-h-48 p-1">
                <button
                  id="addColumnButton"
                  data-board={board?.id}
                  onClick={showColumnForm}
                  className="px-2 hover:bg-slate-200 rounded-lg text-sm text-slate-800 font-medium text-left"
                >
                  <span className="text-gray-400 text-3xl">+</span>
                </button>
                <input id="newColumnInput"
                  className="rounded w-full p-1 text-sm resize-none hidden outline-none drop-shadow-sm border-blue-500 border-2"
                  data-board={board?.id}
                  onKeyDown={submitNewColumn}
                  onBlur={onBlurNewColumn}
                  placeholder="Column name"
                />
              </div>
            </div>
          )}

        </Droppable>
        <div className="text-center my-8">
          <button className="text-xs text-blue-800 underline" onClick={() => navigate('/')}>Return to boards index</button><br />
          <button className="mt-8 text-xs text-red-600 underline" data-board={board?.id} onClick={removeBoard}>Delete this board</button>
        </div>
      </DragDropContext>
    </div>
  )
}

export default CompleteBoard;