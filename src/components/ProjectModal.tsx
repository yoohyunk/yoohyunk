import React from "react";
import { Project } from "../types/project";
import { createPortal } from "react-dom";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 shadow-xl max-w-lg w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold mb-4 text-gray-900">
          {project.title}
        </h3>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {project.description}
        </p>
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline inline-flex items-center group"
          >
            View on GitHub
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
