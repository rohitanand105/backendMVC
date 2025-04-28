const express = require('express');
const router = express.Router();

// Import the MNPR controller
const mnprController = require('../controllers/mnprController');

// Import authentication middleware
const { authenticateToken } = require('../middlewares/auth.middleware');

// Define MNPR-related API routes
router.get('/', authenticateToken, mnprController.getMnprs);          // Get all MNPR records
router.get('/:id', authenticateToken, mnprController.getMnprById);    // Get MNPR record by ID
router.post('/', authenticateToken, mnprController.createMnpr);       // Create a new MNPR record
router.put('/:id', authenticateToken, mnprController.updateMnpr);     // Update an existing MNPR record by ID

// Export the router so it can be used in server.js
module.exports = router;
