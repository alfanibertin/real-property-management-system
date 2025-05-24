import api from './api';

// Lease service for managing leases
const LeaseService = {
  // Get all leases
  getAllLeases: async () => {
    try {
      const response = await api.get('/leases');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Get lease by ID
  getLeaseById: async (id) => {
    try {
      const response = await api.get(`/leases/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Create a new lease
  createLease: async (leaseData) => {
    try {
      const response = await api.post('/leases', leaseData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Update a lease
  updateLease: async (id, leaseData) => {
    try {
      const response = await api.put(`/leases/${id}`, leaseData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Delete a lease
  deleteLease: async (id) => {
    try {
      const response = await api.delete(`/leases/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Get lease documents
  getLeaseDocuments: async (id) => {
    try {
      const response = await api.get(`/leases/${id}/documents`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Upload lease document
  uploadLeaseDocument: async (id, documentData) => {
    try {
      const response = await api.post(`/leases/${id}/documents`, documentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Delete lease document
  deleteLeaseDocument: async (leaseId, documentId) => {
    try {
      const response = await api.delete(`/leases/${leaseId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  }
};

export default LeaseService;
