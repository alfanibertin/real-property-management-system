import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropertyService from '../services/propertyService';
import FinancialService from '../services/financialService';
import MaintenanceService from '../services/maintenanceService';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch properties
        const propertiesData = await PropertyService.getAllProperties();
        setProperties(propertiesData);
        
        // Fetch recent transactions
        const transactionsData = await FinancialService.getAllTransactions();
        setTransactions(transactionsData);
        
        // Fetch maintenance requests
        const maintenanceData = await MaintenanceService.getAllMaintenanceRequests();
        setMaintenanceRequests(maintenanceData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Calculate financial summary
  const calculateFinancialSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return {
      income,
      expenses,
      netCashFlow: income - expenses
    };
  };

  // Prepare data for charts
  const prepareChartData = () => {
    // Property status distribution
    const statusCounts = properties.reduce((acc, property) => {
      acc[property.status] = (acc[property.status] || 0) + 1;
      return acc;
    }, {});
    
    const propertyStatusData = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
    
    // Maintenance request status
    const maintenanceStatusCounts = maintenanceRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});
    
    const maintenanceStatusData = Object.keys(maintenanceStatusCounts).map(status => ({
      name: status,
      value: maintenanceStatusCounts[status]
    }));
    
    // Monthly income/expense
    const monthlyFinancialData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 6; i++) {
      const monthIndex = (new Date().getMonth() - i + 12) % 12;
      const year = monthIndex > new Date().getMonth() ? currentYear - 1 : currentYear;
      
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === monthIndex && 
               transactionDate.getFullYear() === year;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyFinancialData.unshift({
        name: months[monthIndex],
        income,
        expenses
      });
    }
    
    return {
      propertyStatusData,
      maintenanceStatusData,
      monthlyFinancialData
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const { income, expenses, netCashFlow } = calculateFinancialSummary();
  const { propertyStatusData, maintenanceStatusData, monthlyFinancialData } = prepareChartData();

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
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1" sx={{ mb: 4 }}>Dashboard</Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Properties
              </Typography>
              <Typography variant="h3">
                {properties.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Monthly Income
              </Typography>
              <Typography variant="h3">
                ${income.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Monthly Expenses
              </Typography>
              <Typography variant="h3">
                ${expenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Net Cash Flow
              </Typography>
              <Typography variant="h3" color={netCashFlow >= 0 ? 'success.main' : 'error.main'}>
                ${netCashFlow.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Monthly Financial Overview</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyFinancialData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#00C49F" name="Income" />
                <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Property Status</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Maintenance Requests */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Recent Maintenance Requests</Typography>
          <Button variant="outlined" onClick={() => navigate('/maintenance')}>View All</Button>
        </Box>
        
        {maintenanceRequests.length === 0 ? (
          <Typography>No maintenance requests found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {maintenanceRequests.slice(0, 3).map((request) => (
              <Grid item xs={12} md={4} key={request._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Property: {request.property?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Status: {request.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Priority: {request.priority}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {request.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      {/* Recent Properties */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Properties Overview</Typography>
          <Button variant="outlined" onClick={() => navigate('/properties')}>View All</Button>
        </Box>
        
        {properties.length === 0 ? (
          <Typography>No properties found.</Typography>
        ) : (
          <Grid container spacing={2}>
            {properties.slice(0, 3).map((property) => (
              <Grid item xs={12} md={4} key={property._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {property.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Type: {property.type}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Status: {property.status}
                    </Typography>
                    {property.financials?.currentValue && (
                      <Typography variant="body1">
                        Value: ${property.financials.currentValue.toFixed(2)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;
