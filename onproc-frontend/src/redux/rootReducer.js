// ** Reducers Imports
import { combineReducers } from '@reduxjs/toolkit';
import auth from "./auth";
import message from "./message";
import job from "./job";
import map from "./map";
import information from "./information";

const rootReducer = combineReducers({
    auth,
    message,
    job,
    map,
    information
});

export default rootReducer;
