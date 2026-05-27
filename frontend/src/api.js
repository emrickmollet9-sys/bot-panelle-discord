export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('botPanelToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
