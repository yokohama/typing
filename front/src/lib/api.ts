type ApiResponse<T> = T & { message?: string };

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

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    console.error('API Error: ', data.message);
  }

  console.log(data);
  return data;
}

export async function fetchData<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: method,
    headers: getHeaders(),
  });

  return handleResponse<T>(response);
}

export async function postData<T, R>(
  url: string,
  data: T
): Promise<ApiResponse<R>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<R>(response);
}
