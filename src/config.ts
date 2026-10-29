export const app = {
  name: 'TimeCraft',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://back.timecraft.meditum.eu',
  fakeBackend: false,
  redirectQueryParamName: 'r',
  accessTokenStoreKey: 'timecraft_access_token',
  accountIdStoreKey: 'timecraft_account_id',
};
