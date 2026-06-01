"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { NotionPageMeta } from "@/lib/types";

interface Props {
  project: NotionPageMeta;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block group py-4 border-b border-gray-50 hover:bg-gray-50/50 -mx-2 px-2 rounded transition-colors"
      >
        <p className="text-xs text-gray-400 mb-1 font-mono">{project.date}</p>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
        {project.tags.length > 0 && (
          <div className="flex gap-2 mt-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
