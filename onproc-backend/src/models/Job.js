// backend/models/User.js
const db = require('../config/knex');
const { v4: uuidv4 } = require('uuid');



async function findJobId(id) {
  const job = await db('jobs').where({ id }).first();
  return job;
}

async function createJob({ jobId, username,jobname, command, cpuRequired, priority }) {
  try {
   // const jobId = uuidv4(); // Generate job ID


    const [job] = await db('jobs').insert({
      id: jobId,
      username: username,
      job_name: jobname,
      command : command, // The HTTP GET command to execute the Flask API
      status: 'queued', // Default status
      cpu_required: cpuRequired,
      priority,
    }).returning(['id', 'username', 'job_name', 'status', 'cpu_required', 'priority']);
    
    return job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

async function getJobById(id) {
  const job = await db('jobs')
    .leftJoin('results', 'jobs.id', 'results.jobid') // Change to left join
    .where({ 'jobs.id': id }) // Specify the job ID
    .select('jobs.*', 'results.*') // Select fields from both tables
    .first();
  
  if (!job) {
    return { message: 'Job not found' }; // Return message if job does not exist
  }
  return job;
}

async function getAllJobsByUser(username) {
  const jobs = await db('jobs')
    .where({ username: username })
    .orderBy('created_at', 'desc'); // Sort by created_at from newest to oldest
  return jobs;
}

module.exports = {
  findJobId,
  createJob,
  getJobById, 
  getAllJobsByUser,
};
