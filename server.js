const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('your-mongo-db-uri', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Cadet Schema
const cadetSchema = new mongoose.Schema({
    cadetID: { type: String, required: true },
    name: { type: String, required: true },
    rank: { type: String, required: true },
    year: { type: Number, required: true }
});
const Cadet = mongoose.model('Cadet', cadetSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    attendanceData: [
        {
            cadetID: String,
            isPresent: Boolean
        }
    ]
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Endpoint to fetch all cadets
app.get('/api/cadets', async (req, res) => {
    try {
        const cadets = await Cadet.find();
        res.json(cadets);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving cadet data');
    }
});

// Endpoint to save attendance
app.post('/api/attendance', async (req, res) => {
    const { eventName, attendanceData } = req.body;
    try {
        const attendance = new Attendance({ eventName, attendanceData });
        await attendance.save();
        res.status(201).send('Attendance recorded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving attendance');
    }
});

// Endpoint to get all attendance events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Attendance.find();
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving events');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
