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

    const formatDuration = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

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

    const startTime = jobDetails.time_start ? new Date(jobDetails.time_start) : null;
    const finishTime = jobDetails.time_finish ? new Date(jobDetails.time_finish) : null;
    const processingTime = startTime && finishTime ? formatDuration(finishTime - startTime) : null;

    return (
        <div>
            <Button onClick={handleBack} variant="outlined">Back to Job List</Button> {/* Back button */}
            <h3>Job Details</h3>
            <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2}>
                <Typography variant="body2" fontWeight="bold">Job Name:</Typography>
                <Typography variant="body2">{jobDetails.job_name}</Typography>
                <Typography variant="body2" fontWeight="bold">Time Start:</Typography>
                <Typography variant="body2">{startTime ? startTime.toLocaleString() : '—'}</Typography>
                <Typography variant="body2" fontWeight="bold">Time Finish:</Typography>
                <Typography variant="body2">{finishTime ? finishTime.toLocaleString() : '—'}</Typography>
                <Typography variant="body2" fontWeight="bold">Processing Time:</Typography>
                <Typography variant="body2">{processingTime || '—'}</Typography>
                <Typography variant="body2" fontWeight="bold">Job ID:</Typography>
                <Typography variant="body2">{jobDetails.id}</Typography>


                {(() => {
                    if (jobDetails && jobDetails.command) {
                        const urlParams = new URLSearchParams(jobDetails.command.split('?')[1]);
                        
                        // Extract all parameters in use
                        const per1sikluspadi = urlParams.get('per1sikluspadi');
                        const perekstremmin = urlParams.get('perekstremmin');
                        const perekstremmax = urlParams.get('perekstremmax');
                        const btsbedaekstremmaxmin = urlParams.get('btsbedaekstremmaxmin');
                        const batasekstremmin = urlParams.get('batasekstremmin');
                        const jlmkelaspertumbuhanminimum = urlParams.get('jlmkelaspertumbuhanminimum');
                        const aoi_xmin = urlParams.get('aoi_xmin');
                        const aoi_xmax = urlParams.get('aoi_xmax');
                        const aoi_ymin = urlParams.get('aoi_ymin');
                        const aoi_ymax = urlParams.get('aoi_ymax');

                        return (
                            <>
                                
                                <Typography variant="body2" fontWeight="bold">Per 1 Siklus Padi:</Typography>
                                <Typography variant="body2">{per1sikluspadi}</Typography>
                                
                                <Typography variant="body2" fontWeight="bold">Per Ekstrem Min:</Typography>
                                <Typography variant="body2">{perekstremmin}</Typography>
                                
                                <Typography variant="body2" fontWeight="bold">Per Ekstrem Max:</Typography>
                                <Typography variant="body2">{perekstremmax}</Typography>
                                
                                <Typography variant="body2" fontWeight="bold">Batas Beda Ekstrem Max-Min:</Typography>
                                <Typography variant="body2">{btsbedaekstremmaxmin}</Typography>
                                
                                <Typography variant="body2" fontWeight="bold">Batas Ekstrem Min:</Typography>
                                <Typography variant="body2">{batasekstremmin}</Typography>
                                
                                <Typography variant="body2" fontWeight="bold">Jumlah Kelas Pertumbuhan Minimum:</Typography>
                                <Typography variant="body2">{jlmkelaspertumbuhanminimum}</Typography>
                                
                                <Typography variant="body2" fontWeight="bold">AOI Coordinates:</Typography>
                                <Typography variant="body2">X: {aoi_xmin} to {aoi_xmax}, Y: {aoi_ymin} to {aoi_ymax}</Typography>
                                
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
