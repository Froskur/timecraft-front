import axios from 'axios';
import { app } from '@/config';

export const client = axios.create({
  baseURL: app.apiBaseUrl,
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
});

export function setClientAccessToken(token: string) {
  localStorage.setItem(app.accessTokenStoreKey, token);
  client.defaults.headers.common.authorization = `Bearer ${token}`;
}

export function removeClientAccessToken() {
  localStorage.removeItem(app.accessTokenStoreKey);
  delete client.defaults.headers.common.authorization;
}

export function setClientAccountId(accountId: string) {
  localStorage.setItem(app.accountIdStoreKey, accountId);
  client.defaults.headers.common['X-Account-Id'] = accountId;
}

export function removeClientAccountId() {
  localStorage.removeItem(app.accountIdStoreKey);
  delete client.defaults.headers.common['X-Account-Id'];
}

export function loadAccessToken() {
  const token = localStorage.getItem(app.accessTokenStoreKey);
  if (token) {
    setClientAccessToken(token);
  }
  const accountId = localStorage.getItem(app.accountIdStoreKey);
  if (accountId) {
    setClientAccountId(accountId);
  }
}
