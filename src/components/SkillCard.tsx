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
  SiPython,
  SiJavascript,
  SiGithub,
  SiFirebase,
  SiSupabase,
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
  python: SiPython,
  javascript: SiJavascript,
  github: SiGithub,
  firebase: SiFirebase,
  supabase: SiSupabase,
};

export default function SkillCard({ skill }: SkillCardProps) {
  const IconComponent = iconComponents[skill.icon];

  return (
    <div className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-105 hover:border-purple-200 active:scale-100 transition-all duration-300 cursor-default">
      <div className="w-10 h-10 flex items-center justify-center mb-2">
        {IconComponent && (
          <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-purple-500 transition-colors duration-300" />
        )}
      </div>
      <span className="text-xs font-medium text-gray-600 group-hover:text-purple-600 transition-colors text-center">
        {skill.name}
      </span>
    </div>
  );
}
