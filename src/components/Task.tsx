import { Draggable } from "react-beautiful-dnd";
import { TaskProps } from "../interfaces";

const Task = (task: TaskProps) => {
  return (
    <Draggable draggableId={`${task.id}`} index={task.index}>
      {(provided, snapshot) => {
        return (
          <div
            className={`mb-2 rounded border bg-white p-2 pb-8 drop-shadow-sm ${
              snapshot.isDropAnimating
                ? "border-gray-300 border-2"
                : ""
            }`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            >
              {snapshot.isDropAnimating}
              {task.description}
          </div>
        )}
      }
    </Draggable>
  );
}

export default Task;