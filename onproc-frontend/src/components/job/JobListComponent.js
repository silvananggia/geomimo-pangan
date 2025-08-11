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

    useEffect(() => {
        dispatch(getAllJobsByUser(user.username));
    }, [dispatch]);

    const handleJobSelect = (jobId) => {
        dispatch(setSelectedJob(jobId)); // Dispatch the action
    };

    return (
        <div>
            <h3>Job List</h3>
            {jobList.length > 0 ? (
                <List>
                    {jobList.map(job => (
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
