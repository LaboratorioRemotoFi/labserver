import Practice from "./example-practice.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const practice = new Practice();
practice.init();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.static(path.join(__dirname, "./client-webapp/build")));
app.get("/", function (req, res) {
  res.status(200);
});

io.on("connection", (socket) => {
  console.log("new socket connection");

  setInterval(() => {
    socket.emit("data", practice.getData());
  }, 500);

  socket.on("command", (command) => {
    const result = practice.command(command);
    if (result.status === "error") {
      socket.emit("message", {
        messageStatus: result.status,
        messageText: result.message,
      });
    }
  });
});

httpServer.listen(8000);
console.log("connected");
