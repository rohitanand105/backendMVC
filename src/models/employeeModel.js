// /models/employeeModel.js
const pool = require('../config/db');

exports.getAllEmployees = async (circle) => {
  let query = `
    SELECT 
      service_type, customer_name, Circle, Cluster, City, Domain, employee_id, 
      Aadhar_No, PPRJ_Code, Employee_Name, Job_Category, Job_Role, EMP_Contact_Number,
      DATE_FORMAT(DOJ, '%Y-%m-%d') AS DOJ, Active_Status, 
      DATE_FORMAT(Date_of_leaving, '%Y-%m-%d') AS Date_of_leaving, 
      COALESCE(CTC, 0) AS CTC, COALESCE(Conveyance, 0) AS Conveyance, 
      COALESCE(Allowance1, 0) AS Allowance1, COALESCE(Allowance2, 0) AS Allowance2, 
      COALESCE(TCTC, 0) AS TCTC, Reporting_Manager1, Reporting_Manager2, Ref_emp_id
    FROM emp_table
  `;

  const values = [];
  if (circle) {
    query += " WHERE Circle = ?";
    values.push(circle);
  }

  const [results] = await pool.query(query, values);
  return results;
};

exports.getEmployeeById = async (id) => {
  const [results] = await pool.query(`
    SELECT 
      service_type, customer_name, Circle, Cluster, City, Domain, employee_id, 
      Aadhar_No, PPRJ_Code, Employee_Name, Job_Category, Job_Role, EMP_Contact_Number,
      DATE_FORMAT(DOJ, '%Y-%m-%d') AS DOJ, Active_Status, 
      DATE_FORMAT(Date_of_leaving, '%Y-%m-%d') AS Date_of_leaving, 
      COALESCE(CTC, 0) AS CTC, COALESCE(Conveyance, 0) AS Conveyance, 
      COALESCE(Allowance1, 0) AS Allowance1, COALESCE(Allowance2, 0) AS Allowance2, 
      COALESCE(TCTC, 0) AS TCTC, Reporting_Manager1, Reporting_Manager2, Ref_emp_id
    FROM emp_table
    WHERE employee_id = ?
  `, [id]);
  return results[0];
};

exports.addEmployee = async (data) => {
  const query = `
    INSERT INTO emp_table (
      service_type, customer_name, Circle, Cluster, City, Domain, employee_id, 
      Aadhar_No, Employee_Name, Job_Category, Job_Role, EMP_Contact_Number, DOJ, 
      Active_Status, Date_of_leaving, CTC, Conveyance, Allowance1, Allowance2, TCTC, 
      Reporting_Manager1, Reporting_Manager2, Ref_emp_id
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.serviceType, data.customerName, data.circle, data.cluster, data.city, data.domain, data.employeeId,
    data.aadharNo, data.employeeName, data.jobCategory, data.jobRole, data.empContactNumber,
    data.dateOfJoining, data.activeStatus, data.dateOfLeaving || null,
    data.ctc, data.conveyance, data.allowance1, data.allowance2, data.tctc,
    data.reportingManager1, data.reportingManager2, data.refEmpId
  ];
  const [result] = await pool.execute(query, values);
  return result;
};

exports.updateEmployee = async (id, data) => {
  const fields = Object.keys(data)
    .filter(key => key !== 'employee_id')
    .map(key => `${key} = ?`)
    .join(', ');

  const values = Object.values(data).filter((_, index) => Object.keys(data)[index] !== 'employee_id');
  values.push(id);

  const [result] = await pool.query(`UPDATE emp_table SET ${fields} WHERE employee_id = ?`, values);
  return result;
};
