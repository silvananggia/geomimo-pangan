import { 
  CREATE_JOB, 
  GET_JOB, 
  GET_ALL_JOB, 
  GET_RESULT ,
  SET_SELECTED_JOB,
} from "./types";

import JobService from "../services/jobService";

export const setSelectedJob = (jobId) => ({
  type: SET_SELECTED_JOB,
  payload: jobId,
});
// Action to get a job by ID
export const getJobById = (id) => async (dispatch) => {
  try {
    const res = await JobService.getJobById(id);
    dispatch({
      type: GET_JOB,
      payload: res.data,
    });
    console.log(res.data);
  } catch (error) {
    dispatch({
      type: GET_JOB,
      payload: error.response.data.error,
    });
  }
};

// Action to get all jobs by user
export const getAllJobsByUser = (username) => async (dispatch) => {
  try {
    const res = await JobService.getAllJobsByUser(username);
    dispatch({
      type: GET_ALL_JOB,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_JOB,
      payload: error.response.data.error,
    });
  }
};

export const createJob = (jobId, username, jobname, command, cpurequired, priority) => async (dispatch) => {
  try {
    const res = await JobService.createJob(jobId, username, jobname, command, cpurequired, priority);
    dispatch({
      type: CREATE_JOB,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_JOB,
      payload: error.response.data.error,
    });
  }
};


