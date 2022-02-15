import { io } from "socket.io-client";

class Socket {
  constructor() {
    this.status = "DISCONNECTED";
    this.socket = {};
  }

  connect(serverIp) {
    this.socket = io(serverIp);
  }
}

export default Socket;
