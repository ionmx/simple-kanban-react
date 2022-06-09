import { Draggable } from "react-beautiful-dnd";
import { TaskProps } from "../interfaces";

const Task = (task: TaskProps) => {
  return (
    <Draggable draggableId={`${task.id}`} index={task.index}>
      {(provided, snapshot) => {
        return (
          <div
            className="mb-2 rounded border bg-white p-2 pb-8 text-sm  drop-shadow-sm"
            ref={provided.innerRef}
            data-snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
              {task.description}
          </div>
        )}
      }
    </Draggable>
  );
}

export default Task;