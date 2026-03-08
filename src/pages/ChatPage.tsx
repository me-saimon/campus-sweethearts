import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Smile, AlertCircle, Heart, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

const MAX_TOKENS = 50;

const initialMessages: Message[] = [
  { id: "1", text: "Assalamu Alaikum! I saw your profile and really liked it.", sender: "them", time: "10:30 AM" },
  { id: "2", text: "Walaikum Assalam! Thank you, that's very kind of you.", sender: "me", time: "10:32 AM" },
  { id: "3", text: "What are you studying?", sender: "them", time: "10:33 AM" },
];

const chatContacts = [
  { id: "1", name: "Ayesha Rahman", lastMessage: "What are you studying?", unread: 1, initial: "A" },
  { id: "2", name: "Rafiq Ahmed", lastMessage: "That sounds great!", unread: 0, initial: "R" },
  { id: "3", name: "Fatima Noor", lastMessage: "JazakAllah Khair", unread: 2, initial: "F" },
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [tokensUsed, setTokensUsed] = useState(3);
  const [activeChat, setActiveChat] = useState("1");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || tokensUsed >= MAX_TOKENS) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    setTokensUsed((prev) => prev + 1);

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's wonderful! I'd love to know more about you.",
        sender: "them",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, reply]);
      setTokensUsed((prev) => prev + 1);
    }, 1500);
  };

  const tokenPercentage = (tokensUsed / MAX_TOKENS) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex">
        {/* Sidebar */}
        <div className="w-80 border-r border-border bg-card hidden md:flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-display font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  activeChat === contact.id ? "bg-peach/50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">{contact.initial}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-coral text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="h-16 border-b border-border bg-card flex items-center px-4 gap-3">
            <Link to="/browse" className="md:hidden">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Ayesha Rahman</p>
              <p className="text-xs text-muted-foreground">Dhaka University</p>
            </div>
            <Button variant="hero" size="sm">
              <Heart className="w-4 h-4" />
              Show Interest
            </Button>
          </div>

          {/* Token bar */}
          <div className="px-4 py-2 bg-card/50 border-b border-border">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Chat Tokens
              </span>
              <span className={`font-semibold ${tokenPercentage > 80 ? "text-destructive" : "text-teal"}`}>
                {tokensUsed}/{MAX_TOKENS}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${tokenPercentage > 80 ? "bg-destructive" : "bg-gradient-accent"}`}
                initial={{ width: 0 }}
                animate={{ width: `${tokenPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.sender === "me"
                      ? "bg-gradient-hero text-primary-foreground rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === "me" ? "text-primary-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card">
            {tokensUsed >= MAX_TOKENS ? (
              <div className="text-center py-3">
                <p className="text-sm text-destructive font-medium mb-2">Token limit reached!</p>
                <p className="text-xs text-muted-foreground mb-3">Show interest to unlock unlimited chat</p>
                <Button variant="hero" size="sm">
                  <Heart className="w-4 h-4" />
                  Show Interest • ৳500
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border-2 border-border focus:border-coral"
                />
                <Button
                  variant="hero"
                  size="icon"
                  className="rounded-full w-10 h-10"
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
