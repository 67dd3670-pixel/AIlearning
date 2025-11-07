/**
 * 重音识别控制器
 * 用于识别文本中需要重音强调的词汇和短语
 */
class EmphasisController {
    constructor() {
        // 重要词汇分类
        this.importantCategories = {
            // 学术词汇
            academic: [
                'theory', 'hypothesis', 'thesis', 'research', 'study', 'analysis',
                'concept', 'principle', 'methodology', 'framework', 'paradigm'
            ],
            // 商业词汇
            business: [
                'strategy', 'objective', 'goal', 'target', 'profit', 'revenue',
                'market', 'customer', 'client', 'product', 'service'
            ],
            // 技术词汇
            technical: [
                'algorithm', 'function', 'variable', 'parameter', 'database',
                'application', 'system', 'network', 'protocol', 'interface'
            ],
            // 情感词汇
            emotional: [
                'amazing', 'wonderful', 'terrible', 'awful', 'fantastic',
                'horrible', 'excellent', 'disgusting', 'brilliant', 'pathetic'
            ],
            // 程度词汇
            intensity: [
                'very', 'extremely', 'absolutely', 'completely', 'totally',
                'entirely', 'quite', 'rather', 'somewhat', 'slightly'
            ],
            // 重要动词
            verbs: [
                'achieve', 'accomplish', 'create', 'destroy', 'develop',
                'discover', 'innovate', 'transform', 'revolutionize', 'establish'
            ]
        };

        // 需要强调的语法结构
        this.grammarPatterns = {
            // 对比结构
            contrast: [
                /not only.*but also/i,
                /both.*and/i,
                /neither.*nor/i,
                /either.*or/i
            ],
            // 因果结构
            causation: [
                /because.*therefore/i,
                /since.*consequently/i,
                /as a result/i,
                /due to/i
            ],
            // 条件结构
            conditional: [
                /if.*then/i,
                /unless/i,
                /provided that/i,
                /in case/i
            ]
        };

        // 重音级别
        this.emphasisLevels = {
            low: 1.05,
            medium: 1.1,
            high: 1.15,
            critical: 1.2
        };

        // 词性模式
        this.posPatterns = {
            noun: /\b(the|a|an)\s+([a-zA-Z]+)\s+(is|are|was|were)\b/gi,
            adjective: /\b(is|are|was|were)\s+([a-zA-Z]+)\s+(noun|thing|idea)\b/gi,
            adverb: /\b([a-zA-Z]+)ly\b/gi
        };
    }

    /**
     * 分析文本并识别重音词汇
     * @param {string} text - 文本内容
     * @returns {Object} - 重音分析结果
     */
    analyzeText(text) {
        const sentences = this.extractSentences(text);
        const analysis = [];

        for (const sentence of sentences) {
            const sentenceAnalysis = this.analyzeSentence(sentence);
            analysis.push(sentenceAnalysis);
        }

        return {
            sentences: analysis,
            summary: this.generateSummary(analysis),
            emphasisScore: this.calculateEmphasisScore(analysis)
        };
    }

    /**
     * 分析单个句子的重音需求
     * @param {string} sentence - 句子文本
     * @returns {Object} - 句子重音分析
     */
    analyzeSentence(sentence) {
        const words = sentence.split(' ');
        const emphasisWords = [];
        const grammarStructures = this.detectGrammarStructures(sentence);

        for (let i = 0; i < words.length; i++) {
            const wordAnalysis = this.analyzeWord(words[i], i, words);
            if (wordAnalysis.shouldEmphasize) {
                emphasisWords.push(wordAnalysis);
            }
        }

        return {
            text: sentence,
            emphasisWords: emphasisWords,
            grammarStructures: grammarStructures,
            overallEmphasis: this.calculateSentenceEmphasis(emphasisWords),
            recommendedPitch: this.calculateRecommendedPitch(emphasisWords)
        };
    }

    /**
     * 分析单个单词的重音需求
     * @param {string} word - 单词
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @returns {Object} - 单词重音分析
     */
    analyzeWord(word, index, allWords) {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        let shouldEmphasize = false;
        let emphasisLevel = 'low';
        let reason = '';
        let pitchMultiplier = 1.0;

        // 检查是否是重要词汇
        const category = this.getWordCategory(cleanWord);
        if (category) {
            shouldEmphasize = true;
            emphasisLevel = this.getCategoryEmphasisLevel(category);
            reason = `important_${category}_word`;
            pitchMultiplier = this.emphasisLevels[emphasisLevel];
        }

        // 检查格式强调（全大写、重复字母等）
        if (this.hasFormatEmphasis(word)) {
            shouldEmphasize = true;
            emphasisLevel = 'high';
            reason = reason ? `${reason}_format` : 'format_emphasis';
            pitchMultiplier = Math.max(pitchMultiplier, this.emphasisLevels.high);
        }

        // 检查位置强调（句首、句末等）
        if (this.hasPositionEmphasis(index, allWords.length)) {
            shouldEmphasize = true;
            emphasisLevel = 'medium';
            reason = reason ? `${reason}_position` : 'position_emphasis';
            pitchMultiplier = Math.max(pitchMultiplier, this.emphasisLevels.medium);
        }

        // 检查重复强调
        if (this.isRepeated(word, allWords, index)) {
            shouldEmphasize = true;
            emphasisLevel = 'medium';
            reason = reason ? `${reason}_repetition` : 'repetition_emphasis';
            pitchMultiplier = Math.max(pitchMultiplier, this.emphasisLevels.medium);
        }

        return {
            word: word,
            cleanWord: cleanWord,
            index: index,
            shouldEmphasize: shouldEmphasize,
            emphasisLevel: emphasisLevel,
            reason: reason,
            pitchMultiplier: pitchMultiplier,
            category: category
        };
    }

    /**
     * 获取词汇类别
     * @param {string} word - 单词
     * @returns {string|null} - 词汇类别
     */
    getWordCategory(word) {
        for (const [category, words] of Object.entries(this.importantCategories)) {
            if (words.includes(word)) {
                return category;
            }
        }
        return null;
    }

    /**
     * 获取类别的强调级别
     * @param {string} category - 类别
     * @returns {string} - 强调级别
     */
    getCategoryEmphasisLevel(category) {
        const levelMap = {
            academic: 'high',
            business: 'medium',
            technical: 'high',
            emotional: 'high',
            intensity: 'medium',
            verbs: 'medium'
        };

        return levelMap[category] || 'low';
    }

    /**
     * 检查是否有格式强调
     * @param {string} word - 单词
     * @returns {boolean} - 是否有格式强调
     */
    hasFormatEmphasis(word) {
        // 全大写
        if (word === word.toUpperCase() && word.length > 1) {
            return true;
        }

        // 重复字母
        if (/(.)\1{2,}/.test(word)) {
            return true;
        }

        // 特殊符号
        if (word.includes('*') || word.includes('_') || word.includes('!')) {
            return true;
        }

        return false;
    }

    /**
     * 检查是否有位置强调
     * @param {number} index - 单词索引
     * @param {number} totalLength - 总长度
     * @returns {boolean} - 是否有位置强调
     */
    hasPositionEmphasis(index, totalLength) {
        // 句首单词
        if (index === 0) {
            return true;
        }

        // 句末单词
        if (index === totalLength - 1) {
            return true;
        }

        // 句子前1/3位置的重要单词
        if (index < totalLength * 0.3) {
            return true;
        }

        return false;
    }

    /**
     * 检查是否是重复词汇
     * @param {string} word - 单词
     * @param {Array} allWords - 所有单词
     * @param {number} currentIndex - 当前索引
     * @returns {boolean} - 是否是重复
     */
    isRepeated(word, allWords, currentIndex) {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        const searchWindow = 5; // 搜索前5个单词

        for (let i = Math.max(0, currentIndex - searchWindow); i < currentIndex; i++) {
            const prevCleanWord = allWords[i].toLowerCase().replace(/[^\w]/g, '');
            if (prevCleanWord === cleanWord) {
                return true;
            }
        }

        return false;
    }

    /**
     * 检测语法结构
     * @param {string} sentence - 句子文本
     * @returns {Array} - 语法结构数组
     */
    detectGrammarStructures(sentence) {
        const structures = [];

        for (const [type, patterns] of Object.entries(this.grammarPatterns)) {
            for (const pattern of patterns) {
                if (pattern.test(sentence)) {
                    structures.push({
                        type: type,
                        pattern: pattern,
                        match: sentence.match(pattern)
                    });
                }
            }
        }

        return structures;
    }

    /**
     * 计算句子的整体强调程度
     * @param {Array} emphasisWords - 重音词汇数组
     * @returns {string} - 整体强调程度
     */
    calculateSentenceEmphasis(emphasisWords) {
        if (emphasisWords.length === 0) return 'none';

        const highCount = emphasisWords.filter(w => w.emphasisLevel === 'high').length;
        const mediumCount = emphasisWords.filter(w => w.emphasisLevel === 'medium').length;

        if (highCount > 2) return 'very_high';
        if (highCount > 0 || mediumCount > 2) return 'high';
        if (mediumCount > 0) return 'medium';
        return 'low';
    }

    /**
     * 计算推荐的音调
     * @param {Array} emphasisWords - 重音词汇数组
     * @returns {number} - 推荐音调
     */
    calculateRecommendedPitch(emphasisWords) {
        if (emphasisWords.length === 0) return 1.0;

        const avgPitch = emphasisWords.reduce((sum, word) => {
            return sum + word.pitchMultiplier;
        }, 0) / emphasisWords.length;

        return Math.min(1.3, Math.max(1.0, avgPitch));
    }

    /**
     * 生成分析摘要
     * @param {Array} sentencesAnalysis - 句子分析数组
     * @returns {Object} - 分析摘要
     */
    generateSummary(sentencesAnalysis) {
        const totalWords = sentencesAnalysis.reduce((sum, s) => sum + s.text.split(' ').length, 0);
        const totalEmphasisWords = sentencesAnalysis.reduce((sum, s) => sum + s.emphasisWords.length, 0);
        const avgEmphasisPerSentence = totalEmphasisWords / sentencesAnalysis.length;

        return {
            totalWords: totalWords,
            totalEmphasisWords: totalEmphasisWords,
            emphasisRatio: totalEmphasisWords / totalWords,
            avgEmphasisPerSentence: avgEmphasisPerSentence,
            mostEmphasizedSentences: sentencesAnalysis
                .filter(s => s.overallEmphasis === 'very_high' || s.overallEmphasis === 'high')
                .map(s => s.text)
        };
    }

    /**
     * 计算整体强调分数
     * @param {Array} sentencesAnalysis - 句子分析数组
     * @returns {number} - 强调分数
     */
    calculateEmphasisScore(sentencesAnalysis) {
        let totalScore = 0;
        let totalWords = 0;

        for (const sentence of sentencesAnalysis) {
            const wordCount = sentence.text.split(' ').length;
            const sentenceScore = sentence.emphasisWords.reduce((sum, word) => {
                const levelScore = {
                    low: 1,
                    medium: 2,
                    high: 3,
                    critical: 4
                };
                return sum + levelScore[word.emphasisLevel];
            }, 0);

            totalScore += sentenceScore;
            totalWords += wordCount;
        }

        return totalWords > 0 ? totalScore / totalWords : 0;
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
     * 生成SSML强调标记
     * @param {string} text - 文本内容
     * @returns {string} - SSML格式文本
     */
    generateSSML(text) {
        const analysis = this.analyzeText(text);
        let ssml = '<speak>';

        for (const sentence of analysis.sentences) {
            const words = sentence.text.split(' ');

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const emphasisWord = sentence.emphasisWords.find(e => e.index === i);

                if (emphasisWord) {
                    const level = emphasisWord.emphasisLevel === 'high' ? 'strong' : 'moderate';
                    ssml += `<emphasis level="${level}">${word}</emphasis>`;
                } else {
                    ssml += word;
                }

                if (i < words.length - 1) {
                    ssml += ' ';
                }
            }

            ssml += ' ';
        }

        ssml += '</speak>';
        return ssml;
    }

    /**
     * 获取语音合成参数
     * @param {string} text - 文本内容
     * @returns {Object} - 语音参数
     */
    getSpeechParameters(text) {
        const analysis = this.analyzeText(text);

        return {
            basePitch: 1.0,
            emphasisPitch: analysis.sentences.length > 0 ?
                analysis.sentences[0].recommendedPitch : 1.0,
            emphasisWords: analysis.sentences.reduce((acc, s) => acc.concat(s.emphasisWords), []),
            analysis: analysis
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmphasisController;
} else {
    window.EmphasisController = EmphasisController;
}