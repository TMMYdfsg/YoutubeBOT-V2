import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getLiveChatMessages } from "./chatListener.js";
import { getGeminiReply } from "./geminiClient.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3001;

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("send-message", async (msg) => {
        const aiReply = await getGeminiReply(msg.text, msg.persona);
        socket.emit("bot-reply", { user: "AI", text: aiReply });
    });
});

setInterval(async () => {
    const newMessages = await getLiveChatMessages();
    newMessages.forEach((msg) => {
        io.emit("new-message", msg);
    });
}, 5000);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));