/**
 * 智能停顿控制器
 * 用于处理文本朗读中的智能停顿
 */
class PauseController {
    constructor() {
        this.pausePatterns = {
            // 句子结束停顿 (600ms)
            sentenceEnd: /[.!?]+\s*/,
            // 逗号停顿 (300ms)
            comma: /[,;]\s*/,
            // 冒号停顿 (400ms)
            colon: /[:]\s*/,
            // 段落停顿 (800ms)
            paragraph: /\n\s*\n/,
            // 括号停顿 (200ms)
            bracket: /[[(][^)\]]*[)\]]/,
        };

        this.pauseDurations = {
            sentenceEnd: 600,
            comma: 300,
            colon: 400,
            paragraph: 800,
            bracket: 200,
        };
    }

    /**
     * 处理文本，添加停顿标记
     * @param {string} text - 原始文本
     * @returns {string} - 处理后的文本
     */
    processText(text) {
        let processed = text;

        // 标准化空白字符
        processed = processed.replace(/\s+/g, ' ');
        processed = processed.replace(/\n+/g, ' ');

        // 添加段落停顿
        processed = processed.replace(this.pausePatterns.paragraph, ' ||PAUSE800|| ');

        // 添加句子结束停顿
        processed = processed.replace(this.pausePatterns.sentenceEnd, match => match + '||PAUSE600||');

        // 添加冒号停顿
        processed = processed.replace(this.pausePatterns.colon, match => match + '||PAUSE400||');

        // 添加逗号停顿
        processed = processed.replace(this.pausePatterns.comma, match => match + '||PAUSE300||');

        // 处理括号内容
        processed = processed.replace(this.pausePatterns.bracket, match => '||PAUSE200||' + match + '||PAUSE200||');

        // 清理多余空格
        processed = processed.replace(/\s+/g, ' ');
        processed = processed.trim();

        return processed;
    }

    /**
     * 将处理后的文本分割成片段数组
     * @param {string} processedText - 处理后的文本
     * @returns {Array} - 文本片段数组
     */
    splitIntoSegments(processedText) {
        const segments = processedText.split('||');
        const result = [];

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i].trim();
            if (segment) {
                if (segment.startsWith('PAUSE')) {
                    const duration = parseInt(segment.replace('PAUSE', ''));
                    result.push({ type: 'pause', duration });
                } else {
                    result.push({ type: 'text', content: segment });
                }
            }
        }

        return result;
    }

    /**
     * 获取停顿持续时间
     * @param {string} pauseType - 停顿类型
     * @returns {number} - 停顿持续时间（毫秒）
     */
    getPauseDuration(pauseType) {
        return this.pauseDurations[pauseType] || 300;
    }

    /**
     * 检测句子类型并返回建议的停顿时间
     * @param {string} sentence - 句子文本
     * @returns {number} - 建议的停顿时间
     */
    detectSentenceType(sentence) {
        const trimmed = sentence.trim();

        if (trimmed.endsWith('?')) {
            return 700; // 疑问句稍长停顿
        } else if (trimmed.endsWith('!')) {
            return 800; // 感叹句更长停顿
        } else if (trimmed.endsWith('.')) {
            return 600; // 陈述句标准停顿
        }

        return 400; // 其他情况默认停顿
    }

    /**
     * 为文本片段数组添加朗读时间
     * @param {Array} segments - 文本片段数组
     * @returns {Array} - 带有时间信息的片段数组
     */
    addTimingInfo(segments) {
        const result = [];
        let currentTime = 0;

        for (const segment of segments) {
            if (segment.type === 'text') {
                // 估算文本朗读时间 (基于平均语速)
                const wordCount = segment.content.split(' ').length;
                const estimatedDuration = wordCount * 400; // 平均每个单词400ms

                result.push({
                    ...segment,
                    startTime: currentTime,
                    estimatedDuration: estimatedDuration
                });

                currentTime += estimatedDuration;
            } else if (segment.type === 'pause') {
                result.push({
                    ...segment,
                    startTime: currentTime
                });

                currentTime += segment.duration;
            }
        }

        return result;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PauseController;
} else {
    window.PauseController = PauseController;
}