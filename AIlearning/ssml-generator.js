/**
 * SSML生成器
 * 用于生成语音合成标记语言，精确控制语音输出
 */
class SSMLGenerator {
    constructor() {
        // SSML命名空间
        this.namespace = 'http://www.w3.org/2001/10/synthesis';

        // 默认语音参数
        this.defaultParams = {
            language: 'en-US',
            voice: 'default',
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0,
            emphasis: 'moderate'
        };

        // 语调映射
        this.pitchMapping = {
            low: 0.8,
            medium: 1.0,
            high: 1.2,
            very_high: 1.4
        };

        // 语速映射
        this.rateMapping = {
            slow: 0.6,
            medium: 0.8,
            fast: 1.0,
            very_fast: 1.2
        };

        // 重音级别映射
        this.emphasisMapping = {
            none: '',
            reduced: 'reduced',
            moderate: 'moderate',
            strong: 'strong'
        };

        // 断句级别映射
        this.breakMapping = {
            none: 0,
            tiny: 100,
            small: 250,
            medium: 500,
            large: 750,
            x_large: 1000
        };
    }

    /**
     * 生成完整的SSML文档
     * @param {string} text - 输入文本
     * @param {Object} options - 选项参数
     * @returns {string} - SSML文档
     */
    generateSSML(text, options = {}) {
        const params = { ...this.defaultParams, ...options };

        // 预处理文本
        const processedText = this.preprocessText(text);

        // 分析文本
        const analysis = this.analyzeText(processedText);

        // 生成SSML内容
        let ssml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        ssml += `<speak xmlns="${this.namespace}" version="1.0" xml:lang="${params.language}">\n`;

        // 添加语音参数
        ssml += `  <voice name="${params.voice}">\n`;
        ssml += `    <prosody rate="${params.rate}" pitch="${params.pitch}" volume="${params.volume}">\n`;

        // 处理句子
        const sentences = this.extractSentences(processedText);
        for (const sentence of sentences) {
            const sentenceSSML = this.processSentence(sentence, analysis);
            ssml += `      ${sentenceSSML}\n`;
        }

        // 关闭标签
        ssml += `    </prosody>\n`;
        ssml += `  </voice>\n`;
        ssml += `</speak>`;

        return ssml;
    }

    /**
     * 预处理文本
     * @param {string} text - 原始文本
     * @returns {string} - 预处理后的文本
     */
    preprocessText(text) {
        let processed = text;

        // 标准化空白字符
        processed = processed.replace(/\s+/g, ' ');
        processed = processed.replace(/\n\s*\n/g, ' ||BREAK_LARGE|| ');
        processed = processed.replace(/\n/g, ' ||BREAK_MEDIUM|| ');

        // 处理标点符号
        processed = processed.replace(/[.!?]+/g, match => match + ' ||BREAK_LARGE||');
        processed = processed.replace(/[,;]/g, match => match + ' ||BREAK_MEDIUM||');
        processed = processed.replace(/[:]/g, match => match + ' ||BREAK_SMALL||');

        return processed.trim();
    }

    /**
     * 分析文本
     * @param {string} text - 文本内容
     * @returns {Object} - 分析结果
     */
    analyzeText(text) {
        return {
            sentences: this.extractSentences(text),
            words: text.split(/\s+/).filter(w => w.length > 0),
            questions: text.match(/\?/g) || [],
            exclamations: text.match(/!/g) || [],
            hasEmphasis: this.hasEmphasisWords(text),
            complexity: this.assessComplexity(text)
        };
    }

    /**
     * 处理单个句子
     * @param {string} sentence - 句子文本
     * @param {Object} analysis - 文本分析
     * @returns {string} - 句子SSML
     */
    processSentence(sentence, analysis) {
        let ssml = '';

        // 移除断句标记
        const cleanSentence = sentence.replace(/\|\|BREAK_\w+\|\|/g, '').trim();

        // 检测句子类型
        const sentenceType = this.detectSentenceType(cleanSentence);

        // 设置句子级别参数
        const sentenceParams = this.getSentenceParams(sentenceType, cleanSentence);

        // 添加句子容器
        ssml += `<s>`;

        // 处理单词和短语
        const words = cleanSentence.split(/\s+/);
        for (let i = 0; i < words.length; i++) {
            const wordSSML = this.processWord(words[i], i, words, sentenceParams);
            ssml += wordSSML;

            // 添加词间空格
            if (i < words.length - 1) {
                ssml += ' ';
            }
        }

        // 添加句子结束标记
        if (sentence.endsWith('?')) {
            ssml += ` <break time="${this.breakMapping.medium}ms"/>`;
        } else if (sentence.endsWith('!')) {
            ssml += ` <break time="${this.breakMapping.large}ms"/>`;
        } else {
            ssml += ` <break time="${this.breakMapping.large}ms"/>`;
        }

        ssml += `</s>`;

        return ssml;
    }

    /**
     * 处理单个单词
     * @param {string} word - 单词
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @param {Object} sentenceParams - 句子参数
     * @returns {string} - 单词SSML
     */
    processWord(word, index, allWords, sentenceParams) {
        let ssml = '';

        // 检查是否需要断句
        if (word.includes('||BREAK_')) {
            const breakMatch = word.match(/\|\|BREAK_(\w+)\|\|/);
            if (breakMatch) {
                const breakType = breakMatch[1].toLowerCase();
                const cleanWord = word.replace(/\|\|BREAK_\w+\|\|/g, '');

                if (cleanWord.trim()) {
                    ssml += this.processWord(cleanWord, index, allWords, sentenceParams);
                    ssml += ` `;
                }

                if (this.breakMapping[breakType]) {
                    ssml += `<break time="${this.breakMapping[breakType]}ms"/>`;
                }

                return ssml;
            }
        }

        const cleanWord = word.replace(/[^\w]/g, '');

        // 检查是否需要强调
        if (this.shouldEmphasize(word, cleanWord, index, allWords)) {
            const emphasisLevel = this.getEmphasisLevel(word, cleanWord);
            ssml += `<emphasis level="${this.emphasisMapping[emphasisLevel]}">${word}</emphasis>`;
        } else {
            ssml += word;
        }

        // 添加音调变化
        if (this.needsPitchChange(word, cleanWord, index, allWords)) {
            const pitch = this.getWordPitch(word, cleanWord, index, allWords);
            ssml = `<prosody pitch="${pitch}">${ssml}</prosody>`;
        }

        return ssml;
    }

    /**
     * 检测句子类型
     * @param {string} sentence - 句子文本
     * @returns {string} - 句子类型
     */
    detectSentenceType(sentence) {
        if (sentence.endsWith('?')) {
            return 'question';
        } else if (sentence.endsWith('!')) {
            return 'exclamation';
        } else {
            return 'statement';
        }
    }

    /**
     * 获取句子参数
     * @param {string} sentenceType - 句子类型
     * @param {string} sentence - 句子文本
     * @returns {Object} - 句子参数
     */
    getSentenceParams(sentenceType, sentence) {
        const params = {
            rate: this.defaultParams.rate,
            pitch: this.defaultParams.pitch,
            volume: this.defaultParams.volume
        };

        switch (sentenceType) {
            case 'question':
                params.pitch = 1.1;
                params.rate = 0.85;
                break;
            case 'exclamation':
                params.pitch = 1.2;
                params.volume = 1.1;
                break;
            default:
                params.pitch = 1.0;
                params.rate = 0.8;
                break;
        }

        return params;
    }

    /**
     * 检查是否需要强调
     * @param {string} word - 原始单词
     * @param {string} cleanWord - 清理后的单词
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @returns {boolean} - 是否需要强调
     */
    shouldEmphasize(word, cleanWord, index, allWords) {
        // 全大写单词
        if (word === word.toUpperCase() && word.length > 1) {
            return true;
        }

        // 重要词汇
        const importantWords = [
            'important', 'significant', 'crucial', 'essential', 'vital',
            'primary', 'major', 'key', 'main', 'critical', 'fundamental'
        ];

        if (importantWords.includes(cleanWord.toLowerCase())) {
            return true;
        }

        // 句首或句末单词
        if (index === 0 || index === allWords.length - 1) {
            return true;
        }

        // 包含强调符号
        if (word.includes('*') || word.includes('_') || word.includes('!')) {
            return true;
        }

        return false;
    }

    /**
     * 获取强调级别
     * @param {string} word - 原始单词
     * @param {string} cleanWord - 清理后的单词
     * @returns {string} - 强调级别
     */
    getEmphasisLevel(word, cleanWord) {
        // 全大写单词
        if (word === word.toUpperCase() && word.length > 1) {
            return 'strong';
        }

        // 重要词汇
        const veryImportantWords = ['critical', 'essential', 'vital', 'crucial'];
        if (veryImportantWords.includes(cleanWord.toLowerCase())) {
            return 'strong';
        }

        // 一般重要词汇
        const importantWords = ['important', 'significant', 'major', 'key'];
        if (importantWords.includes(cleanWord.toLowerCase())) {
            return 'moderate';
        }

        return 'moderate';
    }

    /**
     * 检查是否需要音调变化
     * @param {string} word - 原始单词
     * @param {string} cleanWord - 清理后的单词
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @returns {boolean} - 是否需要音调变化
     */
    needsPitchChange(word, cleanWord, index, allWords) {
        // 数字通常需要特殊音调
        if (/\d/.test(word)) {
            return true;
        }

        // 情感词汇
        const emotionalWords = ['amazing', 'wonderful', 'terrible', 'awful', 'fantastic'];
        if (emotionalWords.includes(cleanWord.toLowerCase())) {
            return true;
        }

        return false;
    }

    /**
     * 获取单词音调
     * @param {string} word - 原始单词
     * @param {string} cleanWord - 清理后的单词
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @returns {number} - 音调值
     */
    getWordPitch(word, cleanWord, index, allWords) {
        // 数字音调
        if (/\d/.test(word)) {
            return 0.9;
        }

        // 情感词汇音调
        const positiveWords = ['amazing', 'wonderful', 'fantastic', 'excellent'];
        const negativeWords = ['terrible', 'awful', 'horrible', 'disgusting'];

        if (positiveWords.includes(cleanWord.toLowerCase())) {
            return 1.2;
        } else if (negativeWords.includes(cleanWord.toLowerCase())) {
            return 0.8;
        }

        return 1.0;
    }

    /**
     * 检查是否包含强调词汇
     * @param {string} text - 文本内容
     * @returns {boolean} - 是否包含强调词汇
     */
    hasEmphasisWords(text) {
        const emphasisWords = [
            'important', 'significant', 'crucial', 'essential', 'vital',
            'amazing', 'wonderful', 'terrible', 'awful', 'fantastic'
        ];

        const words = text.toLowerCase().split(/\s+/);
        return words.some(word => emphasisWords.includes(word.replace(/[^\w]/g, '')));
    }

    /**
     * 评估复杂度
     * @param {string} text - 文本内容
     * @returns {string} - 复杂度级别
     */
    assessComplexity(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const avgWordLength = words.reduce((sum, word) => {
            return sum + word.replace(/[^\w]/g, '').length;
        }, 0) / words.length;

        if (avgWordLength > 6) {
            return 'high';
        } else if (avgWordLength > 4.5) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * 提取句子
     * @param {string} text - 文本内容
     * @returns {Array} - 句子数组
     */
    extractSentences(text) {
        return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    }

    /**
     * 生成简化的SSML（用于不支持完整SSML的浏览器）
     * @param {string} text - 文本内容
     * @returns {string} - 简化SSML
     */
    generateSimpleSSML(text) {
        const processed = this.preprocessText(text);
        const sentences = this.extractSentences(processed);

        let ssml = '<speak>';

        for (const sentence of sentences) {
            const cleanSentence = sentence.replace(/\|\|BREAK_\w+\|\|/g, '').trim();
            const sentenceType = this.detectSentenceType(cleanSentence);

            // 添加简单的prosody控制
            const pitch = sentenceType === 'question' ? '1.1' : '1.0';
            const rate = sentenceType === 'question' ? '0.85' : '0.8';

            ssml += `<prosody pitch="${pitch}" rate="${rate}">${cleanSentence}</prosody> `;
            ssml += `<break time="500ms"/>`;
        }

        ssml += '</speak>';
        return ssml;
    }

    /**
     * 验证SSML
     * @param {string} ssml - SSML内容
     * @returns {Object} - 验证结果
     */
    validateSSML(ssml) {
        const errors = [];
        const warnings = [];

        // 检查基本结构
        if (!ssml.includes('<speak>')) {
            errors.push('Missing <speak> tag');
        }

        if (!ssml.includes('</speak>')) {
            errors.push('Missing </speak> tag');
        }

        // 检查标签匹配
        const tagStack = [];
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
        let match;

        while ((match = tagRegex.exec(ssml)) !== null) {
            const tag = match[1];
            const isClosingTag = match[0].startsWith('</');

            if (isClosingTag) {
                if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tag) {
                    errors.push(`Mismatched closing tag: ${tag}`);
                } else {
                    tagStack.pop();
                }
            } else {
                if (!match[0].endsWith('/>')) {
                    tagStack.push(tag);
                }
            }
        }

        // 检查未关闭的标签
        for (const tag of tagStack) {
            errors.push(`Unclosed tag: ${tag}`);
        }

        // 检查参数有效性
        const rateRegex = /rate="([^"]+)"/g;
        while ((match = rateRegex.exec(ssml)) !== null) {
            const rate = parseFloat(match[1]);
            if (rate < 0.5 || rate > 2.0) {
                warnings.push(`Rate ${rate} may be outside optimal range (0.5-2.0)`);
            }
        }

        const pitchRegex = /pitch="([^"]+)"/g;
        while ((match = pitchRegex.exec(ssml)) !== null) {
            const pitch = parseFloat(match[1]);
            if (pitch < 0.5 || pitch > 2.0) {
                warnings.push(`Pitch ${pitch} may be outside optimal range (0.5-2.0)`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            warnings: warnings
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SSMLGenerator;
} else {
    window.SSMLGenerator = SSMLGenerator;
}