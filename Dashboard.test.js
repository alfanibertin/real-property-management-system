import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Dashboard from '../src/pages/Dashboard';

// Mock the service modules
jest.mock('../src/services/propertyService');
jest.mock('../src/services/financialService');
jest.mock('../src/services/maintenanceService');
jest.mock('../src/services/tenantService');

// Mock the context
jest.mock('../src/context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '1', firstName: 'Test', lastName: 'User', email: 'test@example.com' }
  })
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Setup mocks for services
    const propertyService = require('../src/services/propertyService');
    propertyService.getAllProperties.mockResolvedValue([
      { _id: '1', name: 'Property 1', status: 'occupied' },
      { _id: '2', name: 'Property 2', status: 'vacant' }
    ]);
    
    const financialService = require('../src/services/financialService');
    financialService.getFinancialSummary.mockResolvedValue({
      totalIncome: 5000,
      totalExpenses: 2000,
      netCashFlow: 3000
    });
    
    const maintenanceService = require('../src/services/maintenanceService');
    maintenanceService.getAllMaintenanceRequests.mockResolvedValue([
      { _id: '1', title: 'Fix Roof', status: 'open', priority: 'high' }
    ]);
    
    const tenantService = require('../src/services/tenantService');
    tenantService.getAllTenants.mockResolvedValue([
      { _id: '1', firstName: 'John', lastName: 'Doe', status: 'active' }
    ]);
  });

  test('renders dashboard with property statistics', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Check for loading state first
    expect(screen.getByText(/loading/i) || screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/Property Overview/i)).toBeInTheDocument();
    });
    
    // Check for property statistics
    await waitFor(() => {
      expect(screen.getByText(/Total Properties: 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Occupied: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Vacant: 1/i)).toBeInTheDocument();
    });
  });

  test('renders financial summary', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Financial Summary/i)).toBeInTheDocument();
    });
    
    // Check for financial data
    await waitFor(() => {
      expect(screen.getByText(/\$5,000/i)).toBeInTheDocument(); // Total Income
      expect(screen.getByText(/\$2,000/i)).toBeInTheDocument(); // Total Expenses
      expect(screen.getByText(/\$3,000/i)).toBeInTheDocument(); // Net Cash Flow
    });
  });

  test('renders maintenance requests', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Recent Maintenance Requests/i)).toBeInTheDocument();
    });
    
    // Check for maintenance request data
    await waitFor(() => {
      expect(screen.getByText(/Fix Roof/i)).toBeInTheDocument();
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });
  });

  test('navigates to different sections when links are clicked', async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
    
    // Find and click the Properties link
    const propertiesLink = screen.getByText(/View All Properties/i);
    fireEvent.click(propertiesLink);
    
    // In a real test with actual routing, we would check for navigation
    // Here we're just ensuring the link exists and is clickable
    expect(propertiesLink).toHaveAttribute('href', '/properties');
  });
});
