import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
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
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Tabs,
  Tab
} from '@mui/material';
import { Add, Search, Edit, Delete, Build, Home, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MaintenanceService from '../services/maintenanceService';
import PropertyService from '../services/propertyService';

const Maintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, statusFilter, priorityFilter, propertyFilter, maintenanceRequests]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch maintenance requests and properties in parallel
      const [requestsData, propertiesData] = await Promise.all([
        MaintenanceService.getAllMaintenanceRequests(),
        PropertyService.getAllProperties()
      ]);
      
      setMaintenanceRequests(requestsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load maintenance data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...maintenanceRequests];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(request => 
        request.title?.toLowerCase().includes(search) || 
        request.description?.toLowerCase().includes(search) ||
        request.property?.name?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }
    
    // Apply property filter
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(request => request.property?._id === propertyFilter);
    }
    
    setFilteredRequests(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const handlePropertyFilterChange = (e) => {
    setPropertyFilter(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddRequest = () => {
    navigate('/maintenance/requests/new');
  };

  const handleViewRequest = (id) => {
    navigate(`/maintenance/requests/${id}`);
  };

  const handleEditRequest = (id) => {
    navigate(`/maintenance/requests/${id}/edit`);
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;
    
    try {
      await MaintenanceService.deleteMaintenanceRequest(requestToDelete._id);
      setMaintenanceRequests(maintenanceRequests.filter(r => r._id !== requestToDelete._id));
      setSnackbar({
        open: true,
        message: 'Maintenance request deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting maintenance request:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete maintenance request',
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setRequestToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRequestToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'error';
      case 'in-progress':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'emergency':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Calculate maintenance summary
  const calculateMaintenanceSummary = () => {
    const totalRequests = maintenanceRequests.length;
    
    const openRequests = maintenanceRequests.filter(r => r.status === 'open').length;
    const inProgressRequests = maintenanceRequests.filter(r => r.status === 'in-progress').length;
    const scheduledRequests = maintenanceRequests.filter(r => r.status === 'scheduled').length;
    const completedRequests = maintenanceRequests.filter(r => r.status === 'completed').length;
    
    const emergencyRequests = maintenanceRequests.filter(r => r.priority === 'emergency').length;
    const highPriorityRequests = maintenanceRequests.filter(r => r.priority === 'high').length;
    
    // Calculate by property
    const requestsByProperty = {};
    maintenanceRequests.forEach(request => {
      const propertyName = request.property?.name || 'Unassigned';
      requestsByProperty[propertyName] = (requestsByProperty[propertyName] || 0) + 1;
    });
    
    // Calculate by category
    const requestsByCategory = {};
    maintenanceRequests.forEach(request => {
      const category = request.category || 'Uncategorized';
      requestsByCategory[category] = (requestsByCategory[category] || 0) + 1;
    });
    
    return {
      totalRequests,
      openRequests,
      inProgressRequests,
      scheduledRequests,
      completedRequests,
      emergencyRequests,
      highPriorityRequests,
      requestsByProperty,
      requestsByCategory
    };
  };

  const summary = calculateMaintenanceSummary();

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
        <Typography variant="h1">Maintenance</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddRequest}
        >
          Add Maintenance Request
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Maintenance Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Requests
              </Typography>
              <Typography variant="h3">
                {summary.totalRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Open Requests
              </Typography>
              <Typography variant="h3" color="error.main">
                {summary.openRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                In Progress
              </Typography>
              <Typography variant="h3" color="warning.main">
                {summary.inProgressRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Emergency Requests
              </Typography>
              <Typography variant="h3" color="error.main">
                {summary.emergencyRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Maintenance Requests" />
          <Tab label="Scheduled Maintenance" />
          <Tab label="Vendors" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Search Requests"
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priorityFilter}
                    label="Priority"
                    onChange={handlePriorityFilterChange}
                  >
                    <MenuItem value="all">All Priorities</MenuItem>
                    <MenuItem value="emergency">Emergency</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Property</InputLabel>
                  <Select
                    value={propertyFilter}
                    label="Property"
                    onChange={handlePropertyFilterChange}
                  >
                    <MenuItem value="all">All Properties</MenuItem>
                    {properties.map(property => (
                      <MenuItem key={property._id} value={property._id}>
                        {property.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Maintenance Request List */}
          {filteredRequests.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">No maintenance requests found</Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                {maintenanceRequests.length > 0 
                  ? 'Try adjusting your search or filters' 
                  : 'Click "Add Maintenance Request" to create your first request'}
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredRequests.map((request) => (
                <Grid item xs={12} sm={6} md={4} key={request._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Build sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                          <Typography variant="h5" component="div" noWrap>
                            {request.title}
                          </Typography>
                        </Box>
                        <Chip 
                          label={request.status} 
                          color={getStatusColor(request.status)}
                          size="small"
                        />
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body2" gutterBottom>
                        <strong>Property:</strong> {request.property?.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Date Submitted:</strong> {new Date(request.dateSubmitted).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Category:</strong> {request.category || 'N/A'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          <strong>Priority:</strong>
                        </Typography>
                        <Chip 
                          label={request.priority} 
                          color={getPriorityColor(request.priority)}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mt: 2 }} noWrap>
                        {request.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
           
(Content truncated due to size limit. Use line ranges to read in chunks)