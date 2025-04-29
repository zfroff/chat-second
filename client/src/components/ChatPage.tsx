import React from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your server URL if deployed

interface Message {
  from: string;
  message: string;
}

export const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const nick = localStorage.getItem("nickname");
    if (nick) {
      setNickname(nick);
      socket.emit("join_room", nick);
    }

    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    // Here `to` should be the other user's nickname (could be dynamic UI later)
    const recipient = prompt("Enter recipient nickname:");
    if (!recipient) return;

    const message: Message = { from: nickname, message: input };
    socket.emit("send_message", { to: recipient, message: input });
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-white p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Welcome, {nickname}</h2>
      <div className="flex-1 overflow-y-auto space-y-3 border border-zinc-700 rounded-xl p-4 bg-zinc-900">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
              msg.from === nickname
                ? "bg-gradient-to-r from-orange-500 to-rose-500 self-end ml-auto"
                : "bg-zinc-800"
            }`}
          >
            <strong>{msg.from === nickname ? "Me" : msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl text-white font-bold hover:scale-105 transition-transform"
        >
          Send
        </button>
      </div>
    </div>
  );
};
