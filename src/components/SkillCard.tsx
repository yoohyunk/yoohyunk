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
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500" />
      <div className="relative bg-[#0a0a0c] rounded-lg p-4 flex items-center space-x-4 border border-purple-900/10 hover:border-purple-500/20 transition duration-300">
        <div className="w-10 h-10 flex items-center justify-center bg-purple-500/5 rounded-lg group-hover:bg-purple-500/10 transition duration-300">
          {IconComponent && (
            <IconComponent className="w-5 h-5 text-purple-300/70 group-hover:text-purple-200 transition-colors" />
          )}
        </div>
        <h3 className="text-base font-light text-gray-300 group-hover:text-purple-200 tracking-wide transition-colors">
          {skill.name}
        </h3>
      </div>
    </div>
  );
}
