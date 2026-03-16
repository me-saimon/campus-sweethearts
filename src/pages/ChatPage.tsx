import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronLeft, MessageCircle, Search, Smile, Reply, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMessages, useSendMessage, useChatContacts, Message } from "@/hooks/useMessages";
import EmojiPicker from "@/components/chat/EmojiPicker";

const ChatPage = () => {
  const { user, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChatUser = searchParams.get("user") || "";
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: contacts, isLoading: contactsLoading } = useChatContacts();
  const { data: messages } = useMessages(activeChatUser || undefined);
  const sendMessage = useSendMessage();

  const activeContact = contacts?.find((c) => c.userId === activeChatUser);

  const filteredContacts = contacts?.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeChatUser && contacts && contacts.length > 0) {
      setSearchParams({ user: contacts[0].userId });
    }
  }, [contacts, activeChatUser, setSearchParams]);

  if (!loading && !user) return <Navigate to="/login" />;

  const handleSend = () => {
    if (!newMessage.trim() || !activeChatUser) return;
    sendMessage.mutate({
      receiverId: activeChatUser,
      text: newMessage.trim(),
      replyTo: replyingTo?.id,
    });
    setNewMessage("");
    setReplyingTo(null);
  };

  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const findMessage = (id: string | null) => messages?.find((m) => m.id === id);

  const groupedMessages = messages?.reduce((groups, msg) => {
    const date = new Date(msg.created_at).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {} as Record<string, Message[]>) || {};

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16 flex" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar - fixed width, fully independent scroll */}
        <div className="w-[340px] border-r border-border bg-card hidden md:flex flex-col flex-shrink-0 overflow-hidden" style={{ height: "calc(100vh - 64px)", position: "sticky", top: "64px" }}>
          <div className="p-5 border-b border-border flex-shrink-0">
            <h2 className="text-xl font-display font-bold text-foreground mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-9 rounded-xl bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 h-10 text-sm"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contactsLoading && (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading chats...</p>
              </div>
            )}
            {!contactsLoading && (!filteredContacts || filteredContacts.length === 0) && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-7 h-7 text-primary/50" />
                </div>
                <p className="text-sm font-medium text-foreground">No conversations</p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Accept an interest request<br />to start chatting
                </p>
              </div>
            )}
            {filteredContacts?.map((contact) => (
              <button
                key={contact.userId}
                onClick={() => { setSearchParams({ user: contact.userId }); setReplyingTo(null); }}
                className={`w-full p-4 flex items-center gap-3 transition-all duration-200 border-b border-border/30 ${
                  activeChatUser === contact.userId
                    ? "bg-primary/10 border-l-3 border-l-primary"
                    : "hover:bg-muted/40 border-l-3 border-l-transparent"
                }`}
              >
                <Avatar className="w-11 h-11 flex-shrink-0">
                  <AvatarImage src={contact.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold text-sm">
                    {contact.initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{contact.name}</p>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                      {formatDate(contact.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area - takes remaining space, independent scroll */}
        <div className="flex-1 flex flex-col min-w-0">
          {!activeChatUser || !activeContact ? (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-5">
                  <MessageCircle className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  {contacts && contacts.length > 0 ? "Select a conversation" : "No conversations yet"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-[280px] mx-auto leading-relaxed">
                  {contacts && contacts.length > 0
                    ? "Choose a contact from the sidebar to start chatting"
                    : "Browse profiles and show interest to start meaningful conversations"}
                </p>
                {(!contacts || contacts.length === 0) && (
                  <Button size="sm" className="mt-5 rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                    <Link to="/browse">Browse Profiles</Link>
                  </Button>
                )}
              </motion.div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="h-[68px] border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-5 gap-3 shadow-sm flex-shrink-0">
                <Link to="/browse" className="md:hidden mr-1">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={activeContact.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold text-sm">
                    {activeContact.initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${activeChatUser}`} className="text-sm font-bold text-foreground hover:text-primary transition-colors">
                    {activeContact.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{activeContact.university}</p>
                </div>
              </div>

              {/* Messages - scrollable area */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center justify-center my-4">
                      <span className="text-[11px] text-muted-foreground bg-muted/60 px-3 py-1 rounded-full font-medium">
                        {formatDate(msgs[0].created_at)}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <AnimatePresence>
                        {msgs.map((msg, idx) => {
                          const isMine = msg.sender_id === user?.id;
                          const showTail = idx === msgs.length - 1 || msgs[idx + 1]?.sender_id !== msg.sender_id;
                          const repliedMsg = findMessage(msg.reply_to);

                          return (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              className={`flex ${isMine ? "justify-end" : "justify-start"} group/msg`}
                            >
                              <div className="flex items-center gap-1 max-w-[75%]">
                                {!isMine && (
                                  <button
                                    onClick={() => handleReply(msg)}
                                    className="opacity-0 group-hover/msg:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted/60"
                                    title="Reply"
                                  >
                                    <Reply className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                )}
                                <div
                                  className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                                    isMine
                                      ? `bg-primary text-primary-foreground ${showTail ? "rounded-2xl rounded-br-md" : "rounded-2xl"}`
                                      : `bg-card border border-border/60 text-foreground ${showTail ? "rounded-2xl rounded-bl-md" : "rounded-2xl"}`
                                  }`}
                                >
                                  {repliedMsg && (
                                    <div className={`text-xs mb-1.5 px-2.5 py-1.5 rounded-lg border-l-2 ${
                                      isMine
                                        ? "bg-primary-foreground/15 border-primary-foreground/40 text-primary-foreground/80"
                                        : "bg-muted/50 border-primary/30 text-muted-foreground"
                                    }`}>
                                      <p className="truncate max-w-[200px]">{repliedMsg.text}</p>
                                    </div>
                                  )}
                                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                  <p className={`text-[10px] mt-1 text-right ${
                                    isMine ? "text-primary-foreground/60" : "text-muted-foreground/70"
                                  }`}>
                                    {formatTime(msg.created_at)}
                                  </p>
                                </div>
                                {isMine && (
                                  <button
                                    onClick={() => handleReply(msg)}
                                    className="opacity-0 group-hover/msg:opacity-100 transition-opacity p-1 rounded-full hover:bg-muted/60"
                                    title="Reply"
                                  >
                                    <Reply className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply preview bar */}
              <AnimatePresence>
                {replyingTo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border bg-primary/5 px-4 py-2 flex items-center gap-3 flex-shrink-0"
                  >
                    <Reply className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary">
                        Replying to {replyingTo.sender_id === user?.id ? "yourself" : activeContact?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{replyingTo.text}</p>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="p-1 rounded-full hover:bg-muted/60">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input - fixed at bottom */}
              <div className="p-3 border-t border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-2 max-w-3xl mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      className="rounded-full bg-muted/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary/40 pr-10 h-11 text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <button
                        onClick={() => setShowEmoji(!showEmoji)}
                        className="text-muted-foreground/50 hover:text-primary transition-colors"
                      >
                        <Smile className="w-5 h-5" />
                      </button>
                      <EmojiPicker isOpen={showEmoji} onClose={() => setShowEmoji(false)} onSelect={handleEmojiSelect} />
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full w-11 h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all duration-200"
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
