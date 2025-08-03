'use client';

import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full px-10 py-4 bg-white/60 backdrop-blur-sm shadow-sm border-b border-neutral-200 flex justify-between items-center sticky top-0 z-50"
    >
      <motion.div
  className="flex items-center gap-2.5"
  whileHover={{ scale: 1.05 }}
>
    <motion.span
  className="w-2.5 h-2.5 rounded-full bg-[var(--chrono-primary)] self-center"
  animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
  transition={{
    duration: 1.4,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
  <h1 className="text-2xl font-semibold tracking-tight text-[var(--chrono-secondary)]">
    CodeChrono
  </h1>
</motion.div>

      <motion.a
        href="https://github.com/asifrahman2003/CodeChrono"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--chrono-secondary)] text-[var(--chrono-secondary)] text-sm font-medium hover:bg-[var(--chrono-secondary)] hover:text-white transition-colors"
      >
        <Github className="w-4 h-4" />
        GitHub
      </motion.a>
    </motion.header>
  );
}
