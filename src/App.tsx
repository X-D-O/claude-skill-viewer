import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useSkillStore } from './stores/skillStore';
import { Sidebar } from './components/Sidebar';
import { SkillDetail } from './components/SkillDetail';
import { Settings } from './components/Settings';
import { Skill } from './types/skill';

function App() {
  const { setSkills, setLoading, setError, showSettings, setSettings } = useSkillStore();

  // 加载 skills
  useEffect(() => {
    const loadSkills = async () => {
      setLoading(true);
      try {
        const skills = await invoke<Skill[]>('scan_skills');
        setSkills(skills);
      } catch (error) {
        setError(`加载 skills 失败: ${error}`);
        console.error('Failed to load skills:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();

    // 从本地存储加载设置
    const saved = localStorage.getItem('skillviewer-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* 顶部导航栏 */}
      <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <span className="font-semibold text-gray-900">Skill Viewer</span>
        </div>

        <button
          onClick={() => useSkillStore.getState().setShowSettings(true)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="设置"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <SkillDetail />
      </main>

      {/* 设置弹窗 */}
      {showSettings && <Settings />}
    </div>
  );
}

export default App;
