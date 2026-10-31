export const app = {
  name: 'TimeCraft',
  // Empty string = same-origin (scripts/serve.mjs proxies /v1 to the backend).
  // Set VITE_API_BASE_URL at build time to call the API host directly.
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL !== undefined
      ? import.meta.env.VITE_API_BASE_URL
      : 'https://back.timecraft.meditum.eu',
  fakeBackend: false,
  redirectQueryParamName: 'r',
  accessTokenStoreKey: 'timecraft_access_token',
  accountIdStoreKey: 'timecraft_account_id',
};
