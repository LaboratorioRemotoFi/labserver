import React from "react";
import { io } from "socket.io-client";

function useSocket() {
  const [socket, setSocket] = React.useState(null);
  const [isConnected, setIsConnected] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const [metadata, setMetadata] = React.useState(null);
  const [practiceStatus, setPracticeStatus] = React.useState("");
  const [sensorsData, setSensorsData] = React.useState({});
  const [actuatorsStatus, setActuatorsStatus] = React.useState({});

  function connect(serverIp, user, password) {
    if (socket) {
      socket.close();
    }

    const newSocket = io(serverIp);
    setErrorMessage("");

    newSocket.on("connect", () => {
      console.log("socket on connect");

      setIsConnected(true);
      newSocket.emit("setup", { user, password });
    });

    newSocket.io.on("reconnect", () => {
      console.log("socket on reconnect");
    });

    newSocket.on("disconnect", () => {
      console.log("socket on disconnect");
      setIsConnected(false);
    });

    newSocket.on("setup", (data) => {
      if (data.status === "success") {
        setMetadata(data.data);
        setIsConnected(true);
      } else if (data.status === "error") {
        setErrorMessage(data.message);
      }
    });

    newSocket.on("updatePracticeData", (practiceData) => {
      setPracticeStatus(practiceData.status);
      setSensorsData(practiceData.sensors);
      setActuatorsStatus(practiceData.actuators);
    });

    newSocket.on("message", ({ status, message }) => {
      if (status === "error") {
        setErrorMessage(message);
      } else if (status === "success") {
        setErrorMessage("");
      }
    });

    setSocket(newSocket);
  }

  return {
    socket,
    isConnected,
    metadata,
    connect,
    errorMessage,
    practiceStatus,
    sensorsData,
    actuatorsStatus,
  };
}

export default useSocket;
