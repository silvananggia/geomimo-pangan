import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById, setSelectedJob } from '../../actions/jobsActions';
import { addWmsLayer } from '../../actions/mapActions'; // Import the action
import { Typography, Box, Button, Chip } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress color="success" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};

const JobDetailsComponent = ({ jobId }) => {
    const dispatch = useDispatch();
    const jobDetails = useSelector((state) => state.job.jobobj);

    useEffect(() => {
        dispatch(getJobById(jobId));
    }, [dispatch, jobId]);

    const handleBack = () => {
        dispatch(setSelectedJob(null)); // Clear the selected job ID
    };

    const handleAddWmsLayer = () => {
        if (jobDetails && jobDetails.layer) {
            dispatch(addWmsLayer(jobDetails.layer)); // Dispatch the action to add WMS layer
        }
    };

    const handleDownloadGeoTIFF = () => {
        if (jobDetails && jobDetails.layer) {
            const downloadUrl = process.env.REACT_APP_GEOSERVER_URL + `/test/wcs?service=WCS&version=2.0.1&request=GetCoverage&CoverageId=test:${jobDetails.layer}&format=image/tiff`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${jobDetails.job_name}.tiff`); // Set the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!jobDetails) {
        return <div>Loading job details...</div>;
    }

    return (
        <div>
            <Button onClick={handleBack} variant="outlined">Back to Job List</Button> {/* Back button */}
            <h3>Job Details</h3>
            <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2}>
                <Typography variant="body2" fontWeight="bold">Job Name:</Typography>
                <Typography variant="body2">{jobDetails.job_name}</Typography>
                <Typography variant="body2" fontWeight="bold">Date:</Typography>
                <Typography variant="body2">{new Date(jobDetails.created_at).toLocaleString()}</Typography>
                <Typography variant="body2" fontWeight="bold">Job ID:</Typography>
                <Typography variant="body2">{jobDetails.id}</Typography>


                {(() => {
                    if (jobDetails && jobDetails.command) {
                        const urlParams = new URLSearchParams(jobDetails.command.split('?')[1]);
                        const data = urlParams.get('data');
                        const sign = urlParams.get('sign');
                        const threshold = urlParams.get('threshold');

                        return (
                            <>
                                <Typography variant="body2" fontWeight="bold">Data:</Typography>
                                <Typography variant="body2">{data}</Typography>
                                <Typography variant="body2" fontWeight="bold">Threshold:</Typography>
                                <Typography variant="body2">{sign} {threshold}</Typography>
                            </>
                        );
                    }
                })()}

                <Typography variant="body2" fontWeight="bold" >Status:</Typography>
                {jobDetails.status && (
                <Chip label={jobDetails.status.toUpperCase()} color={jobDetails.status === 'finished' ? 'success' : 'primary'} /> 
                )}
                {jobDetails.status !== 'finished' && ( // Check if status is not finished
                    <>
                        <Typography variant="body2" fontWeight="bold">Progress:</Typography>
                        <LinearProgressWithLabel value={jobDetails.progress} />
                    </>
                )}
                
            </Box>
            <Box sx={{ mt: 2 }} /> 
            {jobDetails.layer && (
                    <>
                        
                        <Box display="flex" flexDirection="column" gap={1}> {/* Added Box for layout */}
                            <Button onClick={handleAddWmsLayer} variant="outlined" fullWidth>Show on Map</Button> {/* Set fullWidth for equal width */}
                            <Button onClick={handleDownloadGeoTIFF} variant="outlined" fullWidth>Download GeoTIFF</Button> {/* Set fullWidth for equal width */}
                        </Box>
                    </>
                )}
        </div>

    );
};

export default JobDetailsComponent;
