import React from 'react';
import {
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material';
import Info from '@mui/icons-material/Info';

const ProcessingTaskComponent = ({
    dataDropItem,
    setdataDropItem,
    sign,
    setSign,
    threshold,
    setThreshold,
    onSubmit
}) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const itemId = e.dataTransfer.getData('text/plain');
        setdataDropItem(itemId);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <Box>
        <Box sx={{ padding: 2,  border: '1px solid #ccc', marginTop: '5px' }}>
            <div className='title-font'>Burn Area Detection Module</div>
            <Box sx={{ border: '1px solid #ccc', backgroundColor: '#d3d3d3', padding: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Info sx={{ marginRight: 1, alignSelf: 'flex-start' }} />
                    <span>Burn area detection using satellite data analyzes images with the Normalized Burn Ratio (NBR), calculated from NIR and SWIR bands. A threshold is applied to classify burned areas, enabling rapid fire impact assessment using Sentinel-2 or Landsat imagery.</span>
                </Typography>
            </Box>

        <div className='title-font' style={{
                        marginTop: '20px',
                    }}>Data :</div>
            <Box sx={{ padding: 1 }}>
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        textAlign: 'center',
                        marginTop: '5px',
                    }}
                >
                    {dataDropItem ? (
                        <TextField value={dataDropItem} variant="outlined" fullWidth />
                    ) : (
                        'Drop data here'
                    )}
                </div>
            </Box>

            <div className='title-font'>Sign :</div>
            <Box sx={{ padding: 1 }}>
                <FormControl fullWidth>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sign === '<'}
                                    onChange={() => setSign('<')}
                                />
                            }
                            label="<"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={sign === '>'}
                                    onChange={() => setSign('>')}
                                />
                            }
                            label=">"
                        />
                    </FormGroup>
                </FormControl>
            </Box>

            <Box sx={{ padding: 1 }}>
                <TextField
                    label="Threshold"
                    variant="outlined"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    fullWidth
                />
            </Box>

            <Box sx={{ padding: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onSubmit}
                    fullWidth
                >
                    Submit
                </Button>
            </Box>
        </Box>
        </Box>
    );
};

export default ProcessingTaskComponent;
