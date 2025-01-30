import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "https://dvv880zp-5000.inc1.devtunnels.ms"; // Use the tunnel URL

function App() {
  const [name, setName] = useState("");
  const [assignedCard, setAssignedCard] = useState(null);
  const [assignedList, setAssignedList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssignedCards();
  }, []);

  const fetchAssignedCards = async () => {
    try {
      const response = await axios.get(`${API_URL}/assigned-cards`);
      setAssignedList(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_URL}/assign-card`, { name });
      setAssignedCard(response.data);
      fetchAssignedCards();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <h1>Card Selection Game</h1>

      {!assignedCard ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Get Card</button>
        </form>
      ) : (
        <div>
          <h2>Congratulations, {assignedCard.name}!</h2>
          <p>
            Your assigned number is: <strong>{assignedCard.number}</strong>
          </p>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <h2>Assigned Cards</h2>
      <ul className="assigned-list">
        {assignedList.map((entry, index) => (
          <li key={index}>
            {entry.name} - Card {entry.number}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
