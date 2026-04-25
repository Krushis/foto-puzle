// class for handling jwt authentication

const TOKEN_KEY = "jwt_token";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event("authChanged"));
};

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const auth = {
  saveToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    notifyAuthChanged();
  },

  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const payload = decodeToken(token);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      auth.removeToken();
      return null;
    }

    return token;
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    notifyAuthChanged();
  },

  getUser: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    const payload = decodeToken(token);
    if (!payload || payload.exp * 1000 <= Date.now()) {
      auth.removeToken();
      return null;
    }

    return payload;
  },

  isLoggedIn: () => auth.getUser() !== null,

  isAdmin: () => auth.getUser()?.role === "Admin",
};
