/**
 * 文本分析器
 * 用于智能分析文本结构、句子类型和语法特征
 */
class TextAnalyzer {
    constructor() {
        // 句子类型模式
        this.sentencePatterns = {
            question: /\?$/,
            exclamation: /!$/,
            statement: /\.$/
        };

        // 疑问词模式
        this.questionPatterns = {
            wh: /^(what|when|where|why|who|how|which|whose|whom)\b/i,
            yesNo: /^(is|are|was|were|do|does|did|can|could|will|would|should|may|might|must|have|has|had)\b/i,
            tag: /,\s*(isn't|aren't|wasn't|weren't|don't|doesn't|didn't|won't|wouldn't|shouldn't|can't|couldn't)\b/i
        };

        // 缩写模式
        this.abbreviationPatterns = {
            common: /\b(mr|mrs|ms|dr|prof|sr|jr|st|ave|blvd|rd|ct|ln|pl)\b\.?/gi,
            academic: /\b(ph\.d\.|m\.a\.|b\.a\.|b\.s\.|m\.s\.)\b/gi,
            time: /\b(a\.m\.|p\.m\.|am|pm)\b/gi,
            latin: /\b(e\.g\.|i\.e\.|etc\.|vs\.|et al\.)\b/gi
        };

        // 数字和日期模式
        this.numberPatterns = {
            integer: /\b\d+\b/g,
            decimal: /\b\d+\.\d+\b/g,
            percentage: /\b\d+(\.\d+)?%\b/g,
            money: /\$\d+(\.\d{2})?/g,
            year: /\b(19|20)\d{2}\b/g,
            date: /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
            phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
        };

        // 标点符号规则
        this.punctuationRules = {
            sentenceEnd: /[.!?]+/,
            comma: /,/,
            semicolon: /;/,
            colon: /:/,
            dash: /[-—]/,
            parenthesis: /[()]/,
            quotation: /[""]/
        };
    }

    /**
     * 综合分析文本
     * @param {string} text - 文本内容
     * @returns {Object} - 综合分析结果
     */
    analyze(text) {
        return {
            basicInfo: this.getBasicInfo(text),
            sentences: this.analyzeSentences(text),
            vocabulary: this.analyzeVocabulary(text),
            numbers: this.analyzeNumbers(text),
            abbreviations: this.analyzeAbbreviations(text),
            complexity: this.assessComplexity(text),
            readability: this.assessReadability(text)
        };
    }

    /**
     * 获取基本信息
     * @param {string} text - 文本内容
     * @returns {Object} - 基本信息
     */
    getBasicInfo(text) {
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = this.extractSentences(text);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

        return {
            characterCount: characters,
            characterCountNoSpaces: charactersNoSpaces,
            wordCount: words.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            averageWordsPerSentence: words.length / sentences.length,
            averageCharactersPerWord: charactersNoSpaces / words.length
        };
    }

    /**
     * 分析句子结构
     * @param {string} text - 文本内容
     * @returns {Array} - 句子分析数组
     */
    analyzeSentences(text) {
        const sentences = this.extractSentences(text);
        const analysis = [];

        for (const sentence of sentences) {
            const sentenceAnalysis = this.analyzeSentence(sentence);
            analysis.push(sentenceAnalysis);
        }

        return analysis;
    }

    /**
     * 分析单个句子
     * @param {string} sentence - 句子文本
     * @returns {Object} - 句子分析结果
     */
    analyzeSentence(sentence) {
        const trimmed = sentence.trim();
        const words = trimmed.split(/\s+/).filter(w => w.length > 0);

        return {
            text: trimmed,
            type: this.detectSentenceType(trimmed),
            questionType: this.detectQuestionType(trimmed),
            wordCount: words.length,
            characterCount: trimmed.length,
            startsWithCapital: /^[A-Z]/.test(trimmed),
            endsWithPunctuation: /[.!?]$/.test(trimmed),
            hasQuotation: /[""].*[""]/.test(trimmed),
            hasParenthesis: /[()]/.test(trimmed),
            hasNumbers: /\d/.test(trimmed),
            firstWord: words[0] || '',
            lastWord: words[words.length - 1] || '',
            punctuation: this.extractPunctuation(trimmed),
            clauses: this.identifyClauses(trimmed)
        };
    }

    /**
     * 检测句子类型
     * @param {string} sentence - 句子文本
     * @returns {string} - 句子类型
     */
    detectSentenceType(sentence) {
        if (this.sentencePatterns.question.test(sentence)) {
            return 'question';
        } else if (this.sentencePatterns.exclamation.test(sentence)) {
            return 'exclamation';
        } else if (this.sentencePatterns.statement.test(sentence)) {
            return 'statement';
        } else {
            return 'fragment';
        }
    }

    /**
     * 检测疑问句类型
     * @param {string} sentence - 句子文本
     * @returns {string|null} - 疑问句类型
     */
    detectQuestionType(sentence) {
        if (this.questionPatterns.wh.test(sentence)) {
            return 'wh_question';
        } else if (this.questionPatterns.yesNo.test(sentence)) {
            return 'yes_no_question';
        } else if (this.questionPatterns.tag.test(sentence)) {
            return 'tag_question';
        }
        return null;
    }

    /**
     * 分析词汇特征
     * @param {string} text - 文本内容
     * @returns {Object} - 词汇分析结果
     */
    analyzeVocabulary(text) {
        const words = text.toLowerCase().split(/\s+/)
            .map(w => w.replace(/[^\w]/g, ''))
            .filter(w => w.length > 0);

        const wordFrequency = {};
        for (const word of words) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }

        const uniqueWords = Object.keys(wordFrequency).length;
        const averageFrequency = words.length / uniqueWords;

        return {
            totalWords: words.length,
            uniqueWords: uniqueWords,
            vocabularyRichness: uniqueWords / words.length,
            averageWordFrequency: averageFrequency,
            wordFrequency: wordFrequency,
            longestWords: this.findLongestWords(words),
            mostFrequentWords: this.findMostFrequentWords(wordFrequency, 10)
        };
    }

    /**
     * 分析数字和日期
     * @param {string} text - 文本内容
     * @returns {Object} - 数字分析结果
     */
    analyzeNumbers(text) {
        const numbers = {
            integers: this.extractMatches(text, this.numberPatterns.integer),
            decimals: this.extractMatches(text, this.numberPatterns.decimal),
            percentages: this.extractMatches(text, this.numberPatterns.percentage),
            money: this.extractMatches(text, this.numberPatterns.money),
            years: this.extractMatches(text, this.numberPatterns.year),
            dates: this.extractMatches(text, this.numberPatterns.date),
            phones: this.extractMatches(text, this.numberPatterns.phone)
        };

        return {
            ...numbers,
            hasNumbers: Object.values(numbers).some(arr => arr.length > 0),
            totalNumbers: Object.values(numbers).reduce((sum, arr) => sum + arr.length, 0)
        };
    }

    /**
     * 分析缩写
     * @param {string} text - 文本内容
     * @returns {Object} - 缩写分析结果
     */
    analyzeAbbreviations(text) {
        const abbreviations = {
            common: this.extractMatches(text, this.abbreviationPatterns.common),
            academic: this.extractMatches(text, this.abbreviationPatterns.academic),
            time: this.extractMatches(text, this.abbreviationPatterns.time),
            latin: this.extractMatches(text, this.abbreviationPatterns.latin)
        };

        return {
            ...abbreviations,
            hasAbbreviations: Object.values(abbreviations).some(arr => arr.length > 0),
            totalAbbreviations: Object.values(abbreviations).reduce((sum, arr) => sum + arr.length, 0)
        };
    }

    /**
     * 评估文本复杂度
     * @param {string} text - 文本内容
     * @returns {Object} - 复杂度评估
     */
    assessComplexity(text) {
        const basicInfo = this.getBasicInfo(text);
        const sentences = this.analyzeSentences(text);
        const vocabulary = this.analyzeVocabulary(text);

        // 计算复杂度指标
        const avgWordsPerSentence = basicInfo.averageWordsPerSentence;
        const avgCharsPerWord = basicInfo.averageCharactersPerWord;
        const vocabularyRichness = vocabulary.vocabularyRichness;

        let complexityScore = 0;

        // 基于句子长度
        if (avgWordsPerSentence > 20) complexityScore += 2;
        else if (avgWordsPerSentence > 15) complexityScore += 1;

        // 基于词汇复杂度
        if (avgCharsPerWord > 5) complexityScore += 2;
        else if (avgCharsPerWord > 4.5) complexityScore += 1;

        // 基于词汇丰富度
        if (vocabularyRichness > 0.7) complexityScore += 2;
        else if (vocabularyRichness > 0.6) complexityScore += 1;

        // 基于句子结构多样性
        const sentenceTypes = new Set(sentences.map(s => s.type));
        if (sentenceTypes.size > 2) complexityScore += 1;

        // 基于特殊结构
        const complexSentences = sentences.filter(s =>
            s.hasQuotation || s.hasParenthesis || s.clauses.length > 1
        ).length;
        if (complexSentences > sentences.length * 0.3) complexityScore += 1;

        let complexityLevel;
        if (complexityScore >= 7) complexityLevel = 'very_high';
        else if (complexityScore >= 5) complexityLevel = 'high';
        else if (complexityScore >= 3) complexityLevel = 'medium';
        else complexityLevel = 'low';

        return {
            score: complexityScore,
            level: complexityLevel,
            factors: {
                avgWordsPerSentence,
                avgCharsPerWord,
                vocabularyRichness,
                sentenceTypeDiversity: sentenceTypes.size,
                complexSentenceRatio: complexSentences / sentences.length
            }
        };
    }

    /**
     * 评估可读性
     * @param {string} text - 文本内容
     * @returns {Object} - 可读性评估
     */
    assessReadability(text) {
        const basicInfo = this.getBasicInfo(text);
        const sentences = this.analyzeSentences(text);

        // 计算 Flesch Reading Ease
        const avgSentenceLength = basicInfo.averageWordsPerSentence;
        const avgSyllablesPerWord = this.estimateAverageSyllables(text);

        const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

        let readingLevel;
        if (fleschScore >= 90) readingLevel = 'very_easy';
        else if (fleschScore >= 80) readingLevel = 'easy';
        else if (fleschScore >= 70) readingLevel = 'fairly_easy';
        else if (fleschScore >= 60) readingLevel = 'standard';
        else if (fleschScore >= 50) readingLevel = 'fairly_difficult';
        else if (fleschScore >= 30) readingLevel = 'difficult';
        else readingLevel = 'very_difficult';

        return {
            fleschScore: Math.round(fleschScore),
            readingLevel: readingLevel,
            estimatedReadingTime: Math.round(basicInfo.wordCount / 200) // 假设每分钟200词
        };
    }

    /**
     * 估算平均音节数
     * @param {string} text - 文本内容
     * @returns {number} - 平均音节数
     */
    estimateAverageSyllables(text) {
        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        let totalSyllables = 0;

        for (const word of words) {
            totalSyllables += this.countSyllables(word);
        }

        return words.length > 0 ? totalSyllables / words.length : 0;
    }

    /**
     * 计算单词音节数（简化版本）
     * @param {string} word - 单词
     * @returns {number} - 音节数
     */
    countSyllables(word) {
        const cleanWord = word.replace(/[^\w]/g, '');
        if (cleanWord.length <= 3) return 1;

        const vowels = 'aeiouy';
        let count = 0;
        let prevCharWasVowel = false;

        for (let i = 0; i < cleanWord.length; i++) {
            const char = cleanWord[i];
            const isVowel = vowels.includes(char);

            if (isVowel && !prevCharWasVowel) {
                count++;
            }

            prevCharWasVowel = isVowel;
        }

        // 处理以e结尾的情况
        if (cleanWord.endsWith('e') && count > 1) {
            count--;
        }

        return Math.max(1, count);
    }

    /**
     * 识别从句
     * @param {string} sentence - 句子文本
     * @returns {Array} - 从句数组
     */
    identifyClauses(sentence) {
        const clauses = [];
        const subordinatingConjunctions = [
            'because', 'since', 'as', 'although', 'though', 'while', 'if',
            'unless', 'until', 'when', 'whenever', 'where', 'wherever'
        ];

        const words = sentence.split(' ');
        let currentClause = '';
        let clauseCount = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i].toLowerCase();
            currentClause += words[i] + ' ';

            // 检查是否为从属连词
            if (subordinatingConjunctions.includes(word.replace(/[^\w]/g, ''))) {
                if (currentClause.trim().length > 0) {
                    clauses.push({
                        text: currentClause.trim(),
                        type: 'subordinate',
                        index: clauseCount++
                    });
                    currentClause = '';
                }
            }
        }

        // 添加剩余的主句
        if (currentClause.trim().length > 0) {
            clauses.push({
                text: currentClause.trim(),
                type: 'main',
                index: clauseCount
            });
        }

        return clauses;
    }

    /**
     * 提取标点符号
     * @param {string} sentence - 句子文本
     * @returns {Object} - 标点符号统计
     */
    extractPunctuation(sentence) {
        const punctuation = {
            commas: (sentence.match(/,/g) || []).length,
            semicolons: (sentence.match(/;/g) || []).length,
            colons: (sentence.match(/:/g) || []).length,
            dashes: (sentence.match(/[-—]/g) || []).length,
            parentheses: (sentence.match(/[()]/g) || []).length,
            quotations: (sentence.match(/[""]/g) || []).length
        };

        return {
            ...punctuation,
            total: Object.values(punctuation).reduce((sum, count) => sum + count, 0)
        };
    }

    /**
     * 查找最长单词
     * @param {Array} words - 单词数组
     * @returns {Array} - 最长单词数组
     */
    findLongestWords(words) {
        const maxLength = Math.max(...words.map(w => w.length));
        return words.filter(w => w.length === maxLength);
    }

    /**
     * 查找最频繁词汇
     * @param {Object} wordFrequency - 词频对象
     * @param {number} count - 返回数量
     * @returns {Array} - 最频繁词汇数组
     */
    findMostFrequentWords(wordFrequency, count) {
        return Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, count)
            .map(([word, frequency]) => ({ word, frequency }));
    }

    /**
     * 提取匹配项
     * @param {string} text - 文本内容
     * @param {RegExp} pattern - 正则表达式
     * @returns {Array} - 匹配项数组
     */
    extractMatches(text, pattern) {
        const matches = [];
        let match;
        while ((match = pattern.exec(text)) !== null) {
            matches.push(match[0]);
        }
        return matches;
    }

    /**
     * 提取句子
     * @param {string} text - 文本内容
     * @returns {Array} - 句子数组
     */
    extractSentences(text) {
        return text.split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextAnalyzer;
} else {
    window.TextAnalyzer = TextAnalyzer;
}