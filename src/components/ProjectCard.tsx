import React from "react";
import { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <button
        onClick={onClick}
        className="w-full text-left p-6 rounded-xl hover:bg-blue-50 transition-all duration-300 bg-white"
      >
        <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-700 mb-4">{project.summary}</p>
        <span className="text-sm text-blue-600 font-medium inline-flex items-center">
          View Details
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
        </span>
      </button>
    </div>
  );
}
