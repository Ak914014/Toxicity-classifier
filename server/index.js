const express = require('express');
const app = express();
const tf = require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const cors = require('cors');
require('@tensorflow/tfjs-node'); 

const threshold = 0.9;
let model;

toxicity.load(threshold).then((loadedModel) => {
  model = loadedModel;
  console.log('Model loaded');
}).catch(err => {
  console.error('Failed to load model', err);
});

app.use(express.json());
app.use(cors());
app.post('/classify', async (req, res) => {
  const sentences = req.body.sentences;
  console.log('Received request to classify sentences:', sentences);
  if (!model) {
    return res.status(500).send('Model not loaded yet');
  }
  try {
    const predictions = await model.classify(sentences);
    console.log('Predictions:', predictions);
    res.json(predictions);
  } catch (err) {
    console.error('Error classifying sentences:', err);
    res.status(500).send(err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
