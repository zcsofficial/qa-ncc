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
    
    // Check and create collections if they don't exist
    const requiredCollections = ['cadets', 'events'];
    for (const collection of requiredCollections) {
        if (!collections.find(c => c.name === collection)) {
            await mongoose.connection.createCollection(collection);
            console.log(`${collection.charAt(0).toUpperCase() + collection.slice(1)} collection created`);
        }
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

// Submit Attendance
app.post('/api/attendance', async (req, res) => {
    const { eventName, attendanceData } = req.body;

    // Validate input
    if (!eventName || !attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
        return res.status(400).json({ message: 'Invalid input data. Event name and attendance data are required.' });
    }

    try {
        const newEvent = new Event({
            eventName,
            attendanceData: attendanceData.map(data => ({
                cadetID: data.cadetID,
                name: data.name,
                rank: data.rank,
                year: data.year, // Include year
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

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
