import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  List,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

const CollectionsComponent = ({ onHoverItem, onItemSelect, onCollectionSelect, aoiCoords, params }) => {
  const [collections, setCollections] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState({});
  const [thumbnailUrl, setThumbnailUrl] = useState('https://via.placeholder.com/150'); // Default thumbnail


  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('https://earth-search.aws.element84.com/v1/collections');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCollections(data.collections);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  const handleAccordionChange = (collectionId, itemsUrl) => async (event, isExpanded) => {
    setExpanded(isExpanded ? collectionId : false);
    onCollectionSelect(isExpanded ? collectionId : null);

    if (isExpanded && !items[collectionId]) {
      setLoading(prev => ({ ...prev, [collectionId]: true }));
      try {
        const params = new URLSearchParams({
          collections: collectionId,
          'datetime': '2024-01-01T00:00:00Z/2024-01-30T23:59:59Z',
          'query': JSON.stringify({
            'eo:cloud_cover': {
              'lte': 80
            }
          })
        }).toString();

        const response = await fetch(`https://earth-search.aws.element84.com/v1/search?bbox=${aoiCoords}&${params}`);
        if (!response.ok) {
          throw new Error('Failed to fetch items');
        }
        const data = await response.json();
        setItems(prevItems => ({ ...prevItems, [collectionId]: data.features }));
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(prev => ({ ...prev, [collectionId]: false }));
      }
    }
  };

  const handleItemMouseEnter = (bbox) => {
    onHoverItem(bbox);
  };

  const handleItemMouseLeave = () => {
    onHoverItem(null);
  };

  const handleItemClick = (item) => {
    onItemSelect(item);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Collections
      </Typography>
      {collections.map(collection => {
        const itemsUrl = collection.links.find(link => link.rel === 'items')?.href;
        const isLoading = loading[collection.id];

        return (
          <Accordion
            key={collection.id}
            expanded={expanded === collection.id}
            onChange={handleAccordionChange(collection.id, itemsUrl)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${collection.id}-content`}
              id={`panel-${collection.id}-header`}
            >
              <Typography>{collection.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isLoading ? (
                <CircularProgress />
              ) : (
                items[collection.id] && (
                  <List>
                    {items[collection.id].map(item => {
                      const thumbnailURLForSelection = item.links?.find(
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
                      const bbox = item.bbox;

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
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              cursor: 'pointer',
                            }
                          }}
                          onMouseEnter={() => handleItemMouseEnter(bbox)}
                          onMouseLeave={handleItemMouseLeave}
                          onClick={() => handleItemClick(item.id)}
                        >
                          <Box
                            component="img"
                            src={thumbnailUrl || 'https://via.placeholder.com/150'}
                            alt={item.id}
                            sx={{
                              width: 100,
                              height: 100,
                              marginRight: 1,
                            }}
                          />
                          <Box display="flex" flexDirection="column" justifyContent="center">
                            <Typography variant="body1">{item.id}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DateRangeIcon sx={{ marginRight: 1 }} />
                              <Typography>Date: {item.properties.datetime}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                            <CloudQueueIcon sx={{ marginRight: 1 }} />
                              <Typography variant="body2">Cloud Cover: {item.properties['eo:cloud_cover']}%</Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </List>
                )
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default CollectionsComponent;
