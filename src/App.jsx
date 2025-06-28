import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUsernameSubmit = () => {
    const nameToSet = tempUsername.trim() || 'Anonymous';
    setUsername(nameToSet);
    setShowUsernameModal(false);
  };

  const send = () => {
    if (input.trim() !== '') {
      const msgData = { user: username, text: input };
      socket.emit('chat message', msgData);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      {showUsernameModal && (
        <div className="username-modal">
          <div className="modal-content">
            <h2>Enter Your Username</h2>
            <input
              type="text"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUsernameSubmit()}
              placeholder="Type your name"
            />
            <button onClick={handleUsernameSubmit}>Join Chat</button>
          </div>
        </div>
      )}

      <div id="heading">
        <h1>💬 MULTIPLE USER CHAT APPLICATION</h1>
      </div>

      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}><strong>{msg.user}:</strong> {msg.text}</li>
        ))}
        <div ref={chatEndRef} />
      </ul>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type your message"
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}

export default App;
