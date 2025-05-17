export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface SkillsData {
  categories: SkillCategory[];
}
