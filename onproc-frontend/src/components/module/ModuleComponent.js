import React, { useState } from 'react';
import './Module.scss';
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
import ba_logo from '../../assets/icons/burn.png';
import lagoon_logo from '../../assets/icons/lagoon.png';
import rice_logo from '../../assets/icons/rice.png';
import hotspot_logo from '../../assets/icons/hotspot.png';

const ModuleComponent = ({ onTabChange }) => {
    const dispatch = useDispatch();
    const user = getUserData();

    const [isVisible, setIsVisible] = useState(true);
    const [dataDropItem, setdataDropItem] = useState(null);
    const [sign, setSign] = useState('<');
    const [threshold, setThreshold] = useState('0.05');
    const [jobId, setJobId] = useState(null);

    const boxes = [
        { id: 1, label: 'Burned Area Detection', icon: ba_logo },
        { id: 2, label: 'Hotspot', icon: hotspot_logo, disabled: true },
        { id: 3, label: 'Rice-Plant Growth Phase', icon: rice_logo, disabled: true },
        { id: 4, label: 'Lagoon Detection', icon: lagoon_logo, disabled: true },

        // Add more boxes as needed
    ];

    return (
        <div className="button-container">
            <div className={`processing-panel ${isVisible ? '' : 'hidden'}`}>
                {/* ... existing code ... */}
            </div>

            {/* New grid section for boxes with icons */}
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {boxes.map(box => (
                    <Grid item xs={6} key={box.id} sx={{ padding: '10px' }}>
                        <Box 
                            textAlign="center" 
                            onClick={() => {
                                if (!box.disabled) onTabChange(null, box.id); // Prevent action if disabled
                            }} 
                            sx={{
                                border: '2px solid #1976d2',
                                borderRadius: '8px',
                                transition: 'background-color 0.3s, color 0.3s',
                                cursor: box.disabled ? 'not-allowed' : 'pointer', // Change cursor if disabled
                                padding: '20px 10px',
                                width: '150px',
                                height: '90px',
                                backgroundColor: box.disabled ? '#e0e0e0' : 'transparent', // Change background if disabled
                                '&:hover': {
                                    backgroundColor: box.disabled ? '#e0e0e0' : '#1976d2',
                                    color: box.disabled ? 'black' : '#fff',
                                    border: '2px solid #1976d2',
                                }
                            }}
                        >
                            <img 
                                src={box.icon} 
                                alt={`Icon ${box.id}`} 
                                style={{ width: '60px', height: '60px', transition: 'filter 0.3s', filter: 'brightness(1)' }} // Smooth transition for icon
                                onMouseOver={(e) => {
                                    e.currentTarget.style.filter = 'brightness(0)'; // Change icon color to white on hover
                                }} 
                                onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'} // Reset icon on mouse out
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{box.label}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* End of new grid section */}
        </div>
    );
};

export default ModuleComponent;
