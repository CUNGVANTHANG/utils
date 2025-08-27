import { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

function App() {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (
      Notification.permission === "default" ||
      Notification.permission === "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    }
    socket.on("pushNotification", (data) => {
      console.log(data);
      if (Notification.permission === "granted") {
        new Notification("New Notification", {
          body: data.message,
          icon: "https://via.placeholder.com/50",
        });
      }
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("pushNotification");
    };
  }, []);

  return (
    <div className="App">
      <h1>Push Notification</h1>
      {notifications &&
        notifications.map((note, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>{note.message}</p>
          </div>
        ))}
    </div>
  );
}

export default App;
