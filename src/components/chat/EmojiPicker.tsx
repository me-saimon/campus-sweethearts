import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJI_CATEGORIES = [
  { label: "😊", emojis: ["😊", "😂", "🥰", "😍", "😘", "🤗", "😇", "🙂", "😄", "😁", "🥺", "😢", "😭", "🤣", "😅", "😆", "😉", "😎", "🤩", "😋"] },
  { label: "❤️", emojis: ["❤️", "💕", "💖", "💗", "💘", "💝", "💞", "💓", "🤍", "🖤", "💚", "💛", "🧡", "💜", "🩷", "🩵", "💙", "🤎", "💔", "❣️"] },
  { label: "👋", emojis: ["👋", "🤝", "👍", "👎", "👏", "🙏", "🤲", "🫶", "✌️", "🤞", "🤟", "👌", "🤙", "💪", "✋", "🫡", "🫰", "☝️", "👆", "👇"] },
  { label: "🌙", emojis: ["🌙", "⭐", "🌟", "✨", "🕌", "📿", "🤲", "☪️", "🕋", "📖", "🌺", "🌸", "🌷", "🌹", "💐", "🎉", "🎊", "🎁", "🏠", "👨‍👩‍👧‍👦"] },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const EmojiPicker = ({ onSelect, isOpen, onClose }: EmojiPickerProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-2xl shadow-xl z-50 w-[280px] overflow-hidden"
          >
            <div className="flex border-b border-border">
              {EMOJI_CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-2 text-lg transition-colors ${activeTab === i ? "bg-secondary/10" : "hover:bg-muted/50"}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="p-2 grid grid-cols-8 gap-0.5 max-h-[180px] overflow-y-auto">
              {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => { onSelect(emoji); onClose(); }}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-secondary/10 rounded-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EmojiPicker;
