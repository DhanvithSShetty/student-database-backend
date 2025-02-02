const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();  // This loads the .env file

// Create an Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Student schema definition
const studentSchema = new mongoose.Schema({
  name: String,
  className: String,
  rollNumber: String,
  bloodGroup: String,
});

const Student = mongoose.model('Student', studentSchema);

// Routes for CRUD operations

// Create a new student
app.post('/students', async (req, res) => {
  try {
    const { name, className, rollNumber, bloodGroup } = req.body;
    const newStudent = new Student({ name, className, rollNumber, bloodGroup });
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (err) {
    res.status(500).send({ error: 'Error adding student' });
  }
});

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).send({ error: 'Error fetching students' });
  }
});

// Update a student
app.put('/students/:id', async (req, res) => {
  try {
    const { name, className, rollNumber, bloodGroup } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, {
      name, className, rollNumber, bloodGroup
    }, { new: true });
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).send({ error: 'Error updating student' });
  }
});

// Delete a student
app.delete('/students/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).send({ error: 'Error deleting student' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
