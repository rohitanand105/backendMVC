const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Get All Employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a New Employee
router.post("/", async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.json(newEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
