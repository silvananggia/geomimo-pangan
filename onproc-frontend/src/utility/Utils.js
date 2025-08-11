export const isUserLoggedIn = () => localStorage.getItem("user");
export const getUserData = () => JSON.parse(localStorage.getItem("user"));