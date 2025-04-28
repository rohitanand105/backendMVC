// /controllers/mnprController.js
const mnprModel = require('../models/mnprModel');

exports.getMnprs = async (req, res) => {
  try {
    const { circle } = req.query;
    const mnprs = await mnprModel.getMnprData(circle);
    res.status(200).json({ success: true, mnprData: mnprs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
};

exports.getMnprById = async (req, res) => {
  try {
    const mnpr = await mnprModel.getMnprById(req.params.id);
    if (mnpr) {
      res.status(200).json({ success: true, mnprData: mnpr });
    } else {
      res.status(404).json({ success: false, message: "MNPR record not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
};

exports.createMnpr = async (req, res) => {
  try {
    const data = req.body;
    const errors = {};

    if (!data.serviceType) errors.serviceType = "Service type is required!";
    if (!data.customerName) errors.customerName = "Customer name is required!";
    if (!data.mnprCode) errors.mnprCode = "MNPR code is required!";
    if (!data.dateOfJoining) errors.dateOfJoining = "Joining date is required!";
    if (data.dateOfLeaving && new Date(data.dateOfLeaving) < new Date(data.dateOfJoining)) errors.dateOfLeaving = "Leaving cannot be before Joining!";

    if (Object.keys(errors).length > 0) return res.status(400).json({ success: false, errors });

    const result = await mnprModel.addMnpr(data);
    res.status(201).json({ success: true, message: "MNPR record added successfully!", mnprId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding MNPR record", error: error.message });
  }
};

exports.updateMnpr = async (req, res) => {
  try {
    const result = await mnprModel.updateMnpr(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "MNPR record not found or no changes made." });
    }
    res.json({ success: true, message: "MNPR record updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating MNPR record", error });
  }
};
