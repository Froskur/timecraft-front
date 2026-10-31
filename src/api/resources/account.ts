import { client } from '../axios';
import { Account, User } from '../entities';

export async function getCurrentUser() {
  const response = await client.get('/v1/auth/me');
  return User.parse(response.data);
}

export async function getAccountInfo() {
  const response = await client.get('/v1/account');
  return Account.parse(response.data);
}
