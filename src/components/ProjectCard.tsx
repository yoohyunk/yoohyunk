import React, { useState, useRef, useEffect } from "react";
import { Project } from "../types/project";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaDocker,
  FaAws,
  FaPython,
  FaJsSquare,
  FaHtml5,
  FaCss3Alt,
  FaDatabase,
  FaTerminal,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiDjango,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiGraphql,
  SiFirebase,
  SiFlask,
  SiRedux,
  SiExpo,
  SiJest,
  SiCypress,
  SiSupabase,
  SiTestinglibrary,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import { BsCodeSquare } from "react-icons/bs";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

// Map tech names to their respective icons
const getTechIcon = (techName: string) => {
  // Normalize tech name for lookup (lowercase)
  const normalizedTech = techName.toLowerCase().trim();

  // Unified color that matches the project's theme (purple accent)
  const iconColor = "text-purple-400";

  // Map of tech names to their icon components
  const techIcons: Record<string, React.ReactElement> = {
    // Frontend
    react: <FaReact className={iconColor} />,
    "react native": <TbBrandReactNative className={iconColor} />,
    reactnative: <TbBrandReactNative className={iconColor} />,
    javascript: <FaJsSquare className={iconColor} />,
    typescript: <SiTypescript className={iconColor} />,
    html: <FaHtml5 className={iconColor} />,
    css: <FaCss3Alt className={iconColor} />,
    tailwind: <SiTailwindcss className={iconColor} />,
    "tailwind css": <SiTailwindcss className={iconColor} />,

    // Backend
    python: <FaPython className={iconColor} />,
    django: <SiDjango className={iconColor} />,
    node: <FaNodeJs className={iconColor} />,
    "node.js": <FaNodeJs className={iconColor} />,
    nextjs: <SiNextdotjs className={iconColor} />,
    "next.js": <SiNextdotjs className={iconColor} />,
    flask: <SiFlask className={iconColor} />,

    // Database
    firebase: <SiFirebase className={iconColor} />,
    supabase: <SiSupabase className={iconColor} />,
    postgresql: <SiPostgresql className={iconColor} />,
    postgres: <SiPostgresql className={iconColor} />,
    mysql: <SiMysql className={iconColor} />,
    mongodb: <SiMongodb className={iconColor} />,
    graphql: <SiGraphql className={iconColor} />,
    rest: <BsCodeSquare className={iconColor} />,
    "rest api": <BsCodeSquare className={iconColor} />,
    sql: <FaDatabase className={iconColor} />,
    sqlite: <FaDatabase className={iconColor} />,
    firestore: <SiFirebase className={iconColor} />,
    "firebase auth": <SiFirebase className={iconColor} />,

    // DevOps
    aws: <FaAws className={iconColor} />,
    docker: <FaDocker className={iconColor} />,

    // Mobile
    expo: <SiExpo className={iconColor} />,

    // State Management
    redux: <SiRedux className={iconColor} />,

    // Version Control
    git: <FaGitAlt className={iconColor} />,

    // Testing
    jest: <SiJest className={iconColor} />,
    cypress: <SiCypress className={iconColor} />,
    "testing library": <SiTestinglibrary className={iconColor} />,

    // Generic
    api: <BsCodeSquare className={iconColor} />,
    "square api": <BsCodeSquare className={iconColor} />,
    ocr: <FaTerminal className={iconColor} />,
    ai: <FaTerminal className={iconColor} />,
    "ai logic": <FaTerminal className={iconColor} />,
    "machine learning": <FaTerminal className={iconColor} />,
  };

  // Return the appropriate icon or a default code icon
  return techIcons[normalizedTech] || <BsCodeSquare className={iconColor} />;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCount, setShowCount] = useState(5); // Show more icons since they're smaller
  const cardRef = useRef<HTMLDivElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  // Determine how many tags to show based on available space
  useEffect(() => {
    if (tagContainerRef.current) {
      const containerWidth = tagContainerRef.current.offsetWidth;
      // If container is narrow, show fewer icons
      setShowCount(containerWidth < 180 ? 4 : 5);
    }
  }, []);

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
    <div className="relative group">
      {/* Gradient background glow effect - always visible but enhanced on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-500" />

      <div
        ref={cardRef}
        className="relative bg-[#1A1C20] rounded-xl overflow-hidden border border-purple-900/10 group-hover:border-purple-500/20 transition duration-300 shadow-lg group-hover:shadow-purple-500/10"
        style={{
          ...calculate3DTransform(),
          transformStyle: "preserve-3d",
          height: "160px", // Fixed height
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <div className="flex h-full">
          {/* Image on the left */}
          <div className="w-2/5 h-full relative overflow-hidden">
            <img
              src={image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Content on the right */}
          <div className="w-3/5 p-3 flex flex-col h-full">
            <h3 className="text-md font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-300 transition-colors">
              {project.title}
            </h3>

            <p className="text-xs text-gray-400 line-clamp-2 mb-2 group-hover:text-gray-300 transition-colors">
              {project.summary}
            </p>

            <div className="mt-auto">
              <div
                className="flex flex-wrap gap-1.5 mb-2"
                ref={tagContainerRef}
              >
                {technologies.slice(0, showCount).map((tech, index) => (
                  <div
                    key={index}
                    className="text-sm hover:scale-110 transition-transform"
                    title={tech}
                  >
                    {getTechIcon(tech)}
                  </div>
                ))}
                {technologies.length > showCount && (
                  <span className="text-xs flex items-center justify-center text-white bg-purple-500/50 rounded-full w-4 h-4">
                    +{technologies.length - showCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay with centered "View Project" text */}
        <div
          className={`absolute inset-0 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: "none" }}
        >
          <div className="text-white font-medium flex items-center text-xl">
            View Project
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
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
    </div>
  );
};

export default ProjectCard;
