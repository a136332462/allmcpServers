import path from 'path'
import fs from 'fs'
import {promises as fsPromises} from 'fs'

// 简单拼音转换表（基础版）
const pinyinMap = {
    a: ['a', 'ā', 'á', 'ǎ', 'à'],
    ai: ['ai', 'āi', 'ái', 'ǎi', 'ài'],
    // 其他拼音映射可根据需要扩展
}
// 同义词映射
const synonymMap = {
    'ai': ['ai', 'artificial intelligence'],
    'mcp': ['mcp', 'model context protocol'],
    // 其他同义词...
}

// 分词和预处理
function preprocessText(text) {
    if (!text) return []
    return text
        .toLowerCase()
        .split(/[\s\-_,.;]+/)
        .filter(token => token.length > 0)
}

// 扩展同义词
function expandSynonyms(keywords) {
    return keywords.flatMap(keyword =>
        synonymMap[keyword] ? [keyword, ...synonymMap[keyword]] : [keyword]
    )
}

// 检查拼音匹配
function checkPinyinMatch(text, keyword) {
    const pinyinVariations = pinyinMap[keyword] || [keyword]
    return pinyinVariations.some(py => text.includes(py))
}

const resourceCache = new Map()

// 文件路径常量
const DATA_DIR = path.join(process.cwd(), 'data', 'json')
const ALL_RESOURCES_FILE = path.join(DATA_DIR, 'all.json')
const NEW_RESOURCES_FILE = path.join(DATA_DIR, 'new-url.json')


// 主搜索函数
export function searchResources(resources, query) {
    if (!query.trim()) return []

    // 预处理查询关键词
    const keywords = preprocessText(query)
    const expandedKeywords = expandSynonyms(keywords)
    const combinedPhrase = query.trim().toLowerCase()

    // 新增：相关性排序
    const scored = resources.map(resource => {
        const name = (resource.name || '').toLowerCase()
        const desc = (resource.description || '').toLowerCase()

        let score = 0

        // 1. 完全短语连续匹配标题
        if (name.includes(combinedPhrase)) score += 100

        // 2. 标题分词全部包含
        if (keywords.every(k => name.includes(k))) score += 50

        // 3. 描述分词全部包含
        if (keywords.every(k => desc.includes(k))) score += 30

        // 4. 标题分词部分包含
        const partialNameHits = keywords.filter(k => name.includes(k)).length
        if (partialNameHits > 0) score += partialNameHits * 10

        // 5. 描述分词部分包含
        const partialDescHits = keywords.filter(k => desc.includes(k)).length
        if (partialDescHits > 0) score += partialDescHits * 2

        // 6. 扩展同义词匹配
        expandedKeywords.forEach(keyword => {
            if (name.includes(keyword)) score += 5
            if (desc.includes(keyword)) score += 1
        })

        // 7. 拼音等特殊匹配
        if (checkPinyinMatch(name, combinedPhrase) || checkPinyinMatch(desc, combinedPhrase)) score += 8

        return {...resource, _score: score}
    })
    // 过滤掉所有0分的
    const filtered = scored.filter(r => r._score > 0)
    // 按分数降序排列
    filtered.sort((a, b) => b._score - a._score)

    return filtered
}

// 高亮关键词
// 在 highlightMatches 函数中修改高亮样式
export function highlightMatches(text, query) {
    if (!text || !query) return text;

    const keywords = preprocessText(query);
    let highlighted = text;

    keywords.forEach(keyword => {
        const regex = new RegExp(`(${keyword})`, 'gi');
        highlighted = highlighted.replace(
            regex,
            // 使用 span 标签并添加样式
            '<span class="highlight bg-[#fff7cc] text-[#333129] rounded px-1 py-0.5 inline-block">$1</span>'
        );
    });

    return highlighted;
}




// 分类名称映射
export const getCategoryName = (category) => {
    const names = {
        'featured': 'Featured',
        'latest': 'Last 3 days',
        'official': 'Official',
        'search': 'Search',
        'web-scraping': 'Web Scraping',
        'communication': 'Communication',
        'productivity': 'Productivity',
        'development': 'Development',
        'database': 'Database',
        'cloud-service': 'Cloud Service',
        'file-system': 'File System',
        'cloud-storage': 'Cloud Storage',
        'version-control': 'Version Control',
        'ai-ml': 'AI ML',
        'blockchain': 'Blockchain',
        'multimedia': 'Multimedia',
        'data-analysis': 'Data Analysis',
        'monitoring': 'Monitoring',
        'integration': 'Integration',
        'other': 'Other'
    }
    return names[category] || category
}

// 获取所有可用分类列表
export const getAllCategories = () => {
    return Object.keys(getCategoryName(''))
}

// 加载指定分类资源
export const loadResources = async (category = 'featured') => {
    // 检查缓存
    if (resourceCache.has(category)) {
        return resourceCache.get(category)
    }

    try {
        // 确定文件路径
        const filePath = path.join(DATA_DIR, `${category}.json`)

        // 检查文件是否存在
        try {
            await fsPromises.access(filePath, fs.constants.F_OK)
        } catch {
            console.warn(`Category file not found: ${filePath}`)
            return []
        }

        // 读取并解析文件
        const data = await fsPromises.readFile(filePath, 'utf8')
        const resources = JSON.parse(data)

        // 缓存结果
        resourceCache.set(category, resources)

        return resources
    } catch (error) {
        console.error(`Error loading resources for category ${category}:`, error)
        return []
    }
}

// 检查URL是否已存在（通过API）
export const checkIfUrlExists = async (url) => {
    try {
        const res = await fetch(`/api/check-resource-exists?url=${encodeURIComponent(url)}`)
        if (!res.ok) throw new Error('URL check failed')
        const data = await res.json()
        return data.exists
    } catch (error) {
        console.error('Error checking URL existence:', error)
        return false
    }
}

// 保存新资源
export const saveNewResource = async (resource) => {
    try {
        // 读取现有新资源
        const newData = await readJsonFile(NEW_RESOURCES_FILE)

        // 添加新资源
        const updatedData = [
            ...newData,
            {
                ...resource,
                category: 'new-url',
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            }
        ]

        // 写回文件
        await writeJsonFile(NEW_RESOURCES_FILE, updatedData)

        // 清除缓存
        resourceCache.delete('new-url')
    } catch (error) {
        console.error('Error saving new resource:', error)
        throw error
    }
}

// 辅助函数：读取JSON文件
const readJsonFile = async (filePath) => {
    try {
        await fsPromises.access(filePath, fs.constants.F_OK)
        const data = await fsPromises.readFile(filePath, 'utf8')
        return JSON.parse(data)
    } catch {
        return []
    }
}

// 辅助函数：写入JSON文件
const writeJsonFile = async (filePath, data) => {
    await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2))
}

// 资源验证
export const validateResource = (resource) => {
    if (!resource.name || !resource.description || !resource.url) {
        return { valid: false, message: 'Missing required fields' }
    }

    if (!resource.url.startsWith('https://github.com/')) {
        return { valid: false, message: 'Only GitHub resources are allowed (https://github.com/)' }
    }

    if (resource.icon && !resource.icon.startsWith('https://')) {
        return { valid: false, message: 'Icon URL must use HTTPS protocol' }
    }

    return { valid: true }
}