export interface BoardProps {
  id: number;
  title: string;
  description: string;
}

export interface ColumnProps {
  id: number;
  title: string;
  position: number;
  tasks: TaskProps[];
}

export interface TaskProps {
  id: number;
  description: string;
  position: number;
}

export interface BoardCompleteProps {
  id: number;
  title: string;
  description: string;
  columns: ColumnProps[];
}