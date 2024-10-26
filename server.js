const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set up Express App
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
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
    year: { type: String, required: true } // Ensure year is included
});

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    attendanceData: [cadetSchema],
    date: { type: Date, default: Date.now }
});

// Models
const Cadet = mongoose.model('Cadet', cadetSchema); // Cadet model
const Event = mongoose.model('Event', eventSchema); // Event model

// Ensure collections exist
const ensureCollections = async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();

    // Check and create cadets collection if it doesn't exist
    if (!collections.find(collection => collection.name === 'cadets')) {
        await mongoose.connection.createCollection('cadets');
        console.log('Cadets collection created');
    }

    // Check and create events collection if it doesn't exist
    if (!collections.find(collection => collection.name === 'events')) {
        await mongoose.connection.createCollection('events');
        console.log('Events collection created');
    }

    // Check and create attendance collection if it doesn't exist
    if (!collections.find(collection => collection.name === 'attendance')) {
        await mongoose.connection.createCollection('attendance');
        console.log('Attendance collection created');
    }
};

// Check collections on startup
ensureCollections().catch(console.error);

// Routes

// Get All Cadets
app.get('/api/cadets', async (req, res) => {
    try {
        const cadets = await Cadet.find(); // Fetch cadets from the database
        res.json(cadets); // Send cadet data as JSON response
    } catch (error) {
        console.error('Error fetching cadets:', error);
        res.status(500).json({ message: 'Error fetching cadets', error });
    }
});

// Create a New Event with Attendance Data
app.post('/api/events', async (req, res) => {
    try {
        const { eventName, attendanceData } = req.body;
        const newEvent = new Event({ eventName, attendanceData });
        await newEvent.save();
        res.status(201).json({ message: 'Attendance data saved successfully' });
    } catch (error) {
        console.error('Error saving attendance data:', error);
        res.status(500).json({ message: 'Error saving attendance data', error });
    }
});

// Submit Attendance
app.post('/api/attendance', async (req, res) => {
    const { eventName, attendanceData } = req.body;

    // Validate input
    if (!eventName || !attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
        return res.status(400).json({ message: 'Invalid input data. Event name and attendance data are required.' });
    }

    try {
        // Create a new event with attendance data
        const newEvent = new Event({
            eventName,
            attendanceData: attendanceData.map(data => ({
                cadetID: data.cadetID,
                name: data.name,
                rank: data.rank,
                year: data.year, // Ensure year is included
                isPresent: data.isPresent,
            }))
        });

        await newEvent.save();
        res.status(201).json({ message: 'Attendance data saved successfully!' });
    } catch (error) {
        console.error('Error saving attendance data:', error);
        res.status(500).json({ message: 'Error saving attendance data', error });
    }
});

// Get All Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Error fetching events', error });
    }
});

// Get a Single Event by ID
app.get('/api/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Error fetching event', error });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
