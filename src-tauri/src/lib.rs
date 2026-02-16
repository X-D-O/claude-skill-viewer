use serde::{Deserialize, Serialize};
use std::fs;

/// Skill 元数据
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillMeta {
    pub name: String,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license: Option<String>,
}

/// Skill 完整数据
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Skill {
    pub id: String,
    pub path: String,
    pub meta: SkillMeta,
    pub content: String,
    pub files: Vec<String>,
    pub last_modified: u64,
}

/// 解析 YAML frontmatter
fn parse_frontmatter(content: &str) -> (Option<SkillMeta>, String) {
    // 查找 frontmatter 边界
    if !content.starts_with("---") {
        return (None, content.to_string());
    }

    let parts: Vec<&str> = content.splitn(3, "---").collect();
    if parts.len() < 3 {
        return (None, content.to_string());
    }

    let frontmatter = parts[1].trim();
    let body = parts[2].trim();

    // 解析 YAML
    let mut name = String::new();
    let mut description = String::new();
    let mut license = None;

    for line in frontmatter.lines() {
        let line = line.trim();
        if let Some(value) = line.strip_prefix("name:") {
            name = value.trim().trim_matches('"').to_string();
        } else if let Some(value) = line.strip_prefix("description:") {
            description = value.trim().trim_matches('"').to_string();
        } else if let Some(value) = line.strip_prefix("license:") {
            license = Some(value.trim().trim_matches('"').to_string());
        }
    }

    let meta = SkillMeta {
        name,
        description,
        license,
    };

    (Some(meta), body.to_string())
}

/// 扫描 skills 目录
#[tauri::command]
fn scan_skills() -> Result<Vec<Skill>, String> {
    let home = dirs::home_dir().ok_or("Cannot find home directory")?;
    let skills_dir = home.join(".claude").join("skills");

    if !skills_dir.exists() {
        return Err(format!("Skills directory not found: {:?}", skills_dir));
    }

    let mut skills = Vec::new();

    let entries = fs::read_dir(&skills_dir)
        .map_err(|e| format!("Failed to read skills directory: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let path = entry.path();

        // 只处理目录
        if !path.is_dir() {
            continue;
        }

        let id = path
            .file_name()
            .map(|n| n.to_string_lossy().to_string())
            .unwrap_or_default();

        // 查找 SKILL.md 文件
        let skill_md = path.join("SKILL.md");
        if !skill_md.exists() {
            continue;
        }

        // 读取文件内容
        let content = match fs::read_to_string(&skill_md) {
            Ok(c) => c,
            Err(e) => {
                eprintln!("Failed to read {:?}: {}", skill_md, e);
                continue;
            }
        };

        // 解析 frontmatter
        let (meta, body) = parse_frontmatter(&content);
        let meta = meta.unwrap_or_else(|| SkillMeta {
            name: id.clone(),
            description: String::new(),
            license: None,
        });

        // 获取关联文件列表
        let mut files = Vec::new();
        if let Ok(dir_entries) = fs::read_dir(&path) {
            for file_entry in dir_entries.flatten() {
                if let Some(name) = file_entry.file_name().to_str() {
                    files.push(name.to_string());
                }
            }
        }

        // 获取修改时间
        let last_modified = fs::metadata(&skill_md)
            .and_then(|m| m.modified())
            .map(|t| t.duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_secs())
            .unwrap_or(0);

        skills.push(Skill {
            id,
            path: path.to_string_lossy().to_string(),
            meta,
            content: body,
            files,
            last_modified,
        });
    }

    // 按名称排序
    skills.sort_by(|a, b| a.meta.name.cmp(&b.meta.name));

    Ok(skills)
}

/// 调用 AI API
#[tauri::command]
async fn ai_request(
    api_key: String,
    endpoint: String,
    model_id: String,
    skill_content: String,
    skill_name: String,
    request_type: String,
) -> Result<String, String> {
    use tauri_plugin_http::reqwest::Client;

    let prompt = match request_type.as_str() {
        "translate" => format!(
            "请将以下技能文档翻译成中文，保持原有的格式和结构。技能名称：{}\n\n内容：\n{}",
            skill_name, skill_content
        ),
        "summarize" => format!(
            "请用中文总结以下技能的主要功能和使用场景，控制在 300 字以内。技能名称：{}\n\n内容：\n{}",
            skill_name, skill_content
        ),
        _ => return Err("Invalid request type".to_string()),
    };

    let client = Client::new();

    let body = serde_json::json!({
        "model": model_id,
        "messages": [
            {
                "role": "system",
                "content": "你是一个专业的技术文档助手，擅长翻译和总结技术文档。"
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    });

    let response = client
        .post(&endpoint)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request failed: {}", e))?;

    let status = response.status();
    let json: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    if !status.is_success() {
        return Err(format!("API error ({}): {:?}", status, json));
    }

    let content = {
        let choices: &Vec<serde_json::Value> = match json.get("choices") {
            Some(c) => match c.as_array() {
                Some(arr) => arr,
                None => return Err("choices is not an array".to_string()),
            },
            None => return Err("No choices in response".to_string()),
        };
        let first_choice: &serde_json::Value = match choices.get(0) {
            Some(c) => c,
            None => return Err("No first choice".to_string()),
        };
        let message: &serde_json::Value = match first_choice.get("message") {
            Some(m) => m,
            None => return Err("No message in choice".to_string()),
        };
        let content_value: &serde_json::Value = match message.get("content") {
            Some(c) => c,
            None => return Err("No content in message".to_string()),
        };
        match content_value.as_str() {
            Some(s) => s.to_string(),
            None => return Err("content is not a string".to_string()),
        }
    };

    Ok(content)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![scan_skills, ai_request])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
