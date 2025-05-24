const express = require('express');
const router = express.Router();
const { 
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
  getMaintenanceRequestsByProperty,
  getMaintenanceRequestsByStatus,
  
  getAllMaintenanceSchedules,
  getMaintenanceScheduleById,
  createMaintenanceSchedule,
  updateMaintenanceSchedule,
  deleteMaintenanceSchedule,
  
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

// Maintenance Request routes
router.route('/requests')
  .get(protect, getAllMaintenanceRequests)
  .post(protect, createMaintenanceRequest);

router.route('/requests/:id')
  .get(protect, getMaintenanceRequestById)
  .put(protect, updateMaintenanceRequest)
  .delete(protect, deleteMaintenanceRequest);

router.route('/requests/property/:propertyId')
  .get(protect, getMaintenanceRequestsByProperty);

router.route('/requests/status/:status')
  .get(protect, getMaintenanceRequestsByStatus);

// Maintenance Schedule routes
router.route('/schedules')
  .get(protect, getAllMaintenanceSchedules)
  .post(protect, createMaintenanceSchedule);

router.route('/schedules/:id')
  .get(protect, getMaintenanceScheduleById)
  .put(protect, updateMaintenanceSchedule)
  .delete(protect, deleteMaintenanceSchedule);

// Vendor routes
router.route('/vendors')
  .get(protect, getAllVendors)
  .post(protect, createVendor);

router.route('/vendors/:id')
  .get(protect, getVendorById)
  .put(protect, updateVendor)
  .delete(protect, deleteVendor);

module.exports = router;
