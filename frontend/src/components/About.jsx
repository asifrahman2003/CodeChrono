import { motion } from "framer-motion";
import { Info, Github, Linkedin, Globe } from "lucide-react";

export default function AboutSection() {
  const iconLinks = [
    {
      icon: Globe,
      href: "https://www.iamasiff.com",
      label: "Website",
    },
    {
      icon: Github,
      href: "https://github.com/asifrahman2003",
      label: "GitHub",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/iamasiff",
      label: "LinkedIn",
    },
  ];

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto px-4 bg-[#fdf9f3] rounded-xl shadow-md p-5 border border-neutral-200 mb-6 text-center mt-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center gap-2 mb-2 text-[var(--chrono-primary)]">
        <Info size={18} />
        <h3 className="text-md font-bold">About CodeChrono</h3>
      </div>

      <p className="text-sm leading-relaxed text-gray-700 px-4">
        <strong>CodeChrono</strong> is my personal coding time logger that helps me build habits,
        visualize progress, and stay motivated for my coding journey. Whether I am grinding LeetCode, learning a new
        tech stack, or building consistently, CodeChrono helps track my daily coding minutes, unlock badges,
        and celebrate streaks because <strong>consistency builds mastery</strong>.
      </p>

      <div className="mt-4 flex justify-center gap-6">
        {iconLinks.map(({ icon: Icon, href, label }, i) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-gray-500 hover:text-[var(--chrono-primary)]"
            aria-label={label}
          >
            <Icon size={20} />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
