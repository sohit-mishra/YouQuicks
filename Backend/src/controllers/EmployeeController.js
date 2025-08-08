const Employee = require("@/models/Employee");
const bcrypt = require("bcryptjs");
const cloudinary = require("@/config/cloudinary");

const AllEmployee = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employees." });
  }
};

const GetEmployeeId = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ error: "Employee not found." });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch employee." });
  }
};

const Search = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await Employee.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { jobTitle: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Search failed." });
  }
};

const ProfileEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id);
    if (!employee)
      return res.status(404).json({ error: "Employee not found." });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

const UpddateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Employee not found." });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update employee." });
  }
};

const UpddateStatusEmployee = async (req, res) => {
  try {
    const { isActive } = req.body;

    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Employee not found." });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status." });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee)
      return res.status(404).json({ error: "Employee not found." });

    if (!employee.isActive) {
      return res
        .status(400)
        .json({ error: "Cannot delete active employee. Must resign first." });
    }

    await Employee.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete employee." });
  }
};

const ProfileDetailEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id);

    if (!employee)
      return res.status(404).json({ error: "Employee not found." });

    const formattedData = {
      _id: employee._id,
      name: employee.firstName + " " + employee.lastName,
      email: employee.email,
      employeeId: employee.employeeId,
      department: employee.department,
      jobTitle: employee.jobTitle,
      address: employee.address,
      contactNumber: employee.contactNumber,
      emergencyContact: employee.emergencyContact,
      profilePicture: employee.profilePicture,
    };
    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

const UpddatePasswordEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    employee.password = hashedPassword;
    await employee.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch {
    res.status(500).json({ message: "Server error while updating password." });
  }
};

const uploadImageEmployee = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(401).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "employee_avatar",
      width: 300,
      height: 300,
      crop: "fill",
    });

    const employee = await Employee.findById(req.user.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.profilePicture = result.secure_url;
    await employee.save();

    res.status(200).json({
      message: "Image Upload successfully",
      result,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};
module.exports = {
  AllEmployee,
  GetEmployeeId,
  Search,
  ProfileEmployee,
  UpddateEmployee,
  UpddateStatusEmployee,
  deleteEmployee,
  ProfileDetailEmployee,
  UpddatePasswordEmployee,
  uploadImageEmployee,
};
