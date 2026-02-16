// Skill 元数据（从 YAML frontmatter 解析）
export interface SkillMeta {
  name: string;
  description: string;
  license?: string;
}

// Skill 完整数据
export interface Skill {
  id: string; // 目录名
  path: string; // 完整路径
  meta: SkillMeta; // YAML 元数据
  content: string; // Markdown 内容
  files: string[]; // 关联文件列表
  lastModified: number; // 修改时间戳
}

// AI 请求类型
export type AIRequestType = 'translate' | 'summarize';

// AI 响应
export interface AIResponse {
  success: boolean;
  result?: string;
  error?: string;
}

// 应用设置
export interface AppSettings {
  apiKey: string;
  apiEndpoint: string;
  modelId: string;
}
