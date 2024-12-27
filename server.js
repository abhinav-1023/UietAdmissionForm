import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

const path = require('path');
app.use('/favicon.ico', express.static(path.join(__dirname, 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://uiet-admission-form.vercel.app' }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

const upload = multer({ storage });



// Database Connection
mongoose.connect('mongodb+srv://Abhinav:qprovers13@cluster0.omb8n.mongodb.net/admission_form?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// Define Mongoose Schema
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
    physics_marks: Number,
    chemistry_marks: Number,
    maths_marks: Number,
    jee_score: Number,
    cuet_score: Number,
    category: String,
    submitted_at: { type: Date, default: Date.now }
});

const Admission = mongoose.model('Admission', admissionSchema);

// Multer Configuration for File Uploads
const upload = multer({ dest: 'uploads/' });

// Handle Form Submission
app.post('/submit-admission', upload.fields([{ name: 'photo' }, { name: 'receipt' }]), async (req, res) => {
    try {
        console.log('Form Data:', req.body);
        console.log('Files:', req.files);

        // Create admission document
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
            submitted_at: Date.now(),
        });

        // Save to database
        await admission.save();
        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error during form submission:', error);
        res.status(500).json({ message: 'Error saving data', error: error.message });
    }
});


// Basic GET Route for Testing
app.get('/', (req, res) => {
    res.send("Hello, World!");
});

// Start Server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

