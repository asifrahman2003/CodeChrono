'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full text-center text-sm text-[var(--chrono-secondary)] py-6 mt-auto border-t border-neutral-200 px-4"
    >
      <p className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2">
        &copy; {new Date().getFullYear()} 
        <span className="font-semibold">CodeChrono</span> · Built with ❤️ and Focus by{' '}
        <a
          href="https://www.iamasiff.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--chrono-primary)] transition"
        >
        Asifur Rahman
        </a>
      </p>
    </motion.footer>
  );
}
