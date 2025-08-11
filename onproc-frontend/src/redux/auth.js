// reducers/authReducer.js
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, CHECK_AUTH, REGISTER_SUCCESS, REGISTER_FAILURE } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case CHECK_AUTH:
      return {
        ...state,
        user: action.payload,
        error: null,
        isAuthenticated: true,
      };
    case LOGOUT:
      return initialState;
    case REGISTER_SUCCESS: // New case for successful registration
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case REGISTER_FAILURE: // New case for failed registration
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
