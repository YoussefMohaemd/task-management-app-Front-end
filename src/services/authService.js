import apiClient, { TOKEN_STORAGE_KEY, setUnauthorizedHandler } from './apiClient';

export const getToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

const saveToken = (token) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const unwrapAuthData = (response) => {
  const { user, token } = response.data.data;
  saveToken(token);
  return user;
};

export const registerUser = async (payload) => {
  const response = await apiClient.post('/auth/register', payload);
  return unwrapAuthData(response);
};

export const loginUser = async (payload) => {
  const response = await apiClient.post('/auth/login', payload);
  return unwrapAuthData(response);
};

export const fetchProfile = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data.data.user;
};

export const logoutUser = () => {
  clearSession();
};

export { setUnauthorizedHandler };
