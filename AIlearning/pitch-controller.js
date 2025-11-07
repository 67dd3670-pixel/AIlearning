/**
 * 动态语调控制器
 * 用于处理文本朗读中的语调变化和重音识别
 */
class PitchController {
    constructor() {
        // 重要词汇列表
        this.importantWords = [
            'important', 'significant', 'crucial', 'essential', 'vital',
            'primary', 'major', 'key', 'main', 'principal', 'critical',
            'fundamental', 'necessary', 'required', 'mandatory', 'imperative'
        ];

        // 情感词汇
        this.emotionalWords = {
            positive: ['amazing', 'wonderful', 'excellent', 'fantastic', 'great', 'good', 'beautiful'],
            negative: ['terrible', 'awful', 'horrible', 'bad', 'worst', 'disgusting', 'hate']
        };

        // 动词强调列表
        this.emphasizableVerbs = [
            'achieve', 'accomplish', 'create', 'destroy', 'build', 'break',
            'discover', 'invent', 'develop', 'improve', 'change', 'transform'
        ];

        // 默认语调设置
        this.defaultSettings = {
            basePitch: 1.0,
            questionPitch: 1.1,
            exclamationPitch: 1.2,
            emphasisPitch: 1.15,
            importantWordPitch: 1.1,
            emotionalPitch: 1.05
        };
    }

    /**
     * 分析文本并返回语调建议
     * @param {string} text - 文本内容
     * @returns {Object} - 语调分析结果
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
            overallSentiment: this.detectOverallSentiment(text)
        };
    }

    /**
     * 分析单个句子的语调需求
     * @param {string} sentence - 句子文本
     * @returns {Object} - 句子分析结果
     */
    analyzeSentence(sentence) {
        const words = sentence.split(' ');
        const basePitch = this.getSentenceBasePitch(sentence);
        const wordPitches = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase().replace(/[^\w]/g, '');
            const pitch = this.calculateWordPitch(word, words, i);
            wordPitches.push(pitch);
        }

        return {
            text: sentence,
            type: this.detectSentenceType(sentence),
            basePitch: basePitch,
            wordPitches: wordPitches,
            emphasizedWords: this.findEmphasizedWords(sentence)
        };
    }

    /**
     * 检测句子类型
     * @param {string} sentence - 句子文本
     * @returns {string} - 句子类型
     */
    detectSentenceType(sentence) {
        const trimmed = sentence.trim();

        if (trimmed.endsWith('?')) {
            return 'question';
        } else if (trimmed.endsWith('!')) {
            return 'exclamation';
        } else {
            return 'statement';
        }
    }

    /**
     * 获取句子的基础语调
     * @param {string} sentence - 句子文本
     * @returns {number} - 基础语调值
     */
    getSentenceBasePitch(sentence) {
        const type = this.detectSentenceType(sentence);

        switch (type) {
            case 'question':
                return this.defaultSettings.questionPitch;
            case 'exclamation':
                return this.defaultSettings.exclamationPitch;
            default:
                return this.defaultSettings.basePitch;
        }
    }

    /**
     * 计算单词的语调
     * @param {string} word - 单词
     * @param {Array} allWords - 所有单词
     * @param {number} index - 单词索引
     * @returns {number} - 语调值
     */
    calculateWordPitch(word, allWords, index) {
        let pitch = this.defaultSettings.basePitch;

        // 检查是否是重要词汇
        if (this.importantWords.includes(word)) {
            pitch = Math.max(pitch, this.defaultSettings.importantWordPitch);
        }

        // 检查是否是情感词汇
        for (const [sentiment, words] of Object.entries(this.emotionalWords)) {
            if (words.includes(word)) {
                pitch = Math.max(pitch, this.defaultSettings.emotionalPitch);
                break;
            }
        }

        // 检查是否是强调动词
        if (this.emphasizableVerbs.includes(word)) {
            pitch = Math.max(pitch, this.defaultSettings.emphasisPitch);
        }

        // 检查是否需要强调（全大写或重复字母）
        if (this.shouldEmphasize(word, allWords[index])) {
            pitch = Math.max(pitch, this.defaultSettings.emphasisPitch);
        }

        // 位置调整：句子末尾稍微降低语调
        if (index === allWords.length - 1) {
            pitch *= 0.95;
        }

        return pitch;
    }

    /**
     * 判断单词是否需要强调
     * @param {string} word - 单词
     * @param {string} originalWord - 原始单词（包含标点）
     * @returns {boolean} - 是否需要强调
     */
    shouldEmphasize(word, originalWord) {
        // 全大写单词需要强调
        if (originalWord === originalWord.toUpperCase() && originalWord.length > 1) {
            return true;
        }

        // 包含重复字母的单词（如 "sooooo"）
        if (/(.)\1{2,}/.test(originalWord)) {
            return true;
        }

        // 包含强调符号的单词
        if (originalWord.includes('*') || originalWord.includes('_')) {
            return true;
        }

        return false;
    }

    /**
     * 查找句子中需要强调的单词
     * @param {string} sentence - 句子文本
     * @returns {Array} - 需要强调的单词数组
     */
    findEmphasizedWords(sentence) {
        const words = sentence.split(' ');
        const emphasized = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase().replace(/[^\w]/g, '');

            if (this.importantWords.includes(word) ||
                this.emphasizableVerbs.includes(word) ||
                this.shouldEmphasize(word, words[i])) {
                emphasized.push({
                    word: words[i],
                    index: i,
                    reason: this.getEmphasisReason(word, words[i])
                });
            }
        }

        return emphasized;
    }

    /**
     * 获取强调原因
     * @param {string} word - 清理后的单词
     * @param {string} originalWord - 原始单词
     * @returns {string} - 强调原因
     */
    getEmphasisReason(word, originalWord) {
        if (this.importantWords.includes(word)) {
            return 'important_word';
        } else if (this.emphasizableVerbs.includes(word)) {
            return 'emphasizable_verb';
        } else if (originalWord === originalWord.toUpperCase()) {
            return 'uppercase';
        } else if (/(.)\1{2,}/.test(originalWord)) {
            return 'repeated_letters';
        } else {
            return 'other';
        }
    }

    /**
     * 检测整体情感倾向
     * @param {string} text - 文本内容
     * @returns {string} - 情感倾向
     */
    detectOverallSentiment(text) {
        const words = text.toLowerCase().split(' ');
        let positiveScore = 0;
        let negativeScore = 0;

        for (const word of words) {
            const cleanWord = word.replace(/[^\w]/g, '');

            if (this.emotionalWords.positive.includes(cleanWord)) {
                positiveScore++;
            } else if (this.emotionalWords.negative.includes(cleanWord)) {
                negativeScore++;
            }
        }

        if (positiveScore > negativeScore) {
            return 'positive';
        } else if (negativeScore > positiveScore) {
            return 'negative';
        } else {
            return 'neutral';
        }
    }

    /**
     * 提取句子
     * @param {string} text - 文本内容
     * @returns {Array} - 句子数组
     */
    extractSentences(text) {
        // 简单的句子分割，处理常见的句子结束符
        return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    }

    /**
     * 生成SSML语调标记
     * @param {string} text - 文本内容
     * @returns {string} - SSML格式的文本
     */
    generateSSML(text) {
        const analysis = this.analyzeText(text);
        let ssml = '<speak>';

        for (const sentence of analysis.sentences) {
            const words = sentence.text.split(' ');

            ssml += `<prosody rate="0.8" pitch="${sentence.basePitch}">`;

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');

                if (this.shouldEmphasize(cleanWord, word)) {
                    ssml += `<emphasis level="strong">${word}</emphasis>`;
                } else {
                    ssml += word;
                }

                if (i < words.length - 1) {
                    ssml += ' ';
                }
            }

            ssml += '</prosody> ';
        }

        ssml += '</speak>';
        return ssml;
    }

    /**
     * 获取语音合成参数
     * @param {string} text - 文本内容
     * @returns {Object} - 语音合成参数
     */
    getSpeechParameters(text) {
        const analysis = this.analyzeText(text);

        return {
            pitch: analysis.sentences[0]?.basePitch || this.defaultSettings.basePitch,
            rate: 0.8, // 标准语速
            volume: 1.0,
            analysis: analysis
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PitchController;
} else {
    window.PitchController = PitchController;
}