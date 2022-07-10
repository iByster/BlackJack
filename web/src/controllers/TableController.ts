import { BASE_URL, TABLE_ROUTE } from "../consts";

export const tableStatsReq = async (id: number) => {
    const headers = {
      Accept: 'application/json',
    };
    const method = 'GET';
    const mode = 'cors';
    const endpoint = `${BASE_URL}/${TABLE_ROUTE}/${id}`;
  
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