const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    role: {
      type: String,
      default: "EMPLOYEE",
    },
    employeeId: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    department: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "Engineering",
        "Design",
        "Marketing",
        "Content",
        "Support",
        "Sales",
        "Product",
        "Analytics",
        "Media / Creative",
        "Quality Assurance",
      ],
    },
    jobTitle: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "Software Developer",
        "UI/UX Designer",
        "Digital Marketer",
        "Content Writer",
        "SEO Specialist",
        "Customer Support Agent",
        "Sales Executive",
        "Product Manager",
        "Data Analyst",
        "DevOps Engineer",
        "Affiliate Manager",
        "Video Editor",
        "Social Media Manager",
        "QA Tester",
        "Blogger",
        "Web Developer",
      ],
    },
    hireDate: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
      country: { type: String, trim: true },
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    profilePicture: {
      type: String,
    },
    aadharNumber: {
      type: String,
      trim: true,
      required: true,
      match: [/^\d{12}$/, "Aadhar number must be 12 digits"],
    },
    panNumber: {
      type: String,
      trim: true,
      required: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format"],
    },
    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
        required: true,
      },
      accountNumber: {
        type: String,
        trim: true,
        required: true,
        match: [/^\d{9,18}$/, "Account number must be between 9 to 18 digits"],
      },
      ifscCode: {
        type: String,
        trim: true,
        required: true,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"],
      },
      bankName: {
        type: String,
        trim: true,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Employee = new mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
