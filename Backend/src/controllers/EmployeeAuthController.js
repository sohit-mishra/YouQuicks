const bcrypt = require("bcryptjs");
const Employee = require("@/models/Employee");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("@/config/env");
const { SendForgotPasswordEmail, sendEmailOtp } = require("@/utils/Email");


const generateUniqueEmployeeId = async () => {
  let unique = false;
  let employeeId;

  while (!unique) {
    employeeId = Math.floor(10000000 + Math.random() * 90000000).toString();
    const existing = await Employee.findOne({ employeeId });
    if (!existing) unique = true;
  }

  return employeeId;
};

const createAccount = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      department,
      jobTitle,
      hireDate,
      salary,
      isActive,
      password,
      address,
      contactNumber,
      emergencyContact,
      aadharNumber,
      panNumber,
      profilePicture,
      bankDetails,
    } = req.body;

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee already exists with this email." });
    }

    const employeeId = await generateUniqueEmployeeId();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      firstName,
      lastName,
      email,
      password : hashedPassword,
      employeeId,
      department,
      jobTitle,
      hireDate,
      salary,
      isActive,
      address,
      contactNumber,
      emergencyContact,
      aadharNumber,
      panNumber,
      profilePicture,
      bankDetails,
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.status) {
      return res.status(401).json({ message: "Access denied: Employee has resigned" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: employee._id, role: "EMPLOYEE" },
      config.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      employee,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; 

    employee.resetPasswordToken = resetToken;
    employee.resetPasswordExpire = resetTokenExpire;
    await employee.save();

    const link = config.FRONTED_URL + `/employee/resetpassword/${resetToken}`;
    console.log(link);

    await SendForgotPasswordEmail(employee.email, link);

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword ,token} = req.body;

    const employee = await Employee.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!employee) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    employee.password = await bcrypt.hash(newPassword, 10);
    employee.resetPasswordToken = undefined;
    employee.resetPasswordExpire = undefined;
    await employee.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const deletedEmployee = await Employee.findOneAndDelete({ employeeId });
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  deleteAccount,
};
