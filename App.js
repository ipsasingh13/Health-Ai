import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [metrics, setMetrics] = useState([]);
  const [formData, setFormData] = useState({ weight: '', height: '', calories: '' });

  // Fetch past data from Backend
  useEffect(() => {
    fetch('http://localhost:5000/api/metrics')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(newData => {
      setMetrics([newData, ...metrics]);
      setFormData({ weight: '', height: '', calories: '' });
    })
    .catch(err => console.error("Error saving data:", err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>NutriTrack Pro Dashboard</h1>
      </header>
      
      <main className="container">
        <section className="form-section">
          <h2>Log Your Daily Metrics</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Weight (kg):</label>
              <input 
                type="number" 
                value={formData.weight} 
                onChange={(e) => setFormData({...formData, weight: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Height (cm):</label>
              <input 
                type="number" 
                value={formData.height} 
                onChange={(e) => setFormData({...formData, height: e.target.value})} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Calorie Intake (kcal):</label>
              <input 
                type="number" 
                value={formData.calories} 
                onChange={(e) => setFormData({...formData, calories: e.target.value})} 
                required 
              />
            </div>
            <button type="submit">Calculate & Save</button>
          </form>
        </section>

        <section className="history-section">
          <h2>Recent History</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Height</th>
                  <th>BMI</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.weight} kg</td>
                    <td>{item.height} cm</td>
                    <td>{item.bmi}</td>
                    <td>{item.calories} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;