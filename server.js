// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set up Express App
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection (Make sure to replace with your actual MongoDB URI)
const mongoURI = 'mongodb+srv://adnankstheredteamlabs:Adnan%4066202@cluster0.qrppz7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(error => console.error('Error connecting to MongoDB:', error));

// Mongoose Schema and Models
const cadetSchema = new mongoose.Schema({
    cadetID: { type: String, required: true },
    name: { type: String, required: true },
    rank: { type: String, required: true },
    isPresent: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    attendanceData: [cadetSchema],
    date: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);
const Cadet = mongoose.model('Cadet', cadetSchema); // Cadet model for fetching data

// Routes

// Create a New Event with Attendance Data
app.post('/api/events', async (req, res) => {
    try {
        const { eventName, attendanceData } = req.body;
        const newEvent = new Event({ eventName, attendanceData });
        await newEvent.save();
        res.status(201).json({ message: 'Attendance data saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving attendance data', error });
    }
});

// Get All Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error });
    }
});

// Get All Cadets
app.get('/api/cadets', async (req, res) => {
    try {
        const cadets = await Cadet.find();
        res.json(cadets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cadets', error });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
