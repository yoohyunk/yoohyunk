import React from "react";
import { Skill } from "../types/skill";
import {
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaDocker,
  FaAws,
  FaLinux,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiDjango,
  SiPostgresql,
  SiFlask,
  SiExpo,
  SiMysql,
} from "react-icons/si";
import { DiMsqlServer } from "react-icons/di";
import { IconType } from "react-icons";

interface SkillCardProps {
  skill: Skill;
}

const iconComponents: { [key: string]: IconType } = {
  react: FaReact,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  nodejs: FaNodeJs,
  django: SiDjango,
  postgresql: SiPostgresql,
  git: FaGitAlt,
  docker: FaDocker,
  aws: FaAws,
  linux: FaLinux,
  reactnative: FaReact,
  expo: SiExpo,
  flask: SiFlask,
  azure: DiMsqlServer,
  sql: SiMysql,
};

export default function SkillCard({ skill }: SkillCardProps) {
  const IconComponent = iconComponents[skill.icon];

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50 group">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm group-hover:shadow">
          {IconComponent && (
            <IconComponent className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
          )}
        </div>
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          {skill.name}
        </h3>
      </div>
    </div>
  );
}
