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
import { Add, Search, Edit, Delete, AttachMoney, AccountBalance } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FinancialService from '../services/financialService';
import PropertyService from '../services/propertyService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Financial = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
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
    filterTransactions();
  }, [searchTerm, typeFilter, propertyFilter, dateRangeFilter, transactions]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch transactions and properties in parallel
      const [transactionsData, propertiesData] = await Promise.all([
        FinancialService.getAllTransactions(),
        PropertyService.getAllProperties()
      ]);
      
      setTransactions(transactionsData);
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load financial data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.description?.toLowerCase().includes(search) || 
        transaction.category?.toLowerCase().includes(search) ||
        transaction.property?.name?.toLowerCase().includes(search)
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    // Apply property filter
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.property?._id === propertyFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (dateRangeFilter) {
        case 'thisMonth':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'lastMonth':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
          filtered = filtered.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= endDate;
          });
          break;
        case 'thisYear':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        case 'last30Days':
          startDate = new Date();
          startDate.setDate(today.getDate() - 30);
          break;
        case 'last90Days':
          startDate = new Date();
          startDate.setDate(today.getDate() - 90);
          break;
        default:
          startDate = null;
      }
      
      if (startDate && dateRangeFilter !== 'lastMonth') {
        filtered = filtered.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate;
        });
      }
    }
    
    setFilteredTransactions(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  const handlePropertyFilterChange = (e) => {
    setPropertyFilter(e.target.value);
  };

  const handleDateRangeFilterChange = (e) => {
    setDateRangeFilter(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddTransaction = () => {
    navigate('/financial/transactions/new');
  };

  const handleEditTransaction = (id) => {
    navigate(`/financial/transactions/${id}/edit`);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete) return;
    
    try {
      await FinancialService.deleteTransaction(transactionToDelete._id);
      setTransactions(transactions.filter(t => t._id !== transactionToDelete._id));
      setSnackbar({
        open: true,
        message: 'Transaction deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete transaction',
        severity: 'error'
      });
    } finally {
      setOpenDialog(false);
      setTransactionToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return amount ? `$${amount.toFixed(2)}` : 'N/A';
  };

  // Calculate financial summary
  const calculateFinancialSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netCashFlow = totalIncome - totalExpenses;
    
    // Calculate by category
    const incomeByCategory = {};
    const expensesByCategory = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeByCategory[transaction.category] = (incomeByCategory[transaction.category] || 0) + transaction.amount;
      } else {
        expensesByCategory[transaction.category] = (expensesByCategory[transaction.category] || 0) + transaction.amount;
      }
    });
    
    // Calculate by property
    const incomeByProperty = {};
    const expensesByProperty = {};
    const netByProperty = {};
    
    transactions.forEach(transaction => {
      const propertyName = transaction.property?.name || 'Unassigned';
      
      if (transaction.type === 'income') {
        incomeByProperty[propertyName] = (incomeByProperty[propertyName] || 0) + transaction.amount;
      } else {
        expensesByProperty[propertyName] = (expensesByProperty[propertyName] || 0) + transaction.amount;
      }
      
      netByProperty[propertyName] = (incomeByProperty[propertyName] || 0) - (expensesByProperty[propertyName] || 0);
    });
    
    return {
      totalIncome,
      totalExpenses,
      netCashFlow,
      incomeByCategory,
      expensesByCategory,
      incomeByProperty,
      expensesByProperty,
      netByProperty
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    const summary = calculateFinancialSummary();
    
    // Monthly income/expense data
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 12; i++) {
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === i && 
               transactionDate.getFullYear() === currentYear;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        name: months[i],
        income,
        expenses,
        profit: income - expenses
      });
    }
    
    // Income by category data
    const incomeByCategoryData = Object.keys(summary.incomeByCategory).map(category => ({
      name: category,
      value: summary.incomeByCategory[category]
    }));
    
    // Expenses by category data
    const expensesByCategoryData = Object.keys(summary.expensesByCategory).map(category => ({
      name: category,
      value: summary.expensesByCategory[category]
    }));
    
    // Property performance data
    const propertyPerformanceData = Object.keys(summary.netByProperty).map(property => ({
      name: property,
      income: summary.incomeByProperty[property] || 0,
      expenses: summary.expensesByProperty[property] || 0,
      profit: summary.netByProperty[property]
    }));
    
    return {
      monthlyData,
      incomeByCategoryData,
      expensesByCategoryData,
      propertyPerformanceData
    };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  const summary = calculateFinancialSummary();
  const chartData = prepareChartData();

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
        <Typography variant="h1">Financial Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleAddTransaction}
        >
          Add Transaction
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Financial Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Income
              </Typography>
              <Typography variant="h3" color="success.main">
                {formatCurrency(summary.totalIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Expenses
              </Typography>
              <Typography variant="h3" color="error.main">
                {formatCurrency(summary.totalExpenses)}
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
              <Typography variant="h3" color={summary.netCashFlow >= 0 ? 'success.main' : 'error.main'}>
                {formatCurrency(summary.netCashFlow)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
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
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" />
          <Tab label="Transactions" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Monthly Financial Overview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>Monthly Financial Overview</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData.monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="income" fill="#00C49F" name="Income" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                  <Bar dataKey="profit" fill="#0088FE" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          {/* Income & Expense by Category */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>Income by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.incomeByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.incomeByCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>Expenses by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.expensesByCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.expensesByCategoryData.
(Content truncated due to size limit. Use line ranges to read in chunks)