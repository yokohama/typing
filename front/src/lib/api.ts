function getHeaders(): HeadersInit | undefined {
  const jwt = localStorage.getItem('jwt');

  if(!jwt) {
    console.error('JWT token not found in localStorage');
    return;
  }

  return {
    'Authorization': `Bearer ${jwt}`,
    'Content-Type': 'application/json',
  };
}

async function handleResponse(response: Response): Promise<any> {
  const data = await response.json();

  if (!response.ok) {
    console.error('API Error: ', data.message);
  }

  console.log(data);
  return data;
}

export async function fetchData(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
): Promise<any> {
  const response = await fetch(url, {
    method: method,
    headers: getHeaders(),
  });

  return handleResponse(response);
}

export async function postData<T>(
  url: string,
  data: T
): Promise<any> {
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
}
