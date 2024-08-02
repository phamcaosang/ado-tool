const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');
const TriggerPipelineJob = require('./dist/server/pipeline-jobs.js');

const app = express();
const storageCache = new NodeCache({
  checkperiod: 1,
  deleteOnExpire: true
});

storageCache.on("expired", function(key, value){
  console.log("expired", key, value)
  TriggerPipelineJob.CustomCronJob.removeInterval(key);
});
const port = TriggerPipelineJob.CONFIGS.bePort;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.status(200).json({ message: 'Hello' });
});

app.get(TriggerPipelineJob.CONFIGS.paths.getJobs, (req, res) => {
  try {
    const jobs = TriggerPipelineJob.ListJob(storageCache);
    return res.status(200).json(jobs);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.post(TriggerPipelineJob.CONFIGS.paths.createJob, (req, res) => {
  try {
    const job = TriggerPipelineJob.CreateJob(req.body, storageCache);
    return res.status(200).json(job);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

app.delete(TriggerPipelineJob.CONFIGS.paths.deleteJob, (req, res) => {
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
