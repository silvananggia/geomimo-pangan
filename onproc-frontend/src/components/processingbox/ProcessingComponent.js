import React, { useState } from 'react';
import './Processing.scss';
import {
    Typography,
    Grid,
    Box,
    Button,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from "react-redux";
import { createJob } from '../../actions/jobsActions';
import { getUserData } from "../../utility/Utils";
import ProcessingTaskComponent from './ProcessingTaskComponent';
import { getJobById, setSelectedJob } from '../../actions/jobsActions'; // Import the action
import JobDetailComponent from '../job/JobDetailsComponent'; // Import your JobDetailComponent

const ProcessingComponent = () => {
    const dispatch = useDispatch();
    const user = getUserData();
    
    const [isVisible, setIsVisible] = useState(true);
    const [dataDropItem, setdataDropItem] = useState(null);
    const [sign, setSign] = useState('<');
    const [threshold, setThreshold] = useState('0.05');
    const [jobId, setJobId] = useState(null);

    const togglePanel = () => {
        setIsVisible(!isVisible);
    };

    const handleJobSelect = (jobId) => {
        dispatch(getJobById(jobId));
        dispatch(setSelectedJob(jobId)); // Dispatch the action
    };

    const handleSubmit = async () => {
        const newJobId = uuidv4();
        const jobname = `IP Padi`;
        const cpurequired = '1';
        const priority = '1';
        //const command = `${process.env.REACT_APP_PROCESSING_URL}/burnedarea?data=${dataDropItem}&sign=${sign}&threshold=${threshold}&idproses=${newJobId}`;
        const command = `http://localhost:5000/run_ip_padi?implementation=modul_ip_padi&aoi_xmin=107.44&aoi_xmax=107.96&aoi_ymin=-6.74&aoi_ymax=-6.11&output=Subang&id_proses=${newJobId}`;
        console.log(user);
        console.log(user.username);
        try {
            await dispatch(createJob(newJobId, user.username, jobname, command, cpurequired, priority));
            setJobId(newJobId); // Set jobId state
         
            await  dispatch(setSelectedJob(newJobId)); // Dispatch the action
            await dispatch(getJobById(newJobId));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="button-container">
            <div className={`processing-panel ${isVisible ? '' : 'hidden'}`}>
                <div className='panel-header'>
                    <Typography variant="body1" style={{ flexGrow: 1 }}>Processing Burned Area</Typography>
                    <div className='circle-background' style={{ marginLeft: 'auto' }}>
                        <CloseIcon
                            onClick={togglePanel}
                            style={{ color: 'white', fontSize: '20px' }}
                        />
                    </div>
                </div>

                <div className='panel-content'>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ProcessingTaskComponent
                                dataDropItem={dataDropItem}
                                setdataDropItem={setdataDropItem}
                                sign={sign}
                                setSign={setSign}
                                threshold={threshold}
                                setThreshold={setThreshold}
                                onSubmit={handleSubmit}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
          
        </div>
    );
};

export default ProcessingComponent;
