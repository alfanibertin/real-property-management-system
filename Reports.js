import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const Reports = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('income');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('month');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // Sample saved reports
  const savedReports = [
    { 
      id: 1, 
      name: 'Q1 2025 Income Statement', 
      type: 'Income Statement', 
      properties: 'All Properties', 
      timePeriod: 'Jan 1 - Mar 31, 2025', 
      generatedOn: 'Apr 2, 2025' 
    },
    { 
      id: 2, 
      name: '2024 Annual ROI Analysis', 
      type: 'ROI Analysis', 
      properties: 'All Properties', 
      timePeriod: 'Jan 1 - Dec 31, 2024', 
      generatedOn: 'Jan 15, 2025' 
    },
    { 
      id: 3, 
      name: 'Sunset Villa Expense Breakdown', 
      type: 'Expense Breakdown', 
      properties: 'Sunset Villa', 
      timePeriod: 'Last 12 Months', 
      generatedOn: 'Mar 10, 2025' 
    },
    { 
      id: 4, 
      name: 'Monthly Cash Flow - March 2025', 
      type: 'Cash Flow', 
      properties: 'All Properties', 
      timePeriod: 'Mar 1 - Mar 31, 2025', 
      generatedOn: 'Apr 1, 2025' 
    },
    { 
      id: 5, 
      name: 'Maintenance Cost Analysis', 
      type: 'Expense Breakdown', 
      properties: 'All Properties', 
      timePeriod: 'Last 12 Months', 
      generatedOn: 'Mar 15, 2025' 
    }
  ];
  
  // Sample data for income vs expenses chart
  const incomeExpensesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [12000, 11500, 12500, 12450, 13000, 12800],
        backgroundColor: 'rgba(46, 204, 113, 0.5)',
        borderColor: '#2ecc71',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: [8000, 7800, 8200, 8320, 8500, 8400],
        backgroundColor: 'rgba(231, 76, 60, 0.5)',
        borderColor: '#e74c3c',
        borderWidth: 1,
      },
    ],
  };
  
  // Sample data for cash flow chart
  const cashFlowData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Net Cash Flow',
        data: [4000, 3700, 4300, 4130, 4500, 4400],
        backgroundColor: 'rgba(52, 152, 219, 0.5)',
        borderColor: '#3498db',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      }
    ],
  };
  
  // Sample data for expense breakdown chart
  const expenseBreakdownData = {
    labels: ['Mortgage', 'Maintenance', 'Insurance', 'Property Tax', 'Utilities', 'HOA Fees', 'Other'],
    datasets: [
      {
        data: [48, 15, 10, 12, 5, 8, 2],
        backgroundColor: [
          'rgba(52, 152, 219, 0.7)',
          'rgba(155, 89, 182, 0.7)',
          'rgba(52, 73, 94, 0.7)',
          'rgba(22, 160, 133, 0.7)',
          'rgba(241, 196, 15, 0.7)',
          'rgba(230, 126, 34, 0.7)',
          'rgba(149, 165, 166, 0.7)'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Sample data for ROI chart
  const roiData = {
    labels: ['Oakwood Apartments #301', 'Sunset Villa', 'Riverside Condo #205', 'Mountain View Apartments #512', 'Harbor Heights #1203'],
    datasets: [
      {
        label: 'Annual ROI (%)',
        data: [8.2, 7.5, 9.1, 6.8, 7.9],
        backgroundColor: 'rgba(52, 152, 219, 0.7)',
        borderColor: '#3498db',
        borderWidth: 1,
      }
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
  };
  
  const handlePropertyFilterChange = (event) => {
    setPropertyFilter(event.target.value);
  };
  
  const handleTimeFilterChange = (event) => {
    setTimeFilter(event.target.value);
  };
  
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Determine which chart to show based on report type
  const renderReportChart = () => {
    switch(reportType) {
      case 'income':
        return (
          <Box sx={{ height: 400 }}>
            <Bar data={incomeExpensesData} options={chartOptions} />
          </Box>
        );
      case 'cashflow':
        return (
          <Box sx={{ height: 400 }}>
            <Line data={cashFlowData} options={chartOptions} />
          </Box>
        );
      case 'expense':
        return (
          <Box sx={{ height: 400 }}>
            <Doughnut data={expenseBreakdownData} options={chartOptions} />
          </Box>
        );
      case 'roi':
        return (
          <Box sx={{ height: 400 }}>
            <Bar data={roiData} options={chartOptions} />
          </Box>
        );
      default:
        return (
          <Box sx={{ height: 400 }}>
            <Bar data={incomeExpensesData} options={chartOptions} />
          </Box>
        );
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1">Reports</Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="Generate Reports" />
            <Tab label="Saved Reports" />
          </Tabs>
          
          {/* Generate Reports Tab */}
          {tabValue === 0 && (
            <Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="report-type-label">Report Type</InputLabel>
                  <Select
                    labelId="report-type-label"
                    value={reportType}
                    label="Report Type"
                    onChange={handleReportTypeChange}
                  >
                    <MenuItem value="income">Income Statement</MenuItem>
                    <MenuItem value="cashflow">Cash Flow</MenuItem>
                    <MenuItem value="expense">Expense Breakdown</MenuItem>
                    <MenuItem value="roi">ROI Analysis</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="property-filter-label">Property</InputLabel>
                  <Select
                    labelId="property-filter-label"
                    value={propertyFilter}
                    label="Property"
                    onChange={handlePropertyFilterChange}
                  >
                    <MenuItem value="all">All Properties</MenuItem>
                    <MenuItem value="oakwood">Oakwood Apartments #301</MenuItem>
                    <MenuItem value="sunset">Sunset Villa</MenuItem>
                    <MenuItem value="riverside">Riverside Condo #205</MenuItem>
                    <MenuItem value="mountain">Mountain View Apartments #512</MenuItem>
                    <MenuItem value="harbor">Harbor Heights #1203</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="time-filter-label">Time Period</InputLabel>
                  <Select
                    labelId="time-filter-label"
                    value={timeFilter}
                    label="Time Period"
                    onChange={handleTimeFilterChange}
                  >
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="quarter">This Quarter</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                    <MenuItem value="last12">Last 12 Months</MenuItem>
                    <MenuItem value="custom">Custom Range</MenuItem>
                  </Select>
                </FormControl>
                
                <Button variant="contained">
                  Generate Report
                </Button>
              </Box>
              
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3">
                      {reportType === 'income' && 'Income Statement'}
                      {reportType === 'cashflow' && 'Cash Flow Analysis'}
                      {reportType === 'expense' && 'Expense Breakdown'}
                      {reportType === 'roi' && 'Return on Investment Analysis'}
                    </Typography>
                    <Box>
                      <Button startIcon={<PrintIcon />} sx={{ mr: 1 }}>
                        Print
                      </Button>
                      <Button startIcon={<DownloadIcon />}>
                        Download
                      </Button>
                    </Box>
                  </Box>
                  
                  {renderReportChart()}
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="h3" sx={{ mb: 2 }}>Report Details</Typography>
                  
                  <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell align="right">Jan</TableCell>
                          <TableCell align="right">Feb</TableCell>
                          <TableCell align="right">Mar</TableCell>
                          <TableCell align="right">Apr</TableCell>
                          <TableCell align="right">May</TableCell>
                          <TableCell align="right">Jun</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={8}><Typography fontWeight="bold">Income</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Rental Income</TableCell>
                          <TableCell align="right">$12,000</TableCell>
                          <TableCell align="right">$11,500</TableCell>
                          <TableCell align="right">$12,500</TableCell>
                          <TableCell align="right">$12,450</TableCell>
                          <TableCell align="right">$13,000</TableCell>
                          <TableCell align="right">$12,800</TableCell>
                          <TableCell align="right">$74,250</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Other Income</TableCell>
                          <TableCell align="right">$0</TableCell>
                          <TableCell align="right">$0</TableCell>
                          <TableCell align="right">$0</TableCell>
                          <TableCell align="right">$0</TableCell>
                          <TableCell align="right">$0</TableCell>
                          <TableCell align="right">$0</TableCell>
                          <TableCell align="right">$0</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell><Typography fontWeight="bold">Total Income</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$12,000</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$11,500</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$12,500</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$12,450</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$13,000</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$12,800</Typography></TableCell>
                          <TableCell align="right"><Typography fontWeight="bold">$74,250</Typography></TableCell>
                        </TableRow>
                        
                        <TableRow>
                          <TableCell colSpan={8}><Typography fontWeight="bold">Expenses</Typography></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mortgage</TableCell>
                          <TableCell align="right">$4,100</TableCell>
                          <TableCell align="right">$4,100</TableCell>
                          <TableCell align="right">$4,100</TableCell>
                          <TableCell align="right">$4,100</TableCell>
                          <TableCell align="right">$4,100</TableCell>
                          <TableCell align="right">$4,100</TableCell>
                          <TableCell align="right">$24,600</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Maintenance</TableCell>
                          <TableCell align="right">$1,200</TableCell>
                          <TableCell align="right">$950</TableCell>
                          <TableCell align="right">$1,350</TableCell>
                          <TableCell align="right">$1,320</TableCell>
                          <TableCell align="right">$1,500</TableCell>
                          <TableCell align="right">$1,400</TableCell>
                          <TableCell align="right">$7,720</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Insurance</TableCell>
                          <TableCell align="right">$800</TableCell>
                          <TableCell align="right">$800</TableCell>
                          <TableCell align="right">$800</TableCell>
                          <TableCell align="right">$800</TableCell>
                          <TableCell align="right">$800</TableCell>
                          <TableCell align="right">$800</TableCell>
                          <TableCell align="right">$4,800</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Property Tax</TableCell>
                          <TableCell align=
(Content truncated due to size limit. Use line ranges to read in chunks)