import axios from 'axios';

export async function downloadInput(year: number, day: number, sessionCookie: string) {
  const response = await axios.get(`https://adventofcode.com/${year}/day/${day}/input`, {
    withCredentials: true,
    headers: {
      cookie: `session=${sessionCookie}`,
    },
  });

  return response.data;
}
