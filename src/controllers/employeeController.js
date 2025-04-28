// /controllers/employeeController.js
const employeeModel = require('../models/employeeModel');

exports.getEmployees = async (req, res) => {
  try {
    const { circle } = req.query;
    const employees = await employeeModel.getAllEmployees(circle);
    res.status(200).json({ success: true, empData: employees });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await employeeModel.getEmployeeById(req.params.id);
    if (employee) {
      res.status(200).json({ success: true, empData: employee });
    } else {
      res.status(404).json({ success: false, message: "Employee not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const data = req.body;
    const errors = {};

    if (!data.serviceType) errors.serviceType = "Service type is required!";
    if (!data.customerName) errors.customerName = "Customer name is required!";
    if (!data.employeeId || !/^\d+$/.test(data.employeeId)) errors.employeeId = "Employee ID must be a number!";
    if (!data.aadharNo || !/^\d{12}$/.test(data.aadharNo)) errors.aadharNo = "Aadhar must be 12 digits!";
    if (!data.empContactNumber || !/^\d{10}$/.test(data.empContactNumber)) errors.empContactNumber = "Contact Number must be 10 digits!";
    if (!data.dateOfJoining) errors.dateOfJoining = "Joining date is required!";
    if (data.dateOfLeaving && new Date(data.dateOfLeaving) < new Date(data.dateOfJoining)) errors.dateOfLeaving = "Leaving cannot be before Joining!";

    if (Object.keys(errors).length > 0) return res.status(400).json({ success: false, errors });

    const result = await employeeModel.addEmployee(data);
    res.status(201).json({ success: true, message: "Employee added successfully!", employeeId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding employee", error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const result = await employeeModel.updateEmployee(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Employee not found or no changes made." });
    }
    res.json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating employee", error });
  }
};
