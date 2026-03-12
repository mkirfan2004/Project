import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setMessage(res.data.message);
      } catch (err) {
        setMessage("Access denied", err);
      }
    };

    fetchProfile();

  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>{message}</p>
    </div>
  );
}

export default Dashboard;