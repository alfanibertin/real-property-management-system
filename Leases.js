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
  Chip
} from '@mui/material';
import { Add, Search, Edit, Delete, Description } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LeaseService from '../services/leaseService';
import PropertyService from '../services/propertyService';
import TenantService from '../services/tenantService';

const Leases = () => {
  const [leases, setLeases] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [leaseToDelete, setLeaseToDelete] = useState(null);
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
    filterLeases();
  }, [searchTerm, statusFilter, leases]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch leases, properties, and tenants in parallel
      const [leasesData, propertiesData, tenantsData] = await Promise.all([
        LeaseService.getAllLeases(),
        PropertyService.getAllProperties(),
        TenantService.getAllTenants()
      ]);
      
      setLeases(leasesData);
      setProperties(propertiesData);
      setTenants(tenantsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load leases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterLeases = () => {
    let filtered = [...leases];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(lease => 
        lease.property?.name?.toLowerCase().includes(search) || 
        `${lease.tenant?.firstName} ${lease.tenant?.lastName}`.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lease => lease.status === statusFilter);
    }
    
    setFilteredLeases(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAddLease = () => {
    navigate('/leases/new');
  };

  const handleViewLease = (id) => {
    navigate(`/leases/${id}`);
  };

  const handleEditLease = (id) => {
    navigate(`/leases/${id}/edit`);
  };

  const handleDeleteClick = (lease) => {
    setLeaseToDelete(lease);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leaseToDelete) return;
    
    try {
      await LeaseService.deleteLease(leaseToDelete._id);
      setLeases(leases.filter(l => l._id !== leaseToDelete._id));
      setSnackbar({
        open: true,
        message: 'Lease deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting lease:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete lease',
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setLeaseToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setLeaseToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'expired':
        return 'error';
      case 'terminated':
        return 'error';
      case 'renewal':
        return 'info';
      default:
        return 'default';
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `$${amount.toFixed(2)}` : 'N/A';
  };

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
        <Typography variant="h1">Leases</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddLease}
        >
          Add Lease
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
              label="Search Leases"
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
                <MenuItem value="renewal">Renewal</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Lease List */}
      {filteredLeases.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No leases found</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            {leases.length > 0 
              ? 'Try adjusting your search or filters' 
              : 'Click "Add Lease" to create your first lease'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredLeases.map((lease) => {
            const daysRemaining = calculateDaysRemaining(lease.endDate);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={lease._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Description sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                        <Typography variant="h5" component="div">
                          {lease.property?.name || 'Unknown Property'}
                        </Typography>
                      </Box>
                      <Chip 
                        label={lease.status} 
                        color={getStatusColor(lease.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body2" gutterBottom>
                      <strong>Tenant:</strong> {lease.tenant ? `${lease.tenant.firstName} ${lease.tenant.lastName}` : 'None'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Rent Amount:</strong> {formatCurrency(lease.rentAmount)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Security Deposit:</strong> {formatCurrency(lease.securityDeposit)}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Start Date:</strong> {new Date(lease.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>End Date:</strong> {new Date(lease.endDate).toLocaleDateString()}
                    </Typography>
                    
                    {lease.status === 'active' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color={daysRemaining < 30 ? 'error.main' : 'text.secondary'}>
                          <strong>Days Remaining:</strong> {daysRemaining}
                        </Typography>
                        {daysRemaining < 30 && (
                          <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                            Lease expiring soon!
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" onClick={() => handleViewLease(lease._id)}>
                      View Details
                    </Button>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditLease(lease._id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(lease)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this lease for property "{leaseToDelete?.property?.name}"? This action cannot be undone.
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

export default Leases;
