import CompleteBoard from '../components/CompleteBoard'
import { BoardProvider } from '../context/BoardContext'

const Board = () => {
  return (
    <BoardProvider>
      <CompleteBoard/>
    </BoardProvider>
  )
}

export default Board
