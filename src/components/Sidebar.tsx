import { useSkillStore } from '../stores/skillStore';
import { Skill } from '../types/skill';

export function Sidebar() {
  const { getFilteredSkills, selectedSkill, selectSkill, searchQuery, setSearchQuery } =
    useSkillStore();
  const skills = getFilteredSkills();

  const getSkillIcon = (skill: Skill): string => {
    const name = skill.id.toLowerCase();
    if (name.includes('pdf')) return '📄';
    if (name.includes('xlsx') || name.includes('excel')) return '📊';
    if (name.includes('docx') || name.includes('word')) return '📝';
    if (name.includes('pptx') || name.includes('powerpoint')) return '📽️';
    if (name.includes('design') || name.includes('ui')) return '🎨';
    if (name.includes('test')) return '🧪';
    if (name.includes('git')) return '🔀';
    if (name.includes('debug')) return '🐛';
    if (name.includes('plan')) return '📋';
    if (name.includes('skill')) return '🔧';
    if (name.includes('web') || name.includes('frontend')) return '🌐';
    if (name.includes('api') || name.includes('mcp')) return '🔌';
    return '📁';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 搜索栏 */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索 skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Skills 列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1 font-medium">
            Skills ({skills.length})
          </div>
        </div>

        {skills.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {searchQuery ? '没有找到匹配的 skills' : '没有 skills'}
          </div>
        ) : (
          <ul className="space-y-1 px-2">
            {skills.map((skill) => (
              <li key={skill.id}>
                <button
                  onClick={() => selectSkill(skill)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedSkill?.id === skill.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSkillIcon(skill)}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{skill.meta.name || skill.id}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {skill.meta.description?.slice(0, 50) || 'No description'}
                        {skill.meta.description && skill.meta.description.length > 50 && '...'}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
