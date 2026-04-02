import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function App() {
  const [data, setData] = useState<any>(null);
  const userId = "user123";

  // Fetch data
  const fetchData = async () => {
    const res = await axios.get(`http://localhost:5000/stats/${userId}`);
    setData(res.data);
  };

  // Send activity
  const sendActivity = async (type: string) => {
    await axios.post("http://localhost:5000/track", {
      userId,
      type
    });
    fetchData();
  };

  // Reset
  const resetData = async () => {
    await axios.post("http://localhost:5000/reset");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );

  // Chart
  const chartData = {
    labels: data.activities.map((_: any, i: number) => i + 1),
    datasets: [
      {
        label: "Activity Growth",
        data: data.activities.map((_: any, i: number) => i + 1),
        borderColor: "#38bdf8"
      }
    ]
  };

  // Accuracy
  const accuracy = data.totalActivities
    ? Math.round((data.totalPoints / (data.totalActivities * 20)) * 100)
    : 0;

  // Motivational message
  const getMessage = () => {
    if (data.totalPoints < 50)
      return "🚀 Start engaging more to earn points!";
    if (data.totalPoints < 150)
      return "🔥 Good progress! Keep pushing!";
    return "🏆 Excellent work! You're a top performer!";
  };

  // Badges
  const badges: string[] = [];
  if (data.totalPoints > 50) badges.push("Beginner 🟢");
  if (data.totalPoints > 100) badges.push("Intermediate 🔵");
  if (data.totalPoints > 200) badges.push("Pro 🏆");

  // Quiz count
  const quizCount = data.activities.filter(
    (a: any) => a.type === "quiz"
  ).length;

  // Styles
  const btn = {
    margin: "5px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer"
  };

  const card = {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.3)"
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "20px"
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#0f172a",
        color: "white",
        minHeight: "100vh"
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        DDD Student Dashboard 🚀
      </h1>

      {/* Buttons */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => sendActivity("video")} style={btn}>
          Video
        </button>
        <button onClick={() => sendActivity("quiz")} style={btn}>
          Quiz
        </button>
        <button onClick={() => sendActivity("review")} style={btn}>
          Review
        </button>
        <button
          onClick={resetData}
          style={{ ...btn, background: "#dc2626" }}
        >
          Reset
        </button>
      </div>

      {/* Grid Cards */}
      <div style={grid}>
        {/* Performance */}
        <div style={card}>
          <h2>Performance</h2>
          <p>Total Activities: {data.totalActivities}</p>
          <p>Total Points: {data.totalPoints}</p>
          <p>Accuracy: {accuracy}%</p>
        </div>

        {/* Achievements */}
        <div style={card}>
          <h2>Achievements</h2>
          {badges.length === 0 ? (
            <p>No badges yet</p>
          ) : (
            badges.map((b, i) => <p key={i}>{b}</p>)
          )}
        </div>

        {/* Interaction */}
        <div style={card}>
          <h2>Interaction</h2>
          <p>Quiz Attempts: {quizCount}</p>
        </div>

        {/* Session */}
        <div style={card}>
          <h2>Session</h2>
          <p>Activity: {data.totalActivities}</p>
          <p>Points: {data.totalPoints}</p>
        </div>
      </div>

      {/* Insight */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3 style={{ color: "#facc15" }}>{getMessage()}</h3>
      </div>

      {/* Chart */}
      <div style={{ width: "600px", margin: "30px auto" }}>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;