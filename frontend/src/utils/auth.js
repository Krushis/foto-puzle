// class for handling jwt authentication

export const auth = {
  saveToken: (token) => localStorage.setItem("jwt_token", token),
  getToken: () => localStorage.getItem("jwt_token"),
  removeToken: () => localStorage.removeItem("jwt_token"),

  getUser: () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        auth.removeToken();
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  },

  isLoggedIn: () => auth.getUser() !== null,
};