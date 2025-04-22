
// ✅ API to get all employees
app.get("/api/employee", async (req, res) => {
  try {
    const { circle } = req.query; // Get the region from frontend request

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

    // If circle is provided, add WHERE condition
    if (circle) {
      query += " WHERE Circle = ?";
      values.push(circle);
    }

    const [results] = await pool.query(query, values);

    res.status(200).json({ success: true, empData: results });
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
});


// ✅ API to get employee by ID
app.get("/api/employee/:id", async (req, res) => {
  const employeeId = req.params.id;
  try {
    const [results] = await pool.query(`
      SELECT 
        service_type, customer_name, Circle, Cluster, City, Domain, employee_id, 
        Aadhar_No, PPRJ_Code, Employee_Name, Job_Category, Job_Role, EMP_Contact_Number,
        DATE_FORMAT(DOJ, '%Y-%m-%d') AS DOJ, Active_Status, 
        DATE_FORMAT(Date_of_leaving, '%Y-%m-%d') AS Date_of_leaving, 
        COALESCE(CTC, 0) AS CTC, COALESCE(Conveyance, 0) AS Conveyance, 
        COALESCE(Allowance1, 0) AS Allowance1, COALESCE(Allowance2, 0) AS Allowance2, 
        COALESCE(TCTC, 0) AS TCTC, Reporting_Manager1, Reporting_Manager2, Ref_emp_id
      FROM emp_table WHERE employee_id = ?
    `, [employeeId]);

    if (results.length > 0) {
      res.status(200).json({ success: true, empData: results[0] });
    } else {
      res.status(404).json({ success: false, message: "Employee not found" });
    }
  } catch (error) {
    console.error("❌ Database Query Error:", error);
    res.status(500).json({ success: false, message: "Database query failed", error });
  }
});

// ✅ API to add a new employee
app.post("/api/employee", async (req, res) => {
  try {
    const {
      serviceType, customerName, circle, cluster, city, domain, employeeId, aadharNo, employeeName, 
      jobCategory, jobRole, empContactNumber, dateOfJoining, activeStatus, dateOfLeaving, ctc, 
      conveyance, allowance1, allowance2, tctc, reportingManager1, reportingManager2, refEmpId
    } = req.body;

    let errors = {};

    // 🔹 Frontend-Level Validations
    if (!serviceType) errors.serviceType = "Service type is required!";
    if (!customerName) errors.customerName = "Customer name is required!";
    if (!employeeId) errors.employeeId = "Employee ID is required!";
    if (!/^\d+$/.test(employeeId)) errors.employeeId = "Employee ID must be a number!";
    if (!aadharNo || !/^\d{12}$/.test(aadharNo)) errors.aadharNo = "Aadhar No must be 12 digits!";
    if (!empContactNumber || !/^\d{10}$/.test(empContactNumber)) errors.empContactNumber = "Contact Number must be 10 digits!";
    if (!dateOfJoining) errors.dateOfJoining = "Joining date is required!";
    if (dateOfLeaving && new Date(dateOfLeaving) < new Date(dateOfJoining)) {
      errors.dateOfLeaving = "Date of leaving cannot be before joining date!";
    }

    // 🔹 Return frontend validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // 🔹 SQL Insert Query
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
      serviceType, customerName, circle, cluster, city, domain, employeeId, aadharNo, 
      employeeName, jobCategory, jobRole, empContactNumber, dateOfJoining, activeStatus, 
      dateOfLeaving || null, ctc, conveyance, allowance1, allowance2, tctc, 
      reportingManager1, reportingManager2, refEmpId
    ];

    // 🔹 Execute Query
    const [result] = await pool.execute(query, values);

    res.status(201).json({ success: true, message: "Employee added successfully!", employeeId: result.insertId });

  } catch (error) {
    console.error("❌ Error adding employee:", error.message);

    // 🔹 Handle MySQL Errors
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ success: false, errors: { employeeId: "Employee ID already exists!" } });
    }
    if (error.code === "ER_TRUNCATED_WRONG_VALUE") {
      return res.status(400).json({ success: false, errors: { employeeId: "Invalid Employee ID format!" } });
    }

    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
});



// ✅ API to update an employee
app.put("/api/employee/:id", async (req, res) => {
  const employeeId = req.params.id;
  const updatedData = req.body;

  try {
    if (!Object.keys(updatedData).length) {
      return res.status(400).json({ success: false, message: "No fields to update provided." });
    }

    // Create dynamic SET query
    const fieldsToUpdate = Object.keys(updatedData)
      .filter((key) => key !== "employee_id") // Prevent updating the primary key
      .map((key) => `${key} = ?`)
      .join(", ");

    const values = Object.values(updatedData).filter((_, index) => Object.keys(updatedData)[index] !== "employee_id");

    const query = `UPDATE emp_table SET ${fieldsToUpdate} WHERE employee_id = ?`;
    values.push(employeeId); // Add employee_id at the end for WHERE clause

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Employee not found or no changes made." });
    }

    res.json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ success: false, message: "Error updating employee", error });
  }
});

// ✅ API to register a new user
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword]
    );

    res.status(201).json({ success: true, message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ success: false, message: "Registration failed", error });
  }
});

// ✅ API to login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from database
    const [users] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const user = users[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "Login failed", error });
  }
});

app.get("/api/employee", async (req, res) => {
    try {
      let query = {};
  
      // Dynamically add filters
      Object.keys(req.query).forEach((key) => {
        if (req.query[key]) {
          query[key] = { $regex: new RegExp(req.query[key], "i") }; // Case-insensitive search
        }
      });
  
      const employees = await EmployeeModel.find(query);
      res.json({ success: true, empData: employees });
    } catch (error) {
      res.json({ success: false, message: "Error fetching employees" });
    }
  });