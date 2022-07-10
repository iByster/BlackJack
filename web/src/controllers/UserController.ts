import { BASE_URL, LOGOUT_ROUTE, ME_ROUTE } from '../consts';

export const me = async (id: number) => {
  const headers = {
    Accept: 'application/json',
  };
  const method = 'GET';
  const mode = 'cors';
  const endpoint = `${BASE_URL}/${ME_ROUTE}/${id}`;

  const requestInit: RequestInit = {
    headers,
    method,
    mode,
  };

  const request = new Request(endpoint, requestInit);

  try {
    const results = await (await fetch(request)).json();
    return { results };
  } catch (errors) {
    return { errors };
  }
};

export const logoutReq = async (id: number) => {
  const headers = {
    Accept: 'application/json',
  };
  const method = 'DELETE';
  const mode = 'cors';
  const endpoint = `${BASE_URL}/${LOGOUT_ROUTE}/${id}`;

  const requestInit: RequestInit = {
    headers,
    method,
    mode,
  };

  const request = new Request(endpoint, requestInit);

  try {
    const results = await (await fetch(request)).json();
    return { results };
  } catch (errors) {
    return { errors };
  }
};
