import 'server-only';

const getApiBaseUrl = (): string => {
  const baseURL = process.env.API_BASE_URL;
  if (!baseURL) {
    throw new Error('API_BASE_URL is not configured');
  }
  return baseURL;
};

export const apiFetch = (path: string, init?: RequestInit): Promise<Response> =>
  fetch(`${getApiBaseUrl()}${path}`, init);
