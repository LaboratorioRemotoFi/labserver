import Practice from "./example-practice.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import yaml from "js-yaml";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const practice = new Practice();
practice.init();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const STATUS = {
  WAITING: "WAITING",
  CONNECTED: "CONNECTED",
};

let currentStatus = STATUS.WAITING;

io.on("connection", async (socket) => {
  console.log("new socket connection");

  const connections = await io.fetchSockets();
  if (connections.length > 1) {
    console.log(
      "connection rejected: can't have more than one connection at the same time"
    );
    socket.emit("setup", {
      status: "error",
      message: "No se puede tener más de una conexión al mismo tiempo",
    });
    socket.disconnect();
  }

  setInterval(() => {
    socket.emit("updatePracticeData", {
      status: practice.getStatus(),
      sensors: practice.getSensorsData(),
      actuators: practice.getActuatorsStatus(),
    });
  }, 500);

  socket.on("setup", (data) => {
    if (data.user === "admin" && data.password === "admin") {
      try {
        const doc = yaml.load(
          fs.readFileSync(path.join(__dirname, "./metadata.yml"), "utf-8")
        );
        socket.emit("setup", { status: "success", data: doc });
        practice.init();
      } catch (e) {
        socket.emit("setup", {
          status: "error",
          message: e,
        });
      }
    } else {
      socket.emit("setup", {
        status: "ERROR",
        message: "Usuario o contraseña incorrecto",
      });
    }
  });

  socket.on("command", (command) => {
    const result = practice.command(command);
    if (result.status === "error") {
      socket.emit("message", {
        status: "error",
        message: result.message,
      });
    } else {
      socket.emit("message", {
        status: "success",
      });
    }
  });
});

httpServer.listen(8000);
console.log("connected");
