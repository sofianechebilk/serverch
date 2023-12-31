const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://node-jq-default-rtdb.firebaseio.com/'
});

// Create a reference to the Firebase Realtime Database
const db = admin.database();
const jobsRef = db.ref('jobs');

// Route for creating a new job
router.post('/', (req, res) => {
  const { title, description, location,  email } = req.body;

  // Generate a unique key for the new job
  const newJobRef = jobsRef.push();
  const newJobKey = newJobRef.key;

  // Get the current timestamp
  const timestamp = Date.now();

  // Set the job data including the timestamp and email
  newJobRef.set({
    title,
    description,
    location,
    
    timestamp,
    email
  })
    .then(() => {
      res.status(201).json({ message: 'Job created successfully!', jobId: newJobKey });
    })
    .catch((error) => {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'An error occurred while creating the job.' });
    });
});

// Route for getting all jobs
router.get('/', (req, res) => {
  jobsRef.once('value')
    .then((snapshot) => {
      const jobs = snapshot.val();

      if (jobs) {
        const jobList = Object.keys(jobs).map((key) => ({
          id: key,
          ...jobs[key]
        }));

        res.status(200).json(jobList);
      } else {
        res.status(200).json([]);
      }
    })
    .catch((error) => {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ message: 'An error occurred while retrieving jobs.' });
    });
});


// ...

// Route for getting a single job by postId
router.get('/:postId', (req, res) => {
  const postId = req.params.postId;
  
  // Get the job details for the given postId
  jobsRef.child(postId).once('value')
    .then((snapshot) => {
      const jobDetails = snapshot.val();

      if (jobDetails) {
        res.status(200).json(jobDetails);
      } else {
        res.status(404).json({ message: 'Job not found' });
      }
    })
    .catch((error) => {
      console.error('Error retrieving job:', error);
      res.status(500).json({ message: 'An error occurred while retrieving the job.' });
    });
});

// ...

module.exports = router;
