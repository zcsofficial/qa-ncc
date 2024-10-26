const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json()); // Middleware for parsing JSON bodies

// MongoDB connection
mongoose.connect('mongodb+srv://adnankstheredteamlabs:Adnan%4066202@cluster0.qrppz7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Cadet Schema
const cadetSchema = new mongoose.Schema({
    cadetID: { type: String, required: true, unique: true },
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
            cadetID: { type: String, required: true },
            isPresent: { type: Boolean, required: true }
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
        console.error('Error retrieving cadet data:', error);
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
        console.error('Error saving attendance:', error);
        res.status(500).send('Error saving attendance');
    }
});

// Endpoint to get all attendance events
app.get('/api/events', async (req, res) => {
    try {
        const events = await Attendance.find();
        res.json(events);
    } catch (error) {
        console.error('Error retrieving events:', error);
        res.status(500).send('Error retrieving events');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
