import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, CHECK_AUTH, REGISTER_SUCCESS, REGISTER_FAILURE } from "./types";

import AuthService from "../services/authService";

export const login = (username, password) => async (dispatch) => {
  try {
    const res = await AuthService.login(username, password);
    localStorage.setItem("user", JSON.stringify(res.data));

    //console.log(localStorage.getItem("user"))
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response.data.error,
    });
  }
};

export const checkAuth = (id) => async (dispatch) => {
  try {
    const res = await AuthService.checkAuth(id);
    dispatch({
      type: CHECK_AUTH,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: LOGIN_FAILURE, payload: error.message });
    localStorage.removeItem("user");
    
  }
};

export const logout = () => async (dispatch) => {
  try {
    const res = await AuthService.logout();
    dispatch({
      type: LOGOUT,
      payload: res.data,
    });

    localStorage.removeItem("user");

    // Return a successful response
    return { success: true };
  } catch (error) {
    // Dispatch the LOGIN_FAILURE action with the error message
    dispatch({ type: LOGIN_FAILURE, payload: error.message });

    // Return an unsuccessful response
    return { success: false, error: error.message };
  }
};

export const register = (username, email, password) => async (dispatch) => { // New register function
  try {
    const res = await AuthService.register(username, email, password); // Call the register service
  
    dispatch({
      type: REGISTER_SUCCESS, // Dispatch success action
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAILURE, // Dispatch failure action
      payload: error.response.data.error,
    });
  }
};
