/**
 * 统一语音合成管理器
 * 用于协调不同的TTS系统，避免语音合成冲突
 */
class SpeechManager {
    constructor() {
        // 语音队列
        this.speechQueue = [];
        this.isProcessing = false;

        // 当前播放信息
        this.currentUtterance = null;
        this.currentSource = null; // 'paragraph' 或 'word'

        // 回调函数
        this.onStateChange = null;

        // 初始化
        this.initialize();
    }

    /**
     * 初始化语音管理器
     */
    initialize() {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported');
            return;
        }

        // 监听语音状态变化
        this.monitorSpeechStatus();
    }

    /**
     * 监听语音状态
     */
    monitorSpeechStatus() {
        setInterval(() => {
            if (this.speechQueue.length > 0 && !this.isProcessing) {
                this.processQueue();
            }
        }, 100);
    }

    /**
     * 添加语音到队列
     * @param {string} text - 要朗读的文本
     * @param {string} source - 语音来源 ('paragraph' 或 'word')
     * @param {Object} options - 选项参数
     * @returns {Promise} - 朗读完成的Promise
     */
    addSpeech(text, source, options = {}) {
        return new Promise((resolve, reject) => {
            // 验证参数
            if (!text || typeof text !== 'string') {
                reject(new Error('Invalid text parameter'));
                return;
            }

            // 如果是高优先级请求（如单词朗读），取消当前播放
            if (source === 'word' && this.currentUtterance) {
                speechSynthesis.cancel();
                this.speechQueue = []; // 清空队列
                this.isProcessing = false;
            }

            // 添加到队列
            const speechItem = {
                text: text,
                source: source,
                options: options,
                priority: source === 'word' ? 1 : 0, // 单词朗读优先级更高
                resolve: resolve,
                reject: reject,
                timestamp: Date.now()
            };

            // 按优先级插入队列
            if (source === 'word') {
                this.speechQueue.unshift(speechItem);
            } else {
                this.speechQueue.push(speechItem);
            }

            console.log(`Added speech to queue (${source}):`, text.substring(0, 30) + '...');
            this.notifyStateChange();
        });
    }

    /**
     * 处理语音队列
     */
    async processQueue() {
        if (this.isProcessing || this.speechQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        try {
            while (this.speechQueue.length > 0) {
                const speechItem = this.speechQueue.shift();

                try {
                    await this.speakText(speechItem);
                    speechItem.resolve();
                } catch (error) {
                    speechItem.reject(error);
                }
            }
        } finally {
            this.isProcessing = false;
            this.notifyStateChange();
        }
    }

    /**
     * 朗读文本
     * @param {Object} speechItem - 语音项目
     */
    speakText(speechItem) {
        return new Promise((resolve, reject) => {
            const utterance = new SpeechSynthesisUtterance(speechItem.text);

            // 设置语音参数
            utterance.lang = speechItem.options.lang || 'en-US';
            utterance.rate = speechItem.options.rate || 0.8;
            utterance.pitch = speechItem.options.pitch || 1.0;
            utterance.volume = speechItem.options.volume || 1.0;

            // 设置当前播放信息
            this.currentUtterance = utterance;
            this.currentSource = speechItem.source;

            // 事件监听器
            utterance.onstart = () => {
                console.log(`Speech started (${speechItem.source}):`, speechItem.text.substring(0, 30) + '...');
                this.notifyStateChange();
            };

            utterance.onend = () => {
                console.log(`Speech completed (${speechItem.source}):`, speechItem.text.substring(0, 30) + '...');
                this.currentUtterance = null;
                this.currentSource = null;
                this.notifyStateChange();
                resolve();
            };

            utterance.onerror = (event) => {
                // 处理中断错误
                if (event.error === 'interrupted') {
                    console.log(`Speech interrupted (${speechItem.source}):`, speechItem.text.substring(0, 30) + '...');
                    // 中断是正常情况，不触发错误，直接解决Promise
                    this.currentUtterance = null;
                    this.currentSource = null;
                    this.notifyStateChange();
                    resolve(); // 中断也是正常完成，直接resolve
                } else {
                    // 其他错误才拒绝Promise
                    console.error(`Speech error (${speechItem.source}):`, event.error, 'Text:', speechItem.text);
                    this.currentUtterance = null;
                    this.currentSource = null;
                    this.notifyStateChange();
                    reject(new Error(`Speech synthesis error: ${event.error}`));
                }
            };

            // 开始朗读
            try {
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Error starting speech:', error);
                reject(error);
            }
        });
    }

    /**
     * 停止当前语音
     */
    stop() {
        if (this.currentUtterance) {
            speechSynthesis.cancel();
            this.currentUtterance = null;
            this.currentSource = null;
            this.speechQueue = [];
            this.isProcessing = false;
            this.notifyStateChange();
            console.log('Speech stopped');
            return true;
        }
        return false;
    }

    /**
     * 暂停当前语音
     */
    pause() {
        if (speechSynthesis.speaking) {
            speechSynthesis.pause();
            this.notifyStateChange();
            return true;
        }
        return false;
    }

    /**
     * 恢复语音
     */
    resume() {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
            this.notifyStateChange();
            return true;
        }
        return false;
    }

    /**
     * 获取当前状态
     * @returns {Object} - 当前状态
     */
    getStatus() {
        return {
            isProcessing: this.isProcessing,
            isSpeaking: speechSynthesis.speaking,
            isPaused: speechSynthesis.paused,
            currentSource: this.currentSource,
            queueLength: this.speechQueue.length,
            queueItems: this.speechQueue.map(item => ({
                text: item.text.substring(0, 30) + '...',
                source: item.source,
                priority: item.priority
            }))
        };
    }

    /**
     * 设置状态变化回调
     * @param {Function} callback - 回调函数
     */
    onStateChange(callback) {
        this.onStateChange = callback;
    }

    /**
     * 通知状态变化
     */
    notifyStateChange() {
        if (this.onStateChange) {
            this.onStateChange(this.getStatus());
        }
    }

    /**
     * 检查语音合成支持
     * @returns {boolean} - 是否支持
     */
    isSupported() {
        return 'speechSynthesis' in window;
    }
}

// 创建全局实例
window.speechManager = new SpeechManager();

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpeechManager;
}