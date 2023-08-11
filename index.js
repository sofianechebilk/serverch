const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();

// Other middleware and configurations
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Import the jobs router
const jobsRouter = require('./routes/jobs');

// Mount the jobs router at the /jobs path
app.use('/jobs', jobsRouter);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
