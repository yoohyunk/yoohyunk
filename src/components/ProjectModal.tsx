import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Project } from "../types/project";
import { FaGithub, FaGlobe, FaTimes } from "react-icons/fa";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  isOpen: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  isOpen,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Verify mounting on client side only
    setMounted(true);

    if (isOpen) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  // Use technologies if available, otherwise fallback to tech array
  const technologies = project.technologies || project.tech || [];
  // Use image if available, otherwise use a placeholder
  const image = project.image || "https://placehold.co/600x400?text=Project";
  // Get features if available
  const features = project.features || [];
  // URLs for links
  const liveUrl = project.liveUrl || project.link;
  const repoUrl = project.repoUrl;

  // Modal content
  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-0 md:p-4"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative bg-white text-[#1a1a2e] overflow-hidden shadow-2xl w-full h-full rounded-none md:w-full md:max-w-2xl md:h-auto md:max-h-[80vh] md:rounded-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex flex-col h-full">
          {/* Header with image */}
          <div className="relative flex-shrink-0">
            <img
              src={image}
              alt={project.title}
              className="w-full object-cover object-center h-52 md:h-48"
            />
            {/* Gradient overlay for mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:hidden" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center active:bg-gray-100 transition text-gray-600 shadow-sm w-11 h-11 md:w-8 md:h-8 hover:bg-gray-100"
              aria-label="Close modal"
            >
              <FaTimes className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Content */}
          <div
            className="overflow-y-auto flex-grow p-5 pb-8 md:pb-5"
          >
            <h2
              id="modal-title"
              className="font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent text-2xl md:text-xl"
            >
              {project.title}
            </h2>
            <p
              className="text-gray-600 mb-4 font-medium text-base md:text-lg"
            >
              {project.summary}
            </p>
            {project.description.map((desc, index) => (
              <p
                key={index}
                className="text-gray-500 mb-4 text-base leading-relaxed md:text-sm"
              >
                {desc}
              </p>
            ))}

            <div className="mb-5">
              <h3
                className="font-semibold mb-3 text-violet-600 text-lg md:text-md"
              >
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-1.5">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-violet-100 text-violet-700 rounded-md flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm md:px-2 md:py-1 md:text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div className="mb-5">
                <h3
                  className="font-semibold mb-3 text-violet-600 text-lg md:text-md"
                >
                  Key Features
                </h3>
                <ul
                  className="list-disc list-inside space-y-2 text-gray-600 text-base md:text-sm"
                >
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-6 md:mt-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-violet-600 active:bg-violet-700 rounded-full text-white transition w-12 h-12 md:w-10 md:h-10 hover:bg-violet-700"
                  title="View Live Site"
                >
                  <FaGlobe className="w-5 h-5 md:w-[18px] md:h-[18px]" />
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center border border-violet-600 active:border-violet-700 rounded-full text-violet-600 active:text-violet-500 transition w-12 h-12 md:w-10 md:h-10 hover:border-violet-700 hover:text-violet-500"
                  title="View Source Code"
                >
                  <FaGithub className="w-5 h-5 md:w-[18px] md:h-[18px]" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use Portal for client-side only
  return mounted ? createPortal(modalContent, document.body) : null;
};

export default ProjectModal;
