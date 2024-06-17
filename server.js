const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
const TriggerPipelineJob = require('./server/pipeline-jobs.js');

const app = express();
const storageCache = new NodeCache({
  checkperiod: 1,
  deleteOnExpire: true
});
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello' });
});

app.get('/api/trigger-pipeline/job', (req, res) => {
  try {
    const jobs = TriggerPipelineJob.ListJob(storageCache);
    return res.status(200).json(jobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.post('/api/trigger-pipeline/job', (req, res) => {
  try {
    const job = TriggerPipelineJob.CreateJob(req.body, storageCache);
    return res.status(200).json(job);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.delete('/api/trigger-pipeline/job/:id', (req, res) => {
  try {
    TriggerPipelineJob.RemoveJob(req.params.id, storageCache);
    return res.status(200).json(true);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
