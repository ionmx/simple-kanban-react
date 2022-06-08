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

export async function createTask(board: string | undefined, column: string | undefined, description: string | undefined, position: string | undefined) {
  try {
    const url = `/api/v1/boards/${board}/columns/${column}/tasks`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({description: description, position: position})
    });
    return await response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
}
