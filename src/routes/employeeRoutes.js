// /routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, employeeController.getEmployees);
router.get('/:id', authenticateToken, employeeController.getEmployeeById);
router.post('/', authenticateToken, employeeController.createEmployee);
router.put('/:id', authenticateToken, employeeController.updateEmployee);

module.exports = router;
