import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useSkillStore } from '../stores/skillStore';
import { AIPanel } from './AIPanel';

export function SkillDetail() {
  const { selectedSkill } = useSkillStore();

  if (!selectedSkill) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium">选择一个 Skill 查看详情</p>
          <p className="text-sm mt-1">从左侧列表中选择一个 skill 开始浏览</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 头部信息 */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{selectedSkill.meta.name}</h1>
            <p className="text-gray-600 mt-1">{selectedSkill.meta.description}</p>
            {selectedSkill.meta.license && (
              <p className="text-xs text-gray-400 mt-2">License: {selectedSkill.meta.license}</p>
            )}
          </div>
          <div className="text-right text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="font-mono text-xs">{selectedSkill.id}</span>
            </div>
            <div className="mt-1">
              {selectedSkill.files.length} 文件
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-hidden flex">
        {/* Markdown 内容 */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="markdown-body max-w-4xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedSkill.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* AI 面板 */}
        <AIPanel />
      </div>
    </div>
  );
}
