import { useNavigate } from 'react-router-dom'
import { createBoard } from '../services/KanbanService'

const AddBoardForm = () => {
  const navigate = useNavigate()
  const showAddBoardForm = () => {
    const f = document.getElementById('flip-add-form')
    const i = document.getElementById('new-board-title')
    f?.classList.add('show-form')
    i?.focus()
  }

  const hideAddBoardForm = () => {
    const f = document.getElementById('flip-add-form')
    f?.classList.remove('show-form')
  }

  const createNewBoard = () => {
    const title = document.getElementById('new-board-title') as HTMLInputElement | null
    const description = document.getElementById('new-board-description') as HTMLTextAreaElement | null
    createBoard(title?.value, description?.value).then(response => {
      navigate(`/board/${response.data.id}`)
    })
  }
  return (
    < div id="flip-add-form" className="flip-container" >
      <div className="flipper">
        <div className="front my-1 max-w-sm rounded border bg-white overflow-hidden shadow-lg hover:cursor-pointer" onClick={() => showAddBoardForm()} >
          <div className="px-6 py-4 text-center">
            <div className="font-bold text-8xl mb-2 text-green-400">+</div>
            <p className="text-gray-500 text-base">ADD BOARD</p>
          </div>
        </div>
        <div className="back my-1 max-w-sm rounded border bg-white overflow-hidden shadow-lg">
          <div className="bg-slate-600 text-white font-bold p-2">
            Add Board...
            <button className="float-right text-l text-white" onClick={() => hideAddBoardForm()}>&#x2715</button>
          </div>
          <div className="p-2">
            <input className="border w-full mb-2 p-2 text-xs font-bold" id="new-board-title" placeholder="Title..." />
            <textarea className="border w-full h-12 p-2 text-xs" id="new-board-description" placeholder="Description..."></textarea>
            <button className="bg-green-400 p-1 rounded w-full text-white" onClick={() => createNewBoard()}>Add Board</button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AddBoardForm
