import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useSkillStore } from '../stores/skillStore';
import { AIRequestType } from '../types/skill';

export function AIPanel() {
  const { selectedSkill, aiResult, aiLoading, setAIResult, setAILoading, settings, setShowSettings } =
    useSkillStore();
  const [activeTab, setActiveTab] = useState<AIRequestType>('summarize');

  const handleAIRequest = useCallback(async (type: AIRequestType) => {
    // 防止重复点击
    if (aiLoading) return;

    // 检查配置
    if (!settings.apiKey || !settings.modelId) {
      setAIResult('请先配置 API Key 和 Model ID');
      setShowSettings(true);
      return;
    }

    if (!selectedSkill) return;

    setAILoading(true);
    setAIResult('');

    try {
      const result = await invoke<string>('ai_request', {
        apiKey: settings.apiKey,
        endpoint: settings.apiEndpoint,
        modelId: settings.modelId,
        skillContent: selectedSkill.content.slice(0, 8000), // 限制内容长度
        skillName: selectedSkill.meta.name,
        requestType: type,
      });
      setAIResult(result);
    } catch (error) {
      console.error('AI request failed:', error);
      setAIResult(`请求失败: ${error}`);
    } finally {
      setAILoading(false);
    }
  }, [aiLoading, settings, selectedSkill, setAIResult, setAILoading, setShowSettings]);

  if (!selectedSkill) return null;

  return (
    <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
      {/* 标签切换 */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab('summarize')}
          disabled={aiLoading}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'summarize'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } ${aiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          📋 总结
        </button>
        <button
          onClick={() => setActiveTab('translate')}
          disabled={aiLoading}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'translate'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          } ${aiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          🌐 翻译
        </button>
      </div>

      {/* 操作按钮 */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => handleAIRequest(activeTab)}
          disabled={aiLoading}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            aiLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {aiLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              处理中...
            </span>
          ) : activeTab === 'summarize' ? (
            '生成总结'
          ) : (
            '翻译为中文'
          )}
        </button>

        {(!settings.apiKey || !settings.modelId) && (
          <p className="text-xs text-amber-600 mt-2 text-center">
            请先点击右上角⚙️配置 API
          </p>
        )}
      </div>

      {/* 结果显示 */}
      <div className="flex-1 overflow-y-auto p-4">
        {aiResult ? (
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {aiResult}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm mt-8">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p>点击上方按钮{activeTab === 'summarize' ? '生成总结' : '翻译内容'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
