import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Project } from "../types/project";

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
  const [mounted, setMounted] = React.useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative max-w-4xl w-full max-h-[90vh] bg-[#121316] text-white rounded-xl overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex flex-col h-full">
          <div className="relative">
            <img
              src={image}
              alt={project.title}
              className="w-full h-64 object-cover object-top"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black transition text-white"
              aria-label="Close modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow">
            <h2
              id="modal-title"
              className="text-2xl font-bold mb-2 text-purple-400"
            >
              {project.title}
            </h2>
            <p className="text-gray-300 mb-6">{project.description}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-purple-300">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-md text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-purple-300">
                  Key Features
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white transition"
                >
                  View Live
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-purple-600 hover:border-purple-700 rounded text-purple-400 hover:text-purple-300 transition"
                >
                  View Code
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
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
