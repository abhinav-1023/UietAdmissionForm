import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';

// Create an Express app
const app = express();

// Middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Save uploaded files to the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
    },
});
const upload = multer({ storage });

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority'; // Replace with your credentials

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for the form submissions
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
    submitted_at: { type: Date, default: Date.now },
});

// Create a Mongoose model
const Admission = mongoose.model('Admission', admissionSchema);

// API route to handle form submissions
app.post('/submit-admission', upload.fields([{ name: 'photo' }, { name: 'receipt' }]), async (req, res) => {
    try {
        // Save form data to MongoDB
        const admission = new Admission({
            name: req.body.name,
            father_name: req.body['father-name'],
            mother_name: req.body['mother-name'],
            dob: req.body.dob,
            phone: req.body.phone,
            emergency_contact: req.body['emergency-contact'],
            address: req.body.address,
            course: req.body.course,
            branch: req.body.branch,
            board10: req.body.board10,
            marks10: req.body.marks10,
            board12: req.body.board12,
            marks12: req.body.marks12,
            jee_score: req.body['jee-score'],
            cuet_score: req.body['cuet-score'],
            category: req.body.category,
        });
        await admission.save();
        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Error saving data', error: error.message });
    }
});

// Export the app for Vercel serverless function
export default app;
