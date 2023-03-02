
import axios from 'axios';

export async function fetchData(url: string): Promise<any> {
  return await (await fetch(url)).json()
}
