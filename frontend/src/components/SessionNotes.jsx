// components/SessionNotes.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Trash2, StickyNote } from "lucide-react";
import { getNoteForToday, saveNoteForToday, clearNoteForToday } from "../utils/storage";

export default function SessionNotes() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existingNote = getNoteForToday();
    setNote(existingNote);
  }, []);

  const handleSave = () => {
    saveNoteForToday(note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleClear = () => {
    clearNoteForToday();
    setNote("");
  };

  const glow = "hover:shadow-[0_0_0_2px_var(--chrono-primary)] hover:shadow-[0_0_12px_2px_var(--chrono-primary)] transition duration-300";

  return (
    <motion.div
      className={`bg-[var(--chrono-notes-bg,#fff6e6)] border border-[var(--chrono-primary)] rounded-xl shadow-md p-5 mt-6 mb-6 max-w-4xl mx-auto ${glow}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3 text-[var(--chrono-secondary)]">
        <StickyNote size={18} />
        <h3 className="text-md font-bold">Session Notes</h3>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down on what are you focused on today, what worked, and what you'll do next..."
        className="w-full p-3 rounded border border-neutral-300 text-sm text-gray-800 resize-none h-28 focus:outline-none focus:ring-2 focus:ring-[var(--chrono-primary)]"
        aria-label="Session Notes Textarea"
      />

      <div className="flex justify-end gap-3 mt-4">
        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
        >
          <Trash2 size={16} />
          Clear
        </motion.button>

        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <Save size={16} />
          Save
        </motion.button>

        {saved && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-green-600 text-sm ml-2"
          >
            Saved!
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
