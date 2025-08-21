import {
  CREATE_JOB, 
  GET_JOB, 
  GET_ALL_JOB, 
  GET_RESULT ,
  SET_SELECTED_JOB,
} from "../actions/types";

const initialstate = {
  loading: true,
  joblist: [],
  jobobj: {},
  selectedJobId: null, // Add selectedJobId to the state
  errmessage: "",
};

function jobReducer(job = initialstate, action) {
  const { type, payload } = action;

  switch (type) {

    case SET_SELECTED_JOB:
      return {
          ...job,
          selectedJobId: action.payload, // Update selectedJobId
      };

    case CREATE_JOB:
      return{
        ...job,
        loading: false,
        // Keep the existing joblist when creating a new job
        joblist: Array.isArray(job.joblist) ? job.joblist : []
    }

    case GET_ALL_JOB:
      console.log('Reducer GET_ALL_JOB - payload:', action.payload);
      console.log('Reducer GET_ALL_JOB - payload type:', typeof action.payload);
      console.log('Reducer GET_ALL_JOB - payload isArray:', Array.isArray(action.payload));
      
      return {
        loading: false,
        errmessage: "",
        joblist: Array.isArray(action.payload) ? action.payload : [],
        jobobj: {},
      };

    case GET_JOB:
      console.log("Updated jobobj:", action.payload); // Log the new jobobj
      return{
        ...job,
        loading:false,
        jobobj:action.payload
        
    }

    default:
      return job;
  }
}

export default jobReducer;
