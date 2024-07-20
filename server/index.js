/**
 * @fileoverview Server for image upload and segmentation using TensorFlow.js and DeepLab models.
 * @requires express
 * @requires cors
 * @requires @tensorflow/tfjs-node
 * @requires @tensorflow-models/toxicity
 * @requires @tensorflow/tfjs
 * @requires ./swagger
 */

const express = require('express');
const app = express();
const tf = require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');
const cors = require('cors');
require('@tensorflow/tfjs-node'); 
const setupSwagger = require('./swagger');

app.use(express.json());
app.use(cors());
setupSwagger(app);

const threshold = 0.9;
let model;

/**
 * Initializes the models.
 * @async
 */
toxicity.load(threshold).then((loadedModel) => {
  model = loadedModel;
  console.log('Model loaded');
}).catch(err => {
  console.error('Failed to load model', err);
});

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image and perform segmentation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               modelName:
 *                 type: string
 *                 enum: [pascal, cityscapes, ade20k]
 *                 default: cityscapes
 *     responses:
 *       200:
 *         description: Segmentation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 segmentationMap:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 height:
 *                   type: integer
 *                 width:
 *                   type: integer
 *                 legend:
 *                   type: object
 *       400:
 *         description: Invalid input or no file uploaded
 *       500:
 *         description: Internal server error
 */

/**
 * POST endpoint to handle sentence classification.
 * @name /classify
 * @function
 * @memberof module:app
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
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

/**
 * GET endpoint for the root URL.
 * @name /
 * @function
 * @memberof module:app
 * @inner
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
app.get("/", (req, res) => {
  res.send("Hello");
});

/**
 * Starts the server.
 * @param {number} port - Port number to listen on.
 */
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
