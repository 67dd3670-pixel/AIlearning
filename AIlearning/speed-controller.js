/**
 * 语速控制器
 * 用于智能调节文本朗读的语速
 */
class SpeedController {
    constructor() {
        // 默认语速设置
        this.defaultSettings = {
            baseRate: 0.8, // 基础语速（比原来的0.9更慢）
            wordRate: 0.8, // 单词朗读语速
            sentenceRate: 0.85, // 句子朗读语速
            longWordThreshold: 7, // 长单词阈值
            shortWordThreshold: 3, // 短单词阈值
            minRate: 0.5, // 最小语速
            maxRate: 1.2, // 最大语速
            sentenceEndSlowdown: 0.9, // 句子末尾减速系数
            commaSlowdown: 0.95, // 逗号后减速系数
        };

        // 特殊词汇的语速调整
        this.specialWords = {
            // 需要慢速朗读的重要词汇
            slow: [
                'important', 'significant', 'crucial', 'essential', 'vital',
                'necessary', 'required', 'fundamental', 'critical', 'primary',
                'however', 'therefore', 'moreover', 'furthermore', 'nevertheless'
            ],
            // 可以快速朗读的常用词汇
            fast: [
                'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
                'of', 'with', 'by', 'from', 'about', 'as', 'is', 'was', 'are', 'were'
            ]
        };

        // 数字和日期的语速处理
        this.numberPatterns = {
            year: /\b(19|20)\d{2}\b/,
            number: /\b\d+(\.\d+)?\b/,
            percentage: /\b\d+(\.\d+)?%\b/,
            money: /\$\d+(\.\d{2})?/
        };
    }

    /**
     * 分析文本并计算语速
     * @param {string} text - 文本内容
     * @returns {Object} - 语速分析结果
     */
    analyzeText(text) {
        const words = text.split(' ');
        const wordSpeeds = [];

        for (let i = 0; i < words.length; i++) {
            const wordInfo = this.analyzeWord(words[i], i, words);
            wordSpeeds.push(wordInfo);
        }

        return {
            words: wordSpeeds,
            averageRate: this.calculateAverageRate(wordSpeeds),
            complexity: this.assessComplexity(text),
            estimatedDuration: this.estimateReadingTime(wordSpeeds)
        };
    }

    /**
     * 分析单个单词的语速
     * @param {string} word - 单词
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @returns {Object} - 单词语速信息
     */
    analyzeWord(word, index, allWords) {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
        let rate = this.defaultSettings.baseRate;

        // 基于单词长度调整语速
        const wordLength = cleanWord.length;
        if (wordLength >= this.defaultSettings.longWordThreshold) {
            rate *= 0.9; // 长单词减速
        } else if (wordLength <= this.defaultSettings.shortWordThreshold && wordLength > 0) {
            rate *= 1.05; // 短单词加速
        }

        // 基于特殊词汇调整语速
        if (this.specialWords.slow.includes(cleanWord)) {
            rate *= 0.85; // 重要词汇减速
        } else if (this.specialWords.fast.includes(cleanWord)) {
            rate *= 1.1; // 常用词汇加速
        }

        // 数字和特殊模式处理
        if (this.isNumber(word)) {
            rate *= 0.8; // 数字慢速朗读
        }

        // 基于位置调整语速
        rate = this.adjustRateByPosition(rate, index, allWords);

        // 确保语速在合理范围内
        rate = Math.max(this.defaultSettings.minRate,
                       Math.min(this.defaultSettings.maxRate, rate));

        return {
            word: word,
            cleanWord: cleanWord,
            rate: rate,
            index: index,
            length: wordLength,
            isNumber: this.isNumber(word),
            isSpecial: this.specialWords.slow.includes(cleanWord) ||
                       this.specialWords.fast.includes(cleanWord)
        };
    }

    /**
     * 检查是否为数字或包含数字
     * @param {string} word - 单词
     * @returns {boolean} - 是否为数字
     */
    isNumber(word) {
        return this.numberPatterns.year.test(word) ||
               this.numberPatterns.number.test(word) ||
               this.numberPatterns.percentage.test(word) ||
               this.numberPatterns.money.test(word);
    }

    /**
     * 基于单词在句子中的位置调整语速
     * @param {number} baseRate - 基础语速
     * @param {number} index - 单词索引
     * @param {Array} allWords - 所有单词
     * @returns {number} - 调整后的语速
     */
    adjustRateByPosition(baseRate, index, allWords) {
        const totalWords = allWords.length;
        const position = index / totalWords;

        // 句子末尾减速
        if (position > 0.8) {
            baseRate *= this.defaultSettings.sentenceEndSlowdown;
        }

        // 检查前面的标点符号
        if (index > 0) {
            const prevWord = allWords[index - 1];
            if (prevWord.includes(',')) {
                baseRate *= this.defaultSettings.commaSlowdown;
            }
        }

        return baseRate;
    }

    /**
     * 计算平均语速
     * @param {Array} wordSpeeds - 单词语速数组
     * @returns {number} - 平均语速
     */
    calculateAverageRate(wordSpeeds) {
        if (wordSpeeds.length === 0) return this.defaultSettings.baseRate;

        const sum = wordSpeeds.reduce((acc, word) => acc + word.rate, 0);
        return sum / wordSpeeds.length;
    }

    /**
     * 评估文本复杂度
     * @param {string} text - 文本内容
     * @returns {string} - 复杂度等级
     */
    assessComplexity(text) {
        const words = text.split(' ');
        const avgWordLength = words.reduce((sum, word) => {
            return sum + word.replace(/[^\w]/g, '').length;
        }, 0) / words.length;

        const longWords = words.filter(word =>
            word.replace(/[^\w]/g, '').length >= this.defaultSettings.longWordThreshold
        ).length;

        const complexityScore = (avgWordLength * 0.5) + (longWords / words.length * 0.5);

        if (complexityScore > 6) {
            return 'high';
        } else if (complexityScore > 4) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    /**
     * 估算朗读时间
     * @param {Array} wordSpeeds - 单词语速数组
     * @returns {number} - 估算时间（毫秒）
     */
    estimateReadingTime(wordSpeeds) {
        let totalTime = 0;

        for (const wordInfo of wordSpeeds) {
            // 基础单词时间（每个单词约400ms）除以语速
            const wordTime = 400 / wordInfo.rate;
            totalTime += wordTime;
        }

        return totalTime;
    }

    /**
     * 获取优化的语音参数
     * @param {string} text - 文本内容
     * @param {string} type - 文本类型 ('word' | 'sentence' | 'paragraph')
     * @returns {Object} - 语音参数
     */
    getOptimizedParameters(text, type = 'sentence') {
        const analysis = this.analyzeText(text);
        let baseRate = this.defaultSettings.baseRate;

        // 根据文本类型调整基础语速
        switch (type) {
            case 'word':
                baseRate = this.defaultSettings.wordRate;
                break;
            case 'sentence':
                baseRate = this.defaultSettings.sentenceRate;
                break;
            case 'paragraph':
                baseRate = this.defaultSettings.baseRate;
                break;
        }

        // 根据复杂度调整
        const complexity = analysis.complexity;
        if (complexity === 'high') {
            baseRate *= 0.9;
        } else if (complexity === 'low') {
            baseRate *= 1.05;
        }

        return {
            rate: Math.max(this.defaultSettings.minRate,
                          Math.min(this.defaultSettings.maxRate, baseRate)),
            volume: 1.0,
            pitch: 1.0,
            analysis: analysis,
            estimatedDuration: analysis.estimatedDuration
        };
    }

    /**
     * 为语音合成 utterance 设置参数
     * @param {SpeechSynthesisUtterance} utterance - 语音合成对象
     * @param {string} text - 文本内容
     * @param {string} type - 文本类型
     */
    configureUtterance(utterance, text, type = 'sentence') {
        const params = this.getOptimizedParameters(text, type);

        utterance.rate = params.rate;
        utterance.volume = params.volume;
        utterance.pitch = params.pitch;

        // 如果是重要内容，调整语速
        if (this.containsImportantWords(text)) {
            utterance.rate *= 0.9;
        }

        return utterance;
    }

    /**
     * 检查文本是否包含重要词汇
     * @param {string} text - 文本内容
     * @returns {boolean} - 是否包含重要词汇
     */
    containsImportantWords(text) {
        const words = text.toLowerCase().split(' ');
        return words.some(word =>
            this.specialWords.slow.includes(word.replace(/[^\w]/g, ''))
        );
    }

    /**
     * 生成动态语速配置
     * @param {string} text - 文本内容
     * @returns {Array} - 语速配置数组
     */
    generateSpeedProfile(text) {
        const analysis = this.analyzeText(text);
        const profile = [];

        for (const wordInfo of analysis.words) {
            profile.push({
                word: wordInfo.word,
                rate: wordInfo.rate,
                startTime: wordInfo.startTime || 0,
                duration: wordInfo.duration || 0
            });
        }

        return profile;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeedController;
} else {
    window.SpeedController = SpeedController;
}