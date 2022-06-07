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