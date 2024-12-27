import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// Handle Form Submission
app.post('/submit-admission', upload.fields([{ name: 'photo' }, { name: 'fee-receipt' }]), async (req, res) => {
    try {
        const formData = req.body;
        const photo = req.files['photo'] ? req.files['photo'][0].path : '';
        const feeReceipt = req.files['fee-receipt'] ? req.files['fee-receipt'][0].path : '';

        const admission = new Admission({
            name: formData.name,
            father_name: formData['father-name'],
            mother_name: formData['mother-name'],
            dob: formData.dob,
            phone: formData.phone,
            emergency_contact: formData['emergency-contact'],
            address: formData.address,
            course: formData.course,
            branch: formData.branch,
            board10: formData.board10,
            marks10: formData.marks10,
            board12: formData.board12,
            marks12: formData.marks12,
            physics_marks: formData['physics-marks'],
            chemistry_marks: formData['chemistry-marks'],
            maths_marks: formData['maths-marks'],
            jee_score: formData['jee-score'],
            cuet_score: formData['cuet-score'],
            category: formData.category,
            fee_receipt: feeReceipt,
            photo: photo
        });

        await admission.save();
        res.json({ message: 'Form submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error: error.message });
    }
});


// Basic GET Route for Testing
app.get('/', (req, res) => {
    res.send("Hello, World!");
});

// Start Server After Successful DB Connection
mongoose.connection.once('open', () => {
    app.listen(3000, () => {
        console.log('Server started on http://localhost:3000');
    });
});
