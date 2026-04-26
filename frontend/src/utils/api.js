// class for handling the api so we could use jwt token

import { auth } from "./auth";

const BASE_URL = ""; // this we get from vite config

export const apiFetch = async (path, options = {}) => {
  const token = auth.getToken();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Auto-logout if token expired
  if (response.status === 401) {
    auth.removeToken();
    window.location.href = "/login";
  }

  return response;
};