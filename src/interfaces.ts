export interface BoardProps {
  id: number;
  title: string;
  description: string;
}

export interface ColumnProps {
  id: number;
  title: string;
  position: number;
  board_id: number;
  tasks: TaskProps[];
}

export interface TaskProps {
  id: number;
  description: string;
  position: number;
  column_id: number;
  index: number;
}

export interface BoardCompleteProps {
  id: number;
  title: string;
  description: string;
  columns: ColumnProps[];
}