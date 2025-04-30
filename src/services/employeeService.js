const Employee = require('../models/employee');

const getAllEmployees = async () => {
  return await Employee.findAll();
};

const getEmployeeById = async (id) => {
  return await Employee.findByPk(id);
};

const createEmployee = async (data) => {
  return await Employee.create(data);
};

const updateEmployee = async (id, data) => {
  const employee = await Employee.findByPk(id);
  if (!employee) throw new Error('Employee not found');
  return await employee.update(data);
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
};
