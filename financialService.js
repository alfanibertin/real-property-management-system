import api from './api';

// Financial service for managing transactions and mortgages
const FinancialService = {
  // Transaction methods
  getAllTransactions: async () => {
    try {
      const response = await api.get('/financial/transactions');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getTransactionById: async (id) => {
    try {
      const response = await api.get(`/financial/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  createTransaction: async (transactionData) => {
    try {
      const response = await api.post('/financial/transactions', transactionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  updateTransaction: async (id, transactionData) => {
    try {
      const response = await api.put(`/financial/transactions/${id}`, transactionData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/financial/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getTransactionsByProperty: async (propertyId) => {
    try {
      const response = await api.get(`/financial/transactions/property/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getTransactionsByCategory: async (category) => {
    try {
      const response = await api.get(`/financial/transactions/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  // Mortgage methods
  getAllMortgages: async () => {
    try {
      const response = await api.get('/financial/mortgages');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  getMortgageById: async (id) => {
    try {
      const response = await api.get(`/financial/mortgages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  createMortgage: async (mortgageData) => {
    try {
      const response = await api.post('/financial/mortgages', mortgageData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  updateMortgage: async (id, mortgageData) => {
    try {
      const response = await api.put(`/financial/mortgages/${id}`, mortgageData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  },

  deleteMortgage: async (id) => {
    try {
      const response = await api.delete(`/financial/mortgages/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Server error');
    }
  }
};

export default FinancialService;
