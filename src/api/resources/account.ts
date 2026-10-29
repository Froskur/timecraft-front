import { client } from '../axios';
import { User } from '../entities';

export async function getAccountInfo() {
  const response = await client.get('v1/account');
  return User.parse(response.data);
}
