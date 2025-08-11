import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Tabs, Tab, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ItemDetailsComponent = ({ collectionId, selectedItem, onBack }) => {
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState('https://via.placeholder.com/150'); // Default thumbnail

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_STAC_URL}/collections/${collectionId}/items/${selectedItem}`);
        if (!response.ok) {
          throw new Error('Failed to fetch item details');
        }
        const data = await response.json();
        setItemDetails(data);

        const thumbnailURLForSelection = data.links?.find(
          ({ rel }) => rel === 'thumbnail'
        )?.href
        const image = new Image();
        image.onload = function () {
          if (this.width > 0) {
            setThumbnailUrl(thumbnailURLForSelection);
          }
        };
        image.onerror = function () {
          setThumbnailUrl('https://via.placeholder.com/150'); // Default image on error
        };
        image.src = thumbnailURLForSelection;

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [collectionId, selectedItem]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <Button variant="contained" onClick={onBack}>
        <ArrowBackIcon />
      </Button>
      <Typography variant="h4" gutterBottom>
        Item Details
      </Typography>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 20 }}>
          {thumbnailUrl ? (
            <picture>
              <img
                src={thumbnailUrl}
                alt="thumbnail"
                className="popupResultThumbnail"
                style={{ height: 140 }}
              />
            </picture>
          ) : null}
        </div>
      </div>
      <Typography gutterBottom variant="h5" component="div" align="center">
        {itemDetails.id}
      </Typography>
      <Typography variant="body2" align="center">
        {itemDetails.collection}
      </Typography>
      <Tabs value={tabIndex} onChange={handleChange} aria-label="item details tabs">
        <Tab label="Scene Information" />
        <Tab label="Process Data" />
      </Tabs>
      {tabIndex === 0 && (
        <div>
          <Typography variant="body2">
            Date: {itemDetails.properties.datetime}
          </Typography>
          <Typography variant="body2">Cloud Cover: {itemDetails.properties['eo:cloud_cover']}%</Typography>
          <Box>
            <Typography variant="body2">
              Data : <pre>{JSON.stringify(itemDetails.properties, null, 2)}</pre>
            </Typography>
          </Box>
        </div>
      )}
      {tabIndex === 1 && (
        <div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'left', gap: 10 }}>
            <Button variant="contained" style={{ marginRight: 10 }}>NDVI</Button>
            <Button variant="contained">Burned Area</Button>
          </div>
        </div>
      )}
    </Box>
  );
};

export default ItemDetailsComponent;