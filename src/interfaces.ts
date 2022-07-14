export interface BoardProps {
  id: number
  title: string
  description: string
}

export interface TaskProps {
  id: number
  description: string
  position: number
  board_id: number
  column_id: number
  index: number
  column_index: number
}

export interface ColumnProps {
  id: number
  title: string
  position: number
  board_id: number
  index: number
  tasks: TaskProps[]
}

export interface BoardCompleteProps {
  id: number
  title: string
  description: string
  columns: ColumnProps[]
}
