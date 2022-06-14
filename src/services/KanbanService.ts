export async function getAllBoards() {
  try {
    const response = await fetch('/api/v1/boards');
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function getBoard(id: string | undefined) {
  try {
    const response = await fetch(`/api/v1/boards/${id}`);
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function createBoard(title: string | undefined, description: string | undefined) {
  try {
    const response = await fetch('/api/v1/boards/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: title, description: description})
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createColumn(board: string | undefined, title: string | undefined) {
  try {
    const url = `/api/v1/boards/${board}/columns/`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({title: title})
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createTask(board: string | undefined, column: string | undefined, description: string | undefined) {
  try {
    const url = `/api/v1/boards/${board}/columns/${column}/tasks`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({description: description})
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateTask(board: string | undefined, column: string | undefined, task: string | undefined, description: string | undefined) {
  try {
    const url = `/api/v1/boards/${board}/columns/${column}/tasks/${task}`;
    const response = await fetch(url, {
      method: 'PATCH',
      body: JSON.stringify({description: description}),
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function moveTask(board: number, task: number, destinationColumn: number, destinationPosition: number) {
  try { 
    const url = `/api/v1/boards/${board}/move-task`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({task: task, destination: destinationColumn, position: destinationPosition})
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function moveColumn(board: number, column: number, destinationPosition: number) {
  try { 
    const url = `/api/v1/boards/${board}/move-column`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({column: column, position: destinationPosition})
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}
