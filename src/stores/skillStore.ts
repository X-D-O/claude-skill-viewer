import { create } from 'zustand';
import { Skill, AppSettings } from '../types/skill';

interface SkillState {
  // Skills 数据
  skills: Skill[];
  selectedSkill: Skill | null;
  searchQuery: string;

  // 加载状态
  isLoading: boolean;
  error: string | null;

  // AI 相关
  aiResult: string;
  aiLoading: boolean;

  // 设置
  settings: AppSettings;
  showSettings: boolean;

  // Actions
  setSkills: (skills: Skill[]) => void;
  selectSkill: (skill: Skill | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAIResult: (result: string) => void;
  setAILoading: (loading: boolean) => void;
  setSettings: (settings: AppSettings) => void;
  setShowSettings: (show: boolean) => void;

  // 过滤后的 skills
  getFilteredSkills: () => Skill[];
}

export const useSkillStore = create<SkillState>((set, get) => ({
  // 初始状态
  skills: [],
  selectedSkill: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  aiResult: '',
  aiLoading: false,
  settings: {
    apiKey: '',
    apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    modelId: '',
  },
  showSettings: false,

  // Actions
  setSkills: (skills) => set({ skills }),
  selectSkill: (skill) => set({ selectedSkill: skill, aiResult: '' }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setAIResult: (result) => set({ aiResult: result }),
  setAILoading: (loading) => set({ aiLoading: loading }),
  setSettings: (settings) => set({ settings }),
  setShowSettings: (show) => set({ showSettings: show }),

  // 计算属性
  getFilteredSkills: () => {
    const { skills, searchQuery } = get();
    if (!searchQuery.trim()) return skills;

    const query = searchQuery.toLowerCase();
    return skills.filter(
      (skill) =>
        skill.id.toLowerCase().includes(query) ||
        skill.meta.name.toLowerCase().includes(query) ||
        skill.meta.description.toLowerCase().includes(query)
    );
  },
}));
