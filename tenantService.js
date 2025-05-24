import api from './api';

// Tenant service for managing tenants
const TenantService = {
  // Get all tenants
  getAllTenants: async () => {
    try {
      const response = await api.get('/tenants');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Get tenant by ID
  getTenantById: async (id) => {
    try {
      const response = await api.get(`/tenants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Create a new tenant
  createTenant: async (tenantData) => {
    try {
      const response = await api.post('/tenants', tenantData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Update a tenant
  updateTenant: async (id, tenantData) => {
    try {
      const response = await api.put(`/tenants/${id}`, tenantData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Delete a tenant
  deleteTenant: async (id) => {
    try {
      const response = await api.delete(`/tenants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Get tenant documents
  getTenantDocuments: async (id) => {
    try {
      const response = await api.get(`/tenants/${id}/documents`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Upload tenant document
  uploadTenantDocument: async (id, documentData) => {
    try {
      const response = await api.post(`/tenants/${id}/documents`, documentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Delete tenant document
  deleteTenantDocument: async (tenantId, documentId) => {
    try {
      const response = await api.delete(`/tenants/${tenantId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  }
};

export default TenantService;
