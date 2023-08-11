const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json'); // Replace with the path to your service account key file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://node-jq-default-rtdb.firebaseio.com/' // Replace with your Firebase project's database URL
});

// Create a reference to the Firebase Realtime Database
const db = admin.database();
const jobsRef = db.ref('jobs');

// Define a route for searching jobs by title
router.get('/', (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: 'Title parameter is required for job search.' });
  }

  jobsRef.orderByChild('title')
    .equalTo(title)
    .once('value')
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
      console.error('Error searching jobs:', error);
      res.status(500).json({ message: 'An error occurred while searching for jobs.' });
    });
});

module.exports = router;

