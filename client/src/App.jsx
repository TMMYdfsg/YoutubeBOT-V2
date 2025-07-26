import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

export default function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [persona, setPersona] = useState("原神");

    useEffect(() => {
        socket.on("new-message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        socket.on("bot-reply", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
    }, []);

    const sendMessage = () => {
        socket.emit("send-message", { text: input, persona });
        setMessages((prev) => [...prev, { user: "あなた", text: input }]);
        setInput("");
    };

    return (
        <div className="p-4 max-w-lg mx-auto w-full h-screen flex flex-col">
            <h1 className="text-xl font-bold mb-2 text-center">📺 YouTubeチャットBot</h1>
            <select
                className="border p-2 mb-2 rounded w-full"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}>
                <option value="原神">原神</option>
                <option value="Fortnite">Fortnite</option>
                <option value="default">汎用</option>
            </select>
            <div className="flex-1 overflow-y-auto bg-gray-100 p-2 rounded shadow-inner mb-2">
                {messages.map((m, i) => (
                    <div key={i} className="mb-1 text-sm">
                        <strong>{m.user}:</strong> {m.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    className="border rounded w-full p-2 text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="メッセージを入力"
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                    onClick={sendMessage}>
                    送信
                </button>
            </div>
        </div>
    );
}