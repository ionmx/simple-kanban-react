import React, { useEffect, useState } from 'react'
import { BoardProps } from './interfaces'
import BoardCard from './components/BoardCard'
import AddBoardForm from './components/AddBoardForm'
import { getAllBoards } from './services/KanbanService'
import { activityIndicatorOff, activityIndicatorOn } from './components/ActivityIndicator'

function App () {
  const [boards, setBoards] = useState<null | BoardProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    activityIndicatorOn()
    getAllBoards().then(response => {
      setBoards(response.data)
      setLoading(false)
      activityIndicatorOff()
    })
  }, [])

  if (loading) {
    return <></>
  }

  return (
    <div className="container mx-auto mt-4">
      <h1 className="pl-2 sm:p-0 font-medium text-3xl mb-2">Boards</h1>
      <div className="grid p-2 sm:p-0 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards?.map((board) => {
          return (
            <BoardCard key={board.id} {...board}></BoardCard>
          )
        })
        }
        <AddBoardForm></AddBoardForm>
      </div>
    </div>
  )
}

export default App
