"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface Props {
  html: string;
}

export default function NotionRenderer({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Apply syntax highlighting to code blocks
    const blocks = ref.current.querySelectorAll("pre code");
    blocks.forEach((block) => {
      const pre = block.parentElement;
      if (!pre) return;
      // Add copy button
      const btn = document.createElement("button");
      btn.textContent = "Copy";
      btn.className =
        "absolute top-2 right-2 text-xs text-gray-400 hover:text-gray-600 bg-white/80 px-2 py-1 rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity";
      btn.onclick = () => {
        navigator.clipboard.writeText(block.textContent || "");
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      };
      pre.className = pre.className + " relative group";
      pre.appendChild(btn);
    });
  }, [html]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
