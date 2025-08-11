const express = require('express');
const router = express.Router();
const { createJob, getJobById, getAllJobsByUser } = require('../models/Job');
const { authorizeRole } = require('../middleware/role');

// Route to create a new job
router.post('/jobs',authorizeRole(['public', 'admin']),  async (req, res) => {
  try {
    const jobData = req.body; // Expecting JSON body
    const job = await createJob(jobData);
    res.status(201).json(job); // Respond with the created job
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Route to get a job by ID
router.get('/jobs/:id',authorizeRole(['public', 'admin']), async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (job) {
      res.status(200).json(job); // Respond with the job found
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve job' });
  }
});

// Route to get all jobs by user
router.get('/jobs/user/:username',authorizeRole(['public', 'admin']), async (req, res) => {
  try {
    const jobs = await getAllJobsByUser(req.params.username);
    res.status(200).json(jobs); // Respond with the list of jobs
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve jobs' });
  }
});

module.exports = router;