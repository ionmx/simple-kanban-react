const production = {
  url: 'https://my-simple-kanban.herokuapp.com'
}
const development = {
  url: 'http://localhost:4000'
}
const backend = process.env.NODE_ENV === 'development' ? development : production

export async function getAllBoards () {
  try {
    const response = await fetch(`${backend.url}/api/v1/boards`)
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function getBoard (id: string | undefined) {
  try {
    const response = await fetch(`${backend.url}/api/v1/boards/${id}`)
    return await response.json()
  } catch (error) {
    return []
  }
}

export async function createBoard (title: string | undefined, description: string | undefined) {
  try {
    const response = await fetch(`${backend.url}/api/v1/boards/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description })
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function updateBoardTitle (board: string | undefined, title: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}`
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function updateBoardDescription (board: string | undefined, description: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}`
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ description }),
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function deleteBoard (board: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function createColumn (board: string | undefined, title: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/columns/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function createTask (board: string | undefined, column: string | undefined, description: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/columns/${column}/tasks`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description })
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function updateTask (board: string | undefined, column: string | undefined, task: string | undefined, description: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/columns/${column}/tasks/${task}`
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ description }),
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function deleteTask (board: string | undefined, column: string | undefined, task: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/columns/${column}/tasks/${task}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function updateColumn (board: string | undefined, column: string | undefined, title: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/columns/${column}`
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({ title }),
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function deleteColumn (board: string | undefined, column: string | undefined) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/columns/${column}`
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function moveTask (board: number, task: number, destinationColumn: number, destinationPosition: number) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/move-task`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ task, destination: destinationColumn, position: destinationPosition })
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function moveColumn (board: number, column: number, destinationPosition: number) {
  try {
    const url = `${backend.url}/api/v1/boards/${board}/move-column`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ column, position: destinationPosition })
    })
    return await response.json()
  } catch (error) {
    console.log(error)
    return []
  }
}
