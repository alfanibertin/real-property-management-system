import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Add, Search, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropertyService from '../services/propertyService';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchTerm, statusFilter, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PropertyService.getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(property => 
        property.name.toLowerCase().includes(search) || 
        property.address?.street?.toLowerCase().includes(search) ||
        property.address?.city?.toLowerCase().includes(search) ||
        property.address?.state?.toLowerCase().includes(search) ||
        property.address?.zipCode?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }
    
    setFilteredProperties(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAddProperty = () => {
    navigate('/properties/new');
  };

  const handleViewProperty = (id) => {
    navigate(`/properties/${id}`);
  };

  const handleEditProperty = (id) => {
    navigate(`/properties/${id}/edit`);
  };

  const handleDeleteClick = (property) => {
    setPropertyToDelete(property);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    
    try {
      await PropertyService.deleteProperty(propertyToDelete._id);
      setProperties(properties.filter(p => p._id !== propertyToDelete._id));
      setSnackbar({
        open: true,
        message: 'Property deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete property',
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setPropertyToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPropertyToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h1">Properties</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddProperty}
        >
          Add Property
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Properties"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="occupied">Occupied</MenuItem>
                <MenuItem value="vacant">Vacant</MenuItem>
                <MenuItem value="maintenance">Under Maintenance</MenuItem>
                <MenuItem value="listed">Listed for Rent</MenuItem>
                <MenuItem value="for-sale">For Sale</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Property List */}
      {filteredProperties.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No properties found</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            {properties.length > 0 
              ? 'Try adjusting your search or filters' 
              : 'Click "Add Property" to create your first property'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div" gutterBottom>
                    {property.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Type:</strong> {property.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {property.status}
                    </Typography>
                    {property.financials?.currentValue && (
                      <Typography variant="body2">
                        <strong>Value:</strong> ${property.financials.currentValue.toFixed(2)}
                      </Typography>
                    )}
                    {property.financials?.monthlyRent && (
                      <Typography variant="body2">
                        <strong>Monthly Rent:</strong> ${property.financials.monthlyRent.toFixed(2)}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                  <Button size="small" onClick={() => handleViewProperty(property._id)}>
                    View Details
                  </Button>
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditProperty(property._id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(property)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the property "{propertyToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Properties;
