// /models/mnprModel.js
const pool = require('../config/db');

exports.getMnprData = async (circle) => {
  let query = `
    SELECT 
      mnpr_id, service_type, customer_name, Circle, Cluster, City, 
      Domain, MNPR_code, DATE_FORMAT(DOJ, '%Y-%m-%d') AS DOJ,
      DATE_FORMAT(Date_of_leaving, '%Y-%m-%d') AS Date_of_leaving, 
      Active_Status, Reporting_Manager1, Reporting_Manager2, Ref_mnpr_id
    FROM mnpr_table
  `;

  const values = [];
  if (circle) {
    query += " WHERE Circle = ?";
    values.push(circle);
  }

  const [results] = await pool.query(query, values);
  return results;
};

exports.getMnprById = async (mnprId) => {
  const [results] = await pool.query(`
    SELECT 
      mnpr_id, service_type, customer_name, Circle, Cluster, City, 
      Domain, MNPR_code, DATE_FORMAT(DOJ, '%Y-%m-%d') AS DOJ,
      DATE_FORMAT(Date_of_leaving, '%Y-%m-%d') AS Date_of_leaving, 
      Active_Status, Reporting_Manager1, Reporting_Manager2, Ref_mnpr_id
    FROM mnpr_table
    WHERE mnpr_id = ?
  `, [mnprId]);

  return results[0];
};

exports.addMnpr = async (data) => {
  const query = `
    INSERT INTO mnpr_table (
      service_type, customer_name, Circle, Cluster, City, Domain, 
      MNPR_code, DOJ, Active_Status, Date_of_leaving, 
      Reporting_Manager1, Reporting_Manager2, Ref_mnpr_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.serviceType, data.customerName, data.circle, data.cluster, data.city, data.domain,
    data.mnprCode, data.dateOfJoining, data.activeStatus, data.dateOfLeaving || null,
    data.reportingManager1, data.reportingManager2, data.refMnprId
  ];

  const [result] = await pool.execute(query, values);
  return result;
};

exports.updateMnpr = async (mnprId, data) => {
  const fields = Object.keys(data)
    .filter(key => key !== 'mnpr_id')
    .map(key => `${key} = ?`)
    .join(', ');

  const values = Object.values(data).filter((_, index) => Object.keys(data)[index] !== 'mnpr_id');
  values.push(mnprId);

  const [result] = await pool.query(`UPDATE mnpr_table SET ${fields} WHERE mnpr_id = ?`, values);
  return result;
};
