import React, { useState, useEffect } from 'react';
import {
  Typography,
  CircularProgress,
  List,
  Box,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import './CollectionsComponent.scss'; // Import the SCSS file
import ProcessingComponent from './../processingbox/ProcessingComponent'; // Import the ProcessingComponent

const CollectionsComponent = ({ onHoverItem, onItemSelect, onCollectionSelect, aoiCoords, collection, params, onFootprintsUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState('https://via.placeholder.com/150'); // Default thumbnail
  const [selectedItemId, setSelectedItemId] = useState(null); // Track selected item

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_STAC_URL}/search?bbox=${aoiCoords}&${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(data.features || []);
        
      } catch (error) {
        console.error(error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [aoiCoords, params]);

  const handleItemMouseEnter = (bbox) => {
    onHoverItem(bbox);
  };

  const handleItemMouseLeave = () => {
    onHoverItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItemId(item.id); // Update selected item
    onItemSelect(item.id);
  };

  const handleDrop = (itemId) => {
    console.log('Dropped item ID:', itemId); // Handle the dropped item ID
    // Add your logic to process the dropped item here
  };

  return (
    <div>
      <Button onClick={onCollectionSelect} variant="outlined">
        Back to Search
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {Array.isArray(items) && items.map(item => {
            const thumbnailURLForSelection = item.links?.find(
              ({ rel }) => rel === 'thumbnail'
            )?.href || 'https://via.placeholder.com/150';

            const bbox = item.bbox;
            const isSelected = selectedItemId === item.id; // Check if item is selected

            return (
              <Box
                key={item.id}
                display="flex"
                alignItems="center"
                padding={1}
                position="relative"
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  marginBottom: 1,
                  overflow: 'hidden',
                  backgroundColor: isSelected ? 'rgba(0, 0, 255, 0.1)' : 'transparent', // Change color if selected
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                  }
                }}
                onMouseEnter={() => handleItemMouseEnter(bbox)}
                onMouseLeave={handleItemMouseLeave}
                onClick={() => handleItemClick(item)}
                draggable // Make the item draggable
                /* onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.links?.find(
                    ({ rel }) => rel === 'self'
                  )?.href); // Set the data to be copied
                }} */
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', item.id); // Set the data to be copied
                }}
                onDragEnd={(e) => {
                  e.preventDefault(); // Prevent default behavior on drag end
                }}
              >
                <Box
                  component="img"
                  src={thumbnailURLForSelection}
                  alt={item.id}
                  sx={{
                    width: 100,
                    height: 100,
                    marginRight: 1,
                  }}
                />
                <Box display="flex" flexDirection="column" justifyContent="center">
                  <Typography className='resultTitle' sx={{ fontSize: '14px' }}>{item.id}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DateRangeIcon sx={{ marginRight: 1, fontSize: '12px' }} />
                    <Typography className='resultBody' sx={{ fontSize: '12px' }}>
                      <strong>Date:</strong> {item.properties.datetime}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <CloudQueueIcon sx={{ marginRight: 1, fontSize: '12px' }} />
                    <Typography className='resultBody' sx={{ fontSize: '12px' }}><strong>Cloud Cover:</strong> {item.properties['eo:cloud_cover']}%</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center'}}>
                    <Typography className='resultBody' sx={{ fontSize: '12px' }}><strong>Platform:</strong> {item.properties['platform'].toUpperCase()}</Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </List>
      )}
     
    </div>
  );
};

export default CollectionsComponent;