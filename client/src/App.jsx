import React, { useState } from "react";
import axios from "axios";

/**
 * App component that handles text input, sends it to a server for toxicity classification, and displays the results.
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function App() {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [history, setHistory] = useState([]);

  /**
   * Sends the input text to the server for classification and updates the history with the result.
   * @async
   * @function
   */
  const handleClassify = async () => {
    try {
      console.log("Sending input to server:", input);
      const response = await axios.post("http://localhost:5000/classify", {
        sentences: [input],
      });
      console.log("Received predictions:", response.data);
      setPredictions(response.data);
      setHistory([{ input, predictions: response.data }, ...history]);
    } catch (error) {
      console.error("Error classifying text:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Toxicity Classifier</h1>
      <input
        className="p-2 border border-gray-300 rounded w-1/2 mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-green-500 hover:bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleClassify}
      >
        Classify
      </button>
      
      <div className="mt-4 w-3/4">
        <h2 className="text-2xl font-bold mb-2">Prediction History:</h2>
        <table className="w-full bg-white border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Input Text</th>
              <th className="p-2 border">Label</th>
              <th className="p-2 border">Prediction</th>
              <th className="p-2 border">Toxicity (%)</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              item.predictions.map((prediction, pIndex) => (
                <tr key={`${index}-${pIndex}`}>
                  {pIndex === 0 && (
                    <td rowSpan={item.predictions.length} className="p-2 text-center border">{item.input}</td>
                  )}
                  <td className="p-2 border text-center">{prediction.label}</td>
                  <td className="p-2 border text-center">
                    {prediction.results[0].match ? "Toxic" : "Not Toxic"}
                  </td>
                  <td className="p-2 border text-center">
                    {(prediction.results[0].probabilities[1] * 100).toFixed(2)}%
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}

export default App;
