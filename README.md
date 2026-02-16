# Skill Viewer

一个本地桌面应用程序，用于管理 Claude Code Skills。

![Skill Viewer Screenshot](./screenshot.png)

## 功能特性

- 📋 **浏览 Skills** - 自动扫描 `~/.claude/skills/` 目录
- 🔍 **快速搜索** - 按名称、描述关键词过滤
- 📖 **Markdown 渲染** - 优雅展示 SKILL.md 内容
- 🌐 **AI 翻译** - 调用火山引擎 API 翻译技能文档
- 📝 **AI 总结** - 自动生成技能功能摘要

## 下载安装

前往 [Releases](https://github.com/X-D-O/claude-skill-viewer/releases) 页面下载对应平台的安装包：

| 平台 | 文件 | 说明 |
|------|------|------|
| macOS (Apple Silicon) | `SkillViewer_x.x.x_aarch64.dmg` | M1/M2/M3 芯片 |
| macOS (Intel) | `SkillViewer_x.x.x_x64.dmg` | Intel 芯片 |
| Windows | `SkillViewer_x.x.x_x64.msi` | Windows 10/11 |

## 使用方法

1. 安装应用后启动
2. 点击右上角 ⚙️ 设置按钮
3. 配置火山引擎 API：
   - **API Key**: 在[火山引擎控制台](https://console.volcengine.com/ark)获取
   - **Model ID**: 创建推理接入点后获得的 ID（格式：`ep-xxxx-xxxx`）
4. 选择左侧的 Skill 查看详情
5. 使用右侧 AI 面板进行翻译或总结

## 技术栈

- **前端**: React 18 + TypeScript + TailwindCSS
- **后端**: Rust + Tauri v2
- **状态管理**: Zustand
- **AI API**: 火山引擎（豆包大模型）

## 本地开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm tauri dev

# 构建
pnpm tauri build
```

## 环境要求

- Node.js 20+
- pnpm 9+
- Rust 1.70+
- macOS 10.13+ / Windows 10+

## License

MIT
