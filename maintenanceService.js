import api from './api';

// Maintenance service for managing maintenance requests, schedules, and vendors
const MaintenanceService = {
  // Maintenance Request methods
  getAllMaintenanceRequests: async () => {
    try {
      const response = await api.get('/maintenance/requests');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getMaintenanceRequestById: async (id) => {
    try {
      const response = await api.get(`/maintenance/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  createMaintenanceRequest: async (requestData) => {
    try {
      const response = await api.post('/maintenance/requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  updateMaintenanceRequest: async (id, requestData) => {
    try {
      const response = await api.put(`/maintenance/requests/${id}`, requestData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  deleteMaintenanceRequest: async (id) => {
    try {
      const response = await api.delete(`/maintenance/requests/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getMaintenanceRequestsByProperty: async (propertyId) => {
    try {
      const response = await api.get(`/maintenance/requests/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getMaintenanceRequestsByStatus: async (status) => {
    try {
      const response = await api.get(`/maintenance/requests/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Maintenance Schedule methods
  getAllMaintenanceSchedules: async () => {
    try {
      const response = await api.get('/maintenance/schedules');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getMaintenanceScheduleById: async (id) => {
    try {
      const response = await api.get(`/maintenance/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  createMaintenanceSchedule: async (scheduleData) => {
    try {
      const response = await api.post('/maintenance/schedules', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  updateMaintenanceSchedule: async (id, scheduleData) => {
    try {
      const response = await api.put(`/maintenance/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  deleteMaintenanceSchedule: async (id) => {
    try {
      const response = await api.delete(`/maintenance/schedules/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Vendor methods
  getAllVendors: async () => {
    try {
      const response = await api.get('/maintenance/vendors');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getVendorById: async (id) => {
    try {
      const response = await api.get(`/maintenance/vendors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  createVendor: async (vendorData) => {
    try {
      const response = await api.post('/maintenance/vendors', vendorData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  updateVendor: async (id, vendorData) => {
    try {
      const response = await api.put(`/maintenance/vendors/${id}`, vendorData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  deleteVendor: async (id) => {
    try {
      const response = await api.delete(`/maintenance/vendors/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  }
};

export default MaintenanceService;
