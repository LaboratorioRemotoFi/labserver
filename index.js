import Practice from "./example-practice.js";
import { Server } from "socket.io";

const practice = new Practice();
practice.init();

const io = new Server({
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  },
});

io.on("connection", (socket) => {
  console.log("new socket connection");

  setInterval(() => {
    socket.emit("data", practice.getData());
  }, 500);

  socket.on("command", (command) => {
    console.log(`Comando recibido: ${command}`);
  });
});

io.listen(3000);
console.log("connected");
