import axios from "../api/axios";
import authHeader from "./auth-header";



const createJob = (jobId, username, jobname, command, cpuRequired, priority ) => {
    return axios.post("/jobs" , {
        jobId,
        username,
        jobname,
        command,
        cpuRequired,
        priority

    }, { headers: authHeader() });
};

const getJobById = (id) => {
    return axios.get(`/jobs/${id}`, { headers: authHeader() });
};

const getAllJobsByUser = (username) => {
    return axios.get(`/jobs/user/${username}`, { headers: authHeader() });
};

const jobService = {
  createJob,
  getJobById, // Added function
  getAllJobsByUser, // Added function
};

export default jobService;