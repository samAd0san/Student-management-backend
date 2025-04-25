const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const marksRoutes = require('./routes/marksRoutes');
const InternalMarks = require('./routes/internalMarksRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attainmentRoutes = require('./routes/attainmentRoutes');
const feedbackAttainmentRoutes = require('./routes/feedbackAttainmentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000 || process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the root URL of the server');
});

app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/internalMarks', InternalMarks);
app.use('/api/co', courseRoutes);
app.use('/api/attainment', attainmentRoutes);
app.use('/api/feedbackattainment', feedbackAttainmentRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, (err) => {
    if (!err) {
        console.log(`Server is running on http://localhost:${PORT}`);
    } else {
        console.log('Error occurred: server cannot connect', err);
    }
});

// Connect to the database
connectDB();