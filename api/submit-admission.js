const { MongoClient } = require("mongodb");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

// MongoDB connection URI
const uri = 'mongodb+srv://Abhinav:qprovers13@cluster0.omb8n.mongodb.net/admission_form?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    // Configure formidable for file uploads
    form.uploadDir = path.join(process.cwd(), "/uploads");
    form.keepExtensions = true;

    // Parse the incoming form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        res.status(500).json({ message: "Form parsing error", error: err.message });
        return;
      }

      try {
        // Ensure MongoDB client is connected
        if (!client.isConnected()) await client.connect();
        const db = client.db("admissions");
        const collection = db.collection("applications");

        // Prepare the document to insert
        const document = {
          ...fields, // Include form fields
          photo: files.photo ? files.photo.newFilename : null, // Save photo filename
          receipt: files.receipt ? files.receipt.newFilename : null, // Save receipt filename
          submittedAt: new Date(),
        };

        // Save the data in MongoDB
        const result = await collection.insertOne(document);

        res.status(200).json({ message: "Form submitted successfully", id: result.insertedId });
      } catch (error) {
        console.error("Error saving to MongoDB:", error);
        res.status(500).json({ message: "Database error", error: error.message });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser for file uploads
  },
};
