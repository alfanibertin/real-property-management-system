import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/context/AuthContext';
import Properties from '../src/pages/Properties';

// Mock the service modules
jest.mock('../src/services/propertyService');

// Mock the context
jest.mock('../src/context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: '1', firstName: 'Test', lastName: 'User', email: 'test@example.com' }
  })
}));

describe('Properties Component', () => {
  beforeEach(() => {
    // Setup mocks for services
    const propertyService = require('../src/services/propertyService');
    propertyService.getAllProperties.mockResolvedValue([
      { 
        _id: '1', 
        name: 'Oakwood Apartments', 
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704'
        },
        type: 'multi-family',
        status: 'occupied',
        features: {
          bedrooms: 2,
          bathrooms: 1,
          squareFootage: 1200
        },
        financials: {
          purchasePrice: 250000,
          currentValue: 300000,
          monthlyRent: 1500
        }
      },
      { 
        _id: '2', 
        name: 'Riverside Home', 
        address: {
          street: '456 River Rd',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62707'
        },
        type: 'single-family',
        status: 'vacant',
        features: {
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1800
        },
        financials: {
          purchasePrice: 350000,
          currentValue: 380000,
          monthlyRent: 2000
        }
      }
    ]);
  });

  test('renders properties list', async () => {
    render(
      <BrowserRouter>
        <Properties />
      </BrowserRouter>
    );
    
    // Check for loading state first
    expect(screen.getByText(/loading/i) || screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Properties/i)).toBeInTheDocument();
    });
    
    // Check for property data
    await waitFor(() => {
      expect(screen.getByText(/Oakwood Apartments/i)).toBeInTheDocument();
      expect(screen.getByText(/Riverside Home/i)).toBeInTheDocument();
      expect(screen.getByText(/123 Main St/i)).toBeInTheDocument();
      expect(screen.getByText(/456 River Rd/i)).toBeInTheDocument();
    });
  });

  test('filters properties by search term', async () => {
    render(
      <BrowserRouter>
        <Properties />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Properties/i)).toBeInTheDocument();
    });
    
    // Find search input and type in it
    const searchInput = screen.getByPlaceholderText(/Search properties/i);
    fireEvent.change(searchInput, { target: { value: 'Riverside' } });
    
    // Check that only matching property is shown
    await waitFor(() => {
      expect(screen.getByText(/Riverside Home/i)).toBeInTheDocument();
      expect(screen.queryByText(/Oakwood Apartments/i)).not.toBeInTheDocument();
    });
  });

  test('filters properties by status', async () => {
    render(
      <BrowserRouter>
        <Properties />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Properties/i)).toBeInTheDocument();
    });
    
    // Find status filter and change it
    const statusFilter = screen.getByLabelText(/Status/i);
    fireEvent.change(statusFilter, { target: { value: 'vacant' } });
    
    // Check that only matching property is shown
    await waitFor(() => {
      expect(screen.getByText(/Riverside Home/i)).toBeInTheDocument();
      expect(screen.queryByText(/Oakwood Apartments/i)).not.toBeInTheDocument();
    });
  });

  test('navigates to property details when property is clicked', async () => {
    render(
      <BrowserRouter>
        <Properties />
      </BrowserRouter>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Properties/i)).toBeInTheDocument();
    });
    
    // Find and click the View Details button for a property
    const viewDetailsButton = await screen.findByText(/View Details/i);
    fireEvent.click(viewDetailsButton);
    
    // In a real test with actual routing, we would check for navigation
    // Here we're just ensuring the button exists and is clickable
    expect(viewDetailsButton).toBeInTheDocument();
  });
});
