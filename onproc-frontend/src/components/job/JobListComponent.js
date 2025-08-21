import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllJobsByUser } from '../../actions/jobsActions';
import { getUserData } from "../../utility/Utils";
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material'; // Import Material-UI components
import { Link } from 'react-router-dom'; // Import Link for navigation
import { setSelectedJob } from '../../actions/jobsActions';

const JobListComponent = () => { // Accept onJobSelect as a prop
    const dispatch = useDispatch();
    const user = getUserData();
    const jobList = useSelector((state) => state.job.joblist);
    const loading = useSelector((state) => state.job.loading);
    const errorMessage = useSelector((state) => state.job.errmessage);

    // Debug logging
    console.log('JobListComponent render - jobList:', jobList);
    console.log('JobListComponent render - jobList type:', typeof jobList);
    console.log('JobListComponent render - jobList isArray:', Array.isArray(jobList));

    useEffect(() => {
        dispatch(getAllJobsByUser(user.username));
    }, [dispatch]);

    const handleJobSelect = (jobId) => {
        dispatch(setSelectedJob(jobId)); // Dispatch the action
    };

    // Safety check to ensure jobList is an array
    const safeJobList = Array.isArray(jobList) ? jobList : [];

    return (
        <div>
            <h3>Job List</h3>
            {loading ? (
                <p>Loading jobs...</p>
            ) : errorMessage ? (
                <p>Error: {errorMessage}</p>
            ) : safeJobList.length > 0 ? (
                <List>
                    {safeJobList.map(job => (
                        <ListItem key={job.id} button onClick={() => handleJobSelect(job.id)}> {/* Call onJobSelect on click */}
                            <ListItemText
                                primary={job.job_name}
                                secondary={
                                    <React.Fragment>
                                         Date : {new Date(job.created_at).toLocaleString()}
                                        <br/>
                                        {job.status && (
                                            <Chip label={job.status.toUpperCase()} color={job.status === 'finished' ? 'success' : 'primary'} />
                                        )}
                                       
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <p>No jobs available</p>
            )}
        </div>
    );
};

export default JobListComponent;
