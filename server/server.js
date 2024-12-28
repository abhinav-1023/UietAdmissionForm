import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
  {
  origin:["https://uiet-admission-form-api.vercel.app"],
  method:["POST","GET"],
  credentials:true
  }
));
app.use("/uploads", express.static("uploads")); // Serve static files

// Database Connection
mongoose.connect(
    "mongodb+srv://Abhinav:qprovers13@cluster0.omb8n.mongodb.net/admission_form?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Schema
const admissionSchema = new mongoose.Schema({
  name: String,
  father_name: String,
  mother_name: String,
  dob: Date,
  phone: String,
  emergency_contact: String,
  address: String,
  course: String,
  branch: String,
  board10: String,
  marks10: Number,
  board12: String,
  marks12: Number,
  jee_score: Number,
  cuet_score: Number,
  category: String,
  photo: String,
  fee_receipt: String,
  submitted_at: { type: Date, default: Date.now },
});

const Admission = mongoose.model("Admission", admissionSchema);

// Form Submission Route
app.post(
  "/submit-admission",
  upload.fields([{ name: "photo" }, { name: "receipt" }]),
  async (req, res) => {
    try {
      console.log("Request Body:", req.body); // Debug request body
      console.log("Uploaded Files:", req.files); // Debug uploaded files

      const formData = req.body;
      const photo = req.files["photo"] ? req.files["photo"][0].path : "";
      const feeReceipt = req.files["receipt"]
        ? req.files["receipt"][0].path
        : "";

      console.log("Photo Path:", photo); // Debug photo path
      console.log("Fee Receipt Path:", feeReceipt); // Debug receipt path

      const admission = new Admission({
        name: formData.name,
        father_name: formData["father-name"],
        mother_name: formData["mother-name"],
        dob: formData.dob,
        phone: formData.phone,
        emergency_contact: formData["emergency-contact"],
        address: formData.address,
        course: formData.course,
        branch: formData.branch,
        board10: formData.board10,
        marks10: formData.marks10,
        board12: formData.board12,
        marks12: formData.marks12,
        jee_score: formData["jee-score"],
        cuet_score: formData["cuet-score"],
        category: formData.category,
        photo: photo, // Save photo path
        fee_receipt: feeReceipt, // Save receipt path
      });

      await admission.save();
      res.json({ message: "Form submitted successfully!" });
    } catch (error) {
      console.error("Error saving data:", error); // Log error
      res.status(500).json({ message: "Error saving data", error: error.message });
    }
  }
);

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully!");
});

// Export the app for Vercel
module.exports = app;

