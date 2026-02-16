import { useSkillStore } from '../stores/skillStore';

export function Settings() {
  const { settings, setSettings, setShowSettings } = useSkillStore();

  const handleSave = () => {
    // 保存到本地存储
    localStorage.setItem('skillviewer-settings', JSON.stringify(settings));
    setShowSettings(false);
  };

  const handleCancel = () => {
    // 从本地存储恢复原始设置
    const saved = localStorage.getItem('skillviewer-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
    setShowSettings(false);
  };

  // 阻止背景点击关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">设置</h2>
          <p className="text-sm text-gray-500">配置火山引擎 API</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="输入火山引擎 API Key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={settings.apiEndpoint}
              onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
              placeholder="API 端点地址"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              默认: https://ark.cn-beijing.volces.com/api/v3/chat/completions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model ID (模型接入点)
            </label>
            <input
              type="text"
              value={settings.modelId}
              onChange={(e) => setSettings({ ...settings, modelId: e.target.value })}
              placeholder="例如: ep-xxxx-xxxx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              在火山引擎控制台创建推理接入点后获取
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
