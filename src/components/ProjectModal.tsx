import React, { useEffect } from "react";
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
        className="relative max-w-2xl w-full max-h-[80vh] bg-[#121316] text-white rounded-xl overflow-hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex flex-col h-full">
          <div className="relative">
            <img
              src={image}
              alt={project.title}
              className="w-full h-48 object-cover object-top"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black transition text-white"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-5 overflow-y-auto flex-grow">
            <h2
              id="modal-title"
              className="text-xl font-bold mb-2 text-purple-400"
            >
              {project.title}
            </h2>
            <p className="text-lg text-gray-300 mb-3 font-medium">
              {project.summary}
            </p>
            <p className="text-sm text-gray-400 mb-4">{project.description}</p>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2 text-purple-300">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-md text-xs flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{
                      minHeight: "24px",
                      lineHeight: "1",
                      maxWidth: "100px",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2 text-purple-300">
                  Key Features
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3 mt-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition"
                  title="View Live Site"
                >
                  <FaGlobe size={18} />
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 border border-purple-600 hover:border-purple-700 rounded-full text-purple-400 hover:text-purple-300 transition"
                  title="View Source Code"
                >
                  <FaGithub size={18} />
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
