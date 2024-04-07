import axios from "axios";
export const setAuthToken = (token) => {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
};

export const getCookie = (name) => {
  const cookieString = document.cookie;
  console.log("cook str => ", cookieString);
  const cookies = cookieString.split(";");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};
