import { auth } from "./auth";

const BASE_URL = "";

export const apiFetch = async (path, options = {}) => {
  const token = auth.getToken();

  const isFormData = options.body instanceof FormData;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    auth.removeToken();
    window.location.href = "/login";
  }

  return response;
};