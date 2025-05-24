import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Delete, Add } from '@mui/icons-material';
import PropertyService from '../services/propertyService';
import TenantService from '../services/tenantService';
import LeaseService from '../services/leaseService';
import FinancialService from '../services/financialService';
import MaintenanceService from '../services/maintenanceService';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPropertyData();
  }, [id]);

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch property details
      const propertyData = await PropertyService.getPropertyById(id);
      setProperty(propertyData);
      
      // Fetch property documents
      const documentsData = await PropertyService.getPropertyDocuments(id);
      setDocuments(documentsData);
      
      // Fetch related data
      const [tenantsData, leasesData, transactionsData, maintenanceData] = await Promise.all([
        TenantService.getAllTenants(), // We'll filter by property on the client side
        LeaseService.getAllLeases(),   // We'll filter by property on the client side
        FinancialService.getTransactionsByProperty(id),
        MaintenanceService.getMaintenanceRequestsByProperty(id)
      ]);
      
      // Filter tenants for this property
      setTenants(tenantsData.filter(tenant => tenant.property === id));
      
      // Filter leases for this property
      setLeases(leasesData.filter(lease => lease.property._id === id));
      
      setTransactions(transactionsData);
      setMaintenanceRequests(maintenanceData);
      
    } catch (error) {
      console.error('Error fetching property data:', error);
      setError('Failed to load property details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    navigate(`/properties/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await PropertyService.deleteProperty(id);
      setSnackbar({
        open: true,
        message: 'Property deleted successfully',
        severity: 'success'
      });
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
    } catch (error) {
      console.error('Error deleting property:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete property',
        severity: 'error'
      });
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/properties')}
        >
          Back to Properties
        </Button>
      </Box>
    );
  }

  if (!property) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Property not found</Alert>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/properties')}
        >
          Back to Properties
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h1" gutterBottom>{property.name}</Typography>
          <Typography variant="h5" color="text.secondary">
            {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<Edit />}
            sx={{ mr: 1 }}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<Delete />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </Box>
      
      {/* Property Summary Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.secondary">Property Type</Typography>
            <Typography variant="h6">{property.type}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.secondary">Status</Typography>
            <Typography variant="h6">{property.status}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.secondary">Current Value</Typography>
            <Typography variant="h6">
              ${property.financials?.currentValue?.toFixed(2) || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.secondary">Purchase Price</Typography>
            <Typography variant="h6">
              ${property.financials?.purchasePrice?.toFixed(2) || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.secondary">Monthly Rent</Typography>
            <Typography variant="h6">
              ${property.financials?.monthlyRent?.toFixed(2) || 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" color="text.secondary">Purchase Date</Typography>
            <Typography variant="h6">
              {property.financials?.purchaseDate 
                ? new Date(property.financials.purchaseDate).toLocaleDateString() 
                : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Financial" />
          <Tab label="Tenants" />
          <Tab label="Maintenance" />
          <Tab label="Documents" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {/* Overview Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom>Property Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Bedrooms</Typography>
                    <Typography variant="body1">{property.features?.bedrooms || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Bathrooms</Typography>
                    <Typography variant="body1">{property.features?.bathrooms || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Square Footage</Typography>
                    <Typography variant="body1">{property.features?.squareFootage || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Year Built</Typography>
                    <Typography variant="body1">{property.features?.yearBuilt || 'N/A'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Amenities</Typography>
                    <Typography variant="body1">
                      {property.features?.amenities?.join(', ') || 'None listed'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h5" gutterBottom>Current Occupancy</Typography>
                <Divider sx={{ mb: 2 }} />
                {tenants.length > 0 ? (
                  <List>
                    {tenants.map(tenant => (
                      <ListItem key={tenant._id} divider>
                        <ListItemText
                          primary={`${tenant.firstName} ${tenant.lastName}`}
                          secondary={`Email: ${tenant.email} | Phone: ${tenant.phone}`}
                        />
                        <Button 
                          size="small" 
                          onClick={() => navigate(`/tenants/${tenant._id}`)}
                        >
                          View
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1">No tenants currently assigned to this property</Typography>
                )}
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/tenants/new', { state: { propertyId: id } })}
                >
                  Add Tenant
                </Button>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>Recent Activity</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
                    {transactions.length > 0 ? (
                      <List>
                        {transactions.slice(0, 3).map(transaction => (
                          <ListItem key={transaction._id} divider>
                            <ListItemText
                              primary={transaction.description}
                              secondary={`${new Date(transaction.date).toLocaleDateString()} | $${transaction.amount.toFixed(2)} | ${transaction.type}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1">No recent transactions</Typography>
                    )}
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => setTabValue(1)}
                    >
                      View All Financial
                    </Button>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Recent Maintenance</Typography>
                    {maintenanceRequests.length > 0 ? (
                      <List>
                        {maintenanceRequests.slice(0, 3).map(request => (
                          <ListItem key={request._id} divider>
                            <ListItemText
                              primary={request.title}
                              secondary={`${new Date(request.dateSubmitted).toLocaleDateString()} | Status: ${request.status} | Priority: ${request.priority}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body1">No recent maintenance requests</Typography>
                    )}
                    <Button 
                      size="small" 
                      sx={{ mt: 1 }}
                      onClick={() => setTabValue(3)}
                    >
                      View All Maintenance
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Financial Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5">Financial Summary</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />}
                    onClick={() => navigate('/financial/transactions/new', { state: { propertyId: id } })}
                  >
                    Add Transaction
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">Purchase Price</Typography>
                        <Typography variant="h5">${property.financials?.purchasePrice?.toFixed(2) || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">Current Value</Typography>
                        <Typography variant="h5">${property.financials?.currentValue?.toFixed(2) || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="textSecondary">Monthly Rent</Typography>
                        <Typography variant="h5">${property.financials?.monthlyRent?.toFixed(2) || 'N/A'}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
       
(Content truncated due to size limit. Use line ranges to read in chunks)