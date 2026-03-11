import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, ChevronLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, useSendMessage, useChatContacts } from "@/hooks/useMessages";

const ChatPage = () => {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatUser = searchParams.get("user") || "";
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: contacts, isLoading: contactsLoading } = useChatContacts();
  const { data: messages } = useMessages(activeChatUser || undefined);
  const sendMessage = useSendMessage();

  const activeContact = contacts?.find((c) => c.userId === activeChatUser);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select first contact if none selected
  useEffect(() => {
    if (!activeChatUser && contacts && contacts.length > 0) {
      setSearchParams({ user: contacts[0].userId });
    }
  }, [contacts, activeChatUser, setSearchParams]);

  if (!loading && !user) return <Navigate to="/login" />;

  const handleSend = () => {
    if (!newMessage.trim() || !activeChatUser) return;
    sendMessage.mutate({ receiverId: activeChatUser, text: newMessage.trim() });
    setNewMessage("");
  };

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
            {contactsLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
            )}
            {!contactsLoading && (!contacts || contacts.length === 0) && (
              <div className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No chats yet</p>
                <p className="text-xs text-muted-foreground mt-1">Accept an interest request to start chatting</p>
              </div>
            )}
            {contacts?.map((contact) => (
              <button
                key={contact.userId}
                onClick={() => setSearchParams({ user: contact.userId })}
                className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  activeChatUser === contact.userId ? "bg-primary/5" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">{contact.initial}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!activeChatUser || !activeContact ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold text-muted-foreground">
                  {contacts && contacts.length > 0 ? "Select a conversation" : "No conversations yet"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {contacts && contacts.length > 0
                    ? "Choose a contact from the sidebar"
                    : "Browse profiles and show interest to start chatting"}
                </p>
                {(!contacts || contacts.length === 0) && (
                  <Button variant="hero" size="sm" className="mt-4" asChild>
                    <Link to="/browse">Browse Profiles</Link>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="h-16 border-b border-border bg-card flex items-center px-4 gap-3">
                <Link to="/browse" className="md:hidden">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="w-9 h-9 rounded-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">{activeContact.initial}</span>
                </div>
                <div className="flex-1">
                  <Link to={`/profile/${activeChatUser}`} className="text-sm font-semibold hover:text-primary transition-colors">
                    {activeContact.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{activeContact.university}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages?.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender_id === user?.id
                          ? "bg-gradient-hero text-primary-foreground rounded-br-md"
                          : "bg-card border border-border rounded-bl-md"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender_id === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border-2 border-border focus:border-primary"
                  />
                  <Button
                    variant="hero"
                    size="icon"
                    className="rounded-full w-10 h-10"
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sendMessage.isPending}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
