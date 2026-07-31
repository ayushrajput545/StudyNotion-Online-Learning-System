import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from "react-markdown";


export default function StudyNotionChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // When popup opens, focus input
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const openChat = () => setIsOpen(true);

    // When popup closes — clear local state, get new sessionId from backend
    const closeChat = async () => {
        setIsOpen(false);
        setMessages([]);
        setError(null);
        try {
            const res = await axios.post('https://studynotion-ed-tech-platform-2-ic89.onrender.com/api/v1/profile/clear-session');
            setSessionId(res.data.sessionId);
        } catch {
            setSessionId(null); // will create new one on next message
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;
        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);
        setError(null);

        // Optimistic UI
        const tempMsg = { role: 'user', content: userMessage, timestamp: new Date() };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await axios.post('https://studynotion-ed-tech-platform-2-ic89.onrender.com/api/v1/profile/send-message', {
                message: userMessage,
                sessionId,
            });
            setMessages(res.data.history);
            setSessionId(res.data.sessionId);
        } catch (err) {
            const msg = err?.response?.data?.error || 'Something went wrong. Try again.';
            setError(msg);
            setMessages(prev => prev.filter(m => m !== tempMsg));
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    return (
        <>
            {/* Floating button */}
            {!isOpen && (
                <button onClick={openChat} style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD60A, #FF7F3E)',
                    border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, color: '#fff'
                }}>
                    💬
                </button>
            )}

            {/* Chat popup */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
                    width: 360, height: 520,
                    background: '#161D29', borderRadius: 16,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    display: 'flex', flexDirection: 'column',
                    border: '1px solid #2C333F', overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '14px 16px',
                        background: 'linear-gradient(135deg, #FFD60A22, #FF7F3E22)',
                        borderBottom: '1px solid #2C333F',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: 'linear-gradient(135deg, #FFD60A, #FF7F3E)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18
                            }}>🎓</div>
                            <div>
                                <div style={{ color: '#F1F2FF', fontWeight: 600, fontSize: 14 }}>StudyNotion Assistant</div>
                                <div style={{ color: '#6E727F', fontSize: 11 }}>Ask me anything about the platform</div>
                            </div>
                        </div>
                        <button onClick={closeChat} style={{
                            background: 'none', border: 'none', color: '#6E727F',
                            cursor: 'pointer', fontSize: 20, lineHeight: 1
                        }}>×</button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '16px 12px',
                        display: 'flex', flexDirection: 'column', gap: 12
                    }}>
                        {messages.length === 0 && (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                    marginTop: 20,
                                }}
                            >
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#F1F2FF",
                                        fontSize: 14,
                                    }}
                                >
                                    <div style={{ fontSize: 32, marginBottom: 10 }}>👋</div>
                                    <div style={{ fontWeight: 600 }}>Welcome to StudyNotion!</div>
                                    <div
                                        style={{
                                            color: "#838894",
                                            marginTop: 6,
                                            fontSize: 13,
                                        }}
                                    >
                                        Try asking one of these questions:
                                    </div>
                                </div>

                                {[
                                    "What is StudyNotion?",
                                    "How to sell Courses on StudyNotion?",
                                    "How do I reset my password?"
                                ].map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setInput(question);
                                            setTimeout(() => sendMessage(question), 100);
                                        }}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            background: "#2C333F",
                                            color: "#F1F2FF",
                                            border: "1px solid #424854",
                                            borderRadius: 10,
                                            padding: "12px 14px",
                                            cursor: "pointer",
                                            transition: "0.2s",
                                            fontSize: 13,
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background = "#3C4450")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "#2C333F")
                                        }
                                    >
                                        💬 {question}
                                    </button>
                                ))}
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    maxWidth: '80%', padding: '10px 14px', borderRadius: 12,
                                    fontSize: 13, lineHeight: 1.6,
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, #FFD60A, #FF7F3E)'
                                        : '#2C333F',
                                    color: msg.role === 'user' ? '#161D29' : '#F1F2FF',
                                    borderBottomRightRadius: msg.role === 'user' ? 2 : 12,
                                    borderBottomLeftRadius: msg.role === 'assistant' ? 2 : 12,
                                }}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div style={{ display: 'flex', gap: 4, padding: '8px 14px' }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{
                                        width: 6, height: 6, borderRadius: '50%',
                                        background: '#6E727F',
                                        animation: `bounce 1.2s ${i * 0.15}s infinite ease-in-out`
                                    }} />
                                ))}
                            </div>
                        )}

                        {error && (
                            <div style={{
                                background: '#2D1118', border: '1px solid #6E1C22',
                                color: '#FF7B7B', padding: '8px 12px',
                                borderRadius: 8, fontSize: 12, textAlign: 'center'
                            }}>{error}</div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div style={{ padding: '10px 12px', borderTop: '1px solid #2C333F' }}>
                        <div style={{
                            display: 'flex', gap: 8, alignItems: 'center',
                            background: '#2C333F', borderRadius: 10, padding: '6px 6px 6px 12px'
                        }}>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about StudyNotion..."
                                disabled={isLoading}
                                style={{
                                    flex: 1, background: 'none', border: 'none',
                                    outline: 'none', color: '#F1F2FF', fontSize: 13,
                                    padding: '4px 0'
                                }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !input.trim()}
                                style={{
                                    background: input.trim() ? 'linear-gradient(135deg, #FFD60A, #FF7F3E)' : '#3C4450',
                                    border: 'none', borderRadius: 8,
                                    width: 32, height: 32, cursor: input.trim() ? 'pointer' : 'not-allowed',
                                    color: input.trim() ? '#161D29' : '#6E727F',
                                    fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >↑</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-5px); }
                }
            `}</style>
        </>
    );
}