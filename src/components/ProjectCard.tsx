import React, { useState, useRef } from "react";
import { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Calculate 3D effect based on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    // Calculate relative mouse coordinates within the card (values between 0 and 1)
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const relativeY = Math.max(
      0,
      Math.min(1, (e.clientY - rect.top) / rect.height)
    );

    setMousePosition({ x: relativeX, y: relativeY });
  };

  // Calculate 3D transform style
  const calculate3DTransform = () => {
    if (!isHovered) return {};

    // Calculate rotation angles based on mouse position (0 degrees at center, ±15 degrees at edges)
    const rotateY = (mousePosition.x - 0.5) * 10; // Rotation around X axis
    const rotateX = (0.5 - mousePosition.y) * 10; // Rotation around Y axis

    // Calculate Z-axis movement based on mouse position (push-back effect on hover)
    const translateZ = -20;

    return {
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
      transition: "transform 0.1s ease-out",
    };
  };

  // Click event handler
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior

    // Call parent component's onClick handler when clicked
    onClick(project);
  };

  // Use technologies if available, otherwise fallback to tech array
  const technologies = project.technologies || project.tech || [];
  // Use image if available, otherwise use a placeholder
  const image = project.image || "https://placehold.co/600x400?text=Project";

  return (
    <div
      ref={cardRef}
      className="bg-[#1A1C20] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full"
      style={{
        ...calculate3DTransform(),
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={image}
          alt={project.title}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-white">{project.title}</h3>
          <div className="flex space-x-2">
            {technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="text-xs bg-purple-700 text-white px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
            {technologies.length > 3 && (
              <span className="text-xs bg-gray-800 text-white px-2 py-1 rounded">
                +{technologies.length - 3}
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2 h-10">
          {project.description}
        </p>
        <div className="mt-4 text-purple-500 font-semibold flex items-center text-sm">
          View Project
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
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
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
