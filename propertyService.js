import api from './api';

// Property service for managing properties
const PropertyService = {
  // Get all properties
  getAllProperties: async () => {
    try {
      const response = await api.get('/properties');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Get property by ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Create a new property
  createProperty: async (propertyData) => {
    try {
      const response = await api.post('/properties', propertyData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Update a property
  updateProperty: async (id, propertyData) => {
    try {
      const response = await api.put(`/properties/${id}`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Delete a property
  deleteProperty: async (id) => {
    try {
      const response = await api.delete(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Get property documents
  getPropertyDocuments: async (id) => {
    try {
      const response = await api.get(`/properties/${id}/documents`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Upload property document
  uploadPropertyDocument: async (id, documentData) => {
    try {
      const response = await api.post(`/properties/${id}/documents`, documentData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Delete property document
  deletePropertyDocument: async (propertyId, documentId) => {
    try {
      const response = await api.delete(`/properties/${propertyId}/documents/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  }
};

export default PropertyService;
