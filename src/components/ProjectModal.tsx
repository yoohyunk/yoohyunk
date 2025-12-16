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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verify mounting on client side only
    setMounted(true);

    // Check mobile
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isOpen) {
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", checkMobile);
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
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
        isMobile ? "p-0" : "p-4"
      }`}
    >
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative bg-[#121316] text-white overflow-hidden shadow-2xl ${
          isMobile
            ? "w-full h-full rounded-none"
            : "max-w-2xl w-full max-h-[80vh] rounded-xl"
        }`}
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
              className={`w-full object-cover object-center ${
                isMobile ? "h-52" : "h-48"
              }`}
            />
            {/* Gradient overlay for mobile */}
            {isMobile && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-transparent" />
            )}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center active:bg-black transition text-white ${
                isMobile ? "w-11 h-11" : "w-8 h-8 hover:bg-black"
              }`}
              aria-label="Close modal"
            >
              <FaTimes size={isMobile ? 20 : 16} />
            </button>
          </div>

          {/* Content */}
          <div
            className={`overflow-y-auto flex-grow ${
              isMobile ? "p-5 pb-8" : "p-5"
            }`}
          >
            <h2
              id="modal-title"
              className={`font-bold mb-2 text-purple-400 ${
                isMobile ? "text-2xl" : "text-xl"
              }`}
            >
              {project.title}
            </h2>
            <p
              className={`text-gray-300 mb-4 font-medium ${
                isMobile ? "text-base" : "text-lg"
              }`}
            >
              {project.summary}
            </p>
            {project.description.map((desc, index) => (
              <p
                key={index}
                className={`text-gray-400 mb-4 ${
                  isMobile ? "text-base leading-relaxed" : "text-sm"
                }`}
              >
                {desc}
              </p>
            ))}

            <div className="mb-5">
              <h3
                className={`font-semibold mb-3 text-purple-300 ${
                  isMobile ? "text-lg" : "text-md"
                }`}
              >
                Technologies
              </h3>
              <div className={`flex flex-wrap ${isMobile ? "gap-2" : "gap-1.5"}`}>
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`bg-purple-900/30 text-purple-300 rounded-md flex items-center justify-center whitespace-nowrap ${
                      isMobile
                        ? "px-3 py-1.5 text-sm"
                        : "px-2 py-1 text-xs"
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {features.length > 0 && (
              <div className="mb-5">
                <h3
                  className={`font-semibold mb-3 text-purple-300 ${
                    isMobile ? "text-lg" : "text-md"
                  }`}
                >
                  Key Features
                </h3>
                <ul
                  className={`list-disc list-inside space-y-2 text-gray-300 ${
                    isMobile ? "text-base" : "text-sm"
                  }`}
                >
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className={`flex gap-3 ${isMobile ? "mt-6" : "mt-3"}`}>
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center bg-purple-600 active:bg-purple-700 rounded-full text-white transition ${
                    isMobile
                      ? "w-12 h-12 hover:bg-purple-600"
                      : "w-10 h-10 hover:bg-purple-700"
                  }`}
                  title="View Live Site"
                >
                  <FaGlobe size={isMobile ? 20 : 18} />
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center border border-purple-600 active:border-purple-700 rounded-full text-purple-400 active:text-purple-300 transition ${
                    isMobile
                      ? "w-12 h-12 hover:border-purple-600"
                      : "w-10 h-10 hover:border-purple-700 hover:text-purple-300"
                  }`}
                  title="View Source Code"
                >
                  <FaGithub size={isMobile ? 20 : 18} />
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
