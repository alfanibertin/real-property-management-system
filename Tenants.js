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
  Divider
} from '@mui/material';
import { Add, Search, Edit, Delete, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TenantService from '../services/tenantService';
import LeaseService from '../services/leaseService';

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState(null);
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
    filterTenants();
  }, [searchTerm, statusFilter, tenants]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch tenants and leases in parallel
      const [tenantsData, leasesData] = await Promise.all([
        TenantService.getAllTenants(),
        LeaseService.getAllLeases()
      ]);
      
      setTenants(tenantsData);
      setLeases(leasesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load tenants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterTenants = () => {
    let filtered = [...tenants];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(tenant => 
        `${tenant.firstName} ${tenant.lastName}`.toLowerCase().includes(search) || 
        tenant.email?.toLowerCase().includes(search) ||
        tenant.phone?.toLowerCase().includes(search)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tenant => tenant.status === statusFilter);
    }
    
    setFilteredTenants(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAddTenant = () => {
    navigate('/tenants/new');
  };

  const handleViewTenant = (id) => {
    navigate(`/tenants/${id}`);
  };

  const handleEditTenant = (id) => {
    navigate(`/tenants/${id}/edit`);
  };

  const handleDeleteClick = (tenant) => {
    setTenantToDelete(tenant);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tenantToDelete) return;
    
    try {
      await TenantService.deleteTenant(tenantToDelete._id);
      setTenants(tenants.filter(t => t._id !== tenantToDelete._id));
      setSnackbar({
        open: true,
        message: 'Tenant deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete tenant',
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setTenantToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTenantToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to get tenant's active lease
  const getTenantLease = (tenantId) => {
    return leases.find(lease => 
      lease.tenant?._id === tenantId && 
      lease.status === 'active'
    );
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
        <Typography variant="h1">Tenants</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddTenant}
        >
          Add Tenant
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
              label="Search Tenants"
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
                <MenuItem value="former">Former</MenuItem>
                <MenuItem value="applicant">Applicant</MenuItem>
                <MenuItem value="eviction">Eviction</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tenant List */}
      {filteredTenants.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No tenants found</Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            {tenants.length > 0 
              ? 'Try adjusting your search or filters' 
              : 'Click "Add Tenant" to create your first tenant'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredTenants.map((tenant) => {
            const activeLease = getTenantLease(tenant._id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={tenant._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                      <Typography variant="h5" component="div">
                        {tenant.firstName} {tenant.lastName}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Email:</strong> {tenant.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Phone:</strong> {tenant.phone}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Status:</strong> {tenant.status}
                    </Typography>
                    
                    {activeLease && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Property:</strong> {activeLease.property?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Lease Ends:</strong> {new Date(activeLease.endDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Rent:</strong> ${activeLease.rentAmount?.toFixed(2) || 'N/A'}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <Button size="small" onClick={() => handleViewTenant(tenant._id)}>
                      View Details
                    </Button>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleEditTenant(tenant._id)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(tenant)}
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
            Are you sure you want to delete the tenant "{tenantToDelete?.firstName} {tenantToDelete?.lastName}"? This action cannot be undone.
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

export default Tenants;
