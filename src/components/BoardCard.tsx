import { BoardProps } from '../interfaces'
import { useNavigate } from "react-router-dom"

const BoardCard = (board: BoardProps) => {
  const navigate = useNavigate()
  return (
    <div className="my-1 max-w-sm h-48 rounded border bg-white overflow-hidden shadow-lg hover:cursor-pointer" onClick={() => navigate(`/board/${board.id}`)} >
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{board.title}</div>
        <p className="text-gray-700 text-base">{board.description}</p>
      </div>
    </div>
  )
}

export default BoardCard