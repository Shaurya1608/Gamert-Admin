import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

class SocketService {
  socket = null;
  currentUserId = null;

  connect() {
    if (this.socket) return;
    
    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      if (import.meta.env.DEV) console.log("Connected to socket server");
      if (this.currentUserId) {
        this.socket.emit("join_user_room", this.currentUserId);
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    window.addEventListener("tokens-refreshed", () => {
      this.reconnect();
    });
  }

  reconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connect();
  }

  joinRoom(roomId) {
    if (!this.socket) this.connect();
    this.socket.emit("join_room", roomId);
  }

  sendMessage(messageData) {
    if (!this.socket) this.connect();
    this.socket.emit("send_message", messageData);
  }

  emit(event, data) {
    if (!this.socket) this.connect();
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) this.socket.off(event, callback);
      else this.socket.off(event);
    }
  }

  joinUserRoom(userId) {
    if (!userId) return;
    if (!this.socket) this.connect();
    this.currentUserId = userId;
    this.socket.emit("join_user_room", userId);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
