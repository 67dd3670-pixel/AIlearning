/**
 * 高级TTS控制器
 * 整合所有优化功能，提供智能文本朗读体验
 */
class AdvancedTTSController {
    constructor() {
        // 初始化各个组件
        this.pauseController = new PauseController();
        this.pitchController = new PitchController();
        this.speedController = new SpeedController();
        this.textAnalyzer = new TextAnalyzer();
        this.specialCharsProcessor = new SpecialCharsProcessor();
        this.ssmlGenerator = new SSMLGenerator();

        // 当前状态
        this.isPlaying = false;
        this.isPaused = false;
        this.currentUtterance = null;
        this.currentSettings = this.loadSettings();

        // 语音合成设置
        this.voiceSettings = {
            language: 'en-US',
            voice: null,
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0
        };

        // 初始化语音
        this.initializeVoices();
    }

    /**
     * 初始化语音
     */
    initializeVoices() {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                const voices = speechSynthesis.getVoices();
                // 优先选择英文语音
                this.voiceSettings.voice = voices.find(voice =>
                    voice.lang.includes('en-US') && voice.localService
                ) || voices.find(voice =>
                    voice.lang.includes('en')
                ) || voices[0];
            };

            loadVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = loadVoices;
            }
        }
    }

    /**
     * 朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 选项参数
     * @returns {Promise} - 朗读完成的Promise
     */
    async speak(text, options = {}) {
        if (this.isPlaying) {
            this.stop();
        }

        this.isPlaying = true;
        this.isPaused = false;

        try {
            // 合并选项
            const mergedOptions = { ...this.currentSettings, ...options };

            // 智能处理文本
            const processedText = this.processText(text, mergedOptions);

            // 根据浏览器支持情况选择朗读方式
            if (this.supportsSSML()) {
                return await this.speakWithSSML(processedText, mergedOptions);
            } else {
                return await this.speakWithWebSpeech(processedText, mergedOptions);
            }
        } catch (error) {
            console.error('TTS Error:', error);
            this.isPlaying = false;
            throw error;
        }
    }

    /**
     * 智能处理文本
     * @param {string} text - 原始文本
     * @param {Object} options - 选项参数
     * @returns {Object} - 处理结果
     */
    processText(text, options) {
        let processed = text;

        // 特殊字符处理
        const specialCharsResult = this.specialCharsProcessor.processSmart(text);
        processed = specialCharsResult.processed;

        // 文本分析
        const textAnalysis = this.textAnalyzer.analyze(processed);

        // 智能停顿处理
        const pauseProcessed = this.pauseController.processText(processed);
        const segments = this.pauseController.splitIntoSegments(pauseProcessed);

        // 语调分析
        const pitchAnalysis = this.pitchController.analyzeText(processed);

        // 语速分析
        const speedAnalysis = this.speedController.analyzeText(processed);

        // 重音分析
        const emphasisAnalysis = this.pitchController.analyzeText(processed);

        return {
            original: text,
            processed: processed,
            segments: segments,
            analysis: {
                text: textAnalysis,
                pitch: pitchAnalysis,
                speed: speedAnalysis,
                emphasis: emphasisAnalysis,
                specialChars: specialCharsResult
            },
            options: options
        };
    }

    /**
     * 使用SSML朗读
     * @param {Object} processedText - 处理后的文本
     * @param {Object} options - 选项参数
     * @returns {Promise} - 朗读完成的Promise
     */
    async speakWithSSML(processedText, options) {
        const ssml = this.ssmlGenerator.generateSSML(processedText.processed, {
            rate: options.rate || this.voiceSettings.rate,
            pitch: options.pitch || this.voiceSettings.pitch,
            volume: options.volume || this.voiceSettings.volume
        });

        // 验证SSML
        const validation = this.ssmlGenerator.validateSSML(ssml);
        if (!validation.isValid) {
            console.warn('SSML validation warnings:', validation.warnings);
            console.error('SSML validation errors:', validation.errors);
            // 回退到Web Speech API
            return await this.speakWithWebSpeech(processedText, options);
        }

        // 如果浏览器支持SSML，使用SSML
        if (window.speechSynthesis && window.SpeechSynthesisUtterance) {
            try {
                // 创建utterance
                const utterance = new SpeechSynthesisUtterance(processedText.processed);

                // 配置语音参数
                this.configureUtterance(utterance, processedText, options);

                // 应用SSML效果（通过参数调整模拟）
                this.applySSMLEffects(utterance, processedText);

                return await this.executeUtterance(utterance);
            } catch (error) {
                console.warn('SSML not fully supported, falling back to Web Speech API');
                return await this.speakWithWebSpeech(processedText, options);
            }
        } else {
            return await this.speakWithWebSpeech(processedText, options);
        }
    }

    /**
     * 使用Web Speech API朗读
     * @param {Object} processedText - 处理后的文本
     * @param {Object} options - 选项参数
     * @returns {Promise} - 朗读完成的Promise
     */
    async speakWithWebSpeech(processedText, options) {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            // 处理停顿分段朗读
            this.speakWithPauses(processedText.segments, resolve, reject);
        });
    }

    /**
     * 带停顿的朗读
     * @param {Array} segments - 文本片段数组
     * @param {Function} resolve - Promise resolve
     * @param {Function} reject - Promise reject
     */
    speakWithPauses(segments, resolve, reject) {
        let currentIndex = 0;

        const speakNextSegment = () => {
            if (!this.isPlaying || currentIndex >= segments.length) {
                this.isPlaying = false;
                resolve();
                return;
            }

            const segment = segments[currentIndex];
            currentIndex++;

            if (segment.type === 'pause') {
                // 停顿
                setTimeout(speakNextSegment, segment.duration);
            } else if (segment.type === 'text' && segment.content.trim()) {
                // 朗读文本
                const utterance = new SpeechSynthesisUtterance(segment.content.trim());

                // 配置语音参数
                this.configureUtterance(utterance, {
                    processed: segment.content,
                    analysis: this.getBasicAnalysis(segment.content)
                }, {});

                utterance.onend = speakNextSegment;
                utterance.onerror = (event) => {
                    console.error('Speech synthesis error:', event.error);
                    speakNextSegment(); // 继续下一个片段
                };

                try {
                    speechSynthesis.speak(utterance);
                } catch (error) {
                    console.error('Error speaking segment:', error);
                    speakNextSegment();
                }
            } else {
                speakNextSegment();
            }
        };

        speakNextSegment();
    }

    /**
     * 配置语音合成参数
     * @param {SpeechSynthesisUtterance} utterance - 语音合成对象
     * @param {Object} processedText - 处理后的文本
     * @param {Object} options - 选项参数
     */
    configureUtterance(utterance, processedText, options) {
        // 基础设置
        utterance.lang = this.voiceSettings.language;
        utterance.volume = options.volume || this.voiceSettings.volume;

        // 智能语速调整
        const speedParams = this.speedController.getOptimizedParameters(
            processedText.processed || processedText,
            options.type || 'sentence'
        );
        utterance.rate = speedParams.rate;

        // 智能语调调整
        const pitchParams = this.pitchController.getSpeechParameters(
            processedText.processed || processedText
        );
        utterance.pitch = pitchParams.pitch;

        // 设置语音
        if (this.voiceSettings.voice) {
            utterance.voice = this.voiceSettings.voice;
        }

        // 事件监听
        utterance.onstart = () => {
            this.onSpeechStart && this.onSpeechStart(processedText.original);
        };

        utterance.onend = () => {
            this.onSpeechEnd && this.onSpeechEnd(processedText.original);
        };

        utterance.onerror = (event) => {
            this.onSpeechError && this.onSpeechError(event.error, processedText.original);
        };
    }

    /**
     * 应用SSML效果（通过参数调整模拟）
     * @param {SpeechSynthesisUtterance} utterance - 语音合成对象
     * @param {Object} processedText - 处理后的文本
     */
    applySSMLEffects(utterance, processedText) {
        const analysis = processedText.analysis;

        // 应用重音效果
        if (analysis.emphasis && analysis.emphasis.sentences) {
            const avgPitch = analysis.emphasis.sentences.reduce((sum, s) => {
                return sum + (s.recommendedPitch || 1.0);
            }, 0) / analysis.emphasis.sentences.length;

            utterance.pitch = Math.max(0.5, Math.min(2.0, avgPitch));
        }

        // 根据文本复杂度调整语速
        if (analysis.text && analysis.text.complexity) {
            const complexity = analysis.text.complexity.level;
            if (complexity === 'high') {
                utterance.rate *= 0.9;
            } else if (complexity === 'low') {
                utterance.rate *= 1.05;
            }
        }
    }

    /**
     * 执行语音合成
     * @param {SpeechSynthesisUtterance} utterance - 语音合成对象
     * @returns {Promise} - 朗读完成的Promise
     */
    executeUtterance(utterance) {
        return new Promise((resolve, reject) => {
            utterance.onend = () => {
                this.isPlaying = false;
                resolve();
            };

            utterance.onerror = (event) => {
                this.isPlaying = false;
                reject(new Error(`Speech synthesis error: ${event.error}`));
            };

            speechSynthesis.speak(utterance);
        });
    }

    /**
     * 暂停朗读
     * @returns {boolean} - 暂停是否成功
     */
    pause() {
        if (this.isPlaying && !this.isPaused) {
            speechSynthesis.pause();
            this.isPaused = true;
            this.onSpeechPause && this.onSpeechPause();
            return true;
        }
        return false;
    }

    /**
     * 继续朗读
     * @returns {boolean} - 恢复是否成功
     */
    resume() {
        if (this.isPaused) {
            speechSynthesis.resume();
            this.isPaused = false;
            this.onSpeechResume && this.onSpeechResume();
            return true;
        }
        return false;
    }

    /**
     * 停止朗读
     * @returns {boolean} - 停止是否成功
     */
    stop() {
        if (!this.isPlaying) {
            return false;
        }

        this.isPlaying = false;
        this.isPaused = false;

        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }

        this.onSpeechStop && this.onSpeechStop();
        return true;
    }

    /**
     * 获取当前播放状态
     * @returns {Object} - 播放状态信息
     */
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            canPause: this.isPlaying && !this.isPaused,
            canResume: this.isPlaying && this.isPaused,
            canStop: this.isPlaying
        };
    }

    /**
     * 检查是否支持SSML
     * @returns {boolean} - 是否支持SSML
     */
    supportsSSML() {
        // 大多数浏览器不完全支持SSML，返回false使用增强版Web Speech API
        return false;
    }

    /**
     * 获取基本文本分析
     * @param {string} text - 文本内容
     * @returns {Object} - 基本分析
     */
    getBasicAnalysis(text) {
        return {
            text: this.textAnalyzer.analyze(text),
            pitch: this.pitchController.analyzeText(text),
            speed: this.speedController.analyzeText(text)
        };
    }

    /**
     * 设置语音参数
     * @param {Object} settings - 语音设置
     */
    setVoiceSettings(settings) {
        this.voiceSettings = { ...this.voiceSettings, ...settings };
        this.saveSettings(this.voiceSettings);
    }

    /**
     * 获取语音设置
     * @returns {Object} - 语音设置
     */
    getVoiceSettings() {
        return { ...this.voiceSettings };
    }

    /**
     * 获取可用的语音列表
     * @returns {Array} - 语音列表
     */
    getAvailableVoices() {
        if ('speechSynthesis' in window) {
            return speechSynthesis.getVoices();
        }
        return [];
    }

    /**
     * 保存设置到本地存储
     * @param {Object} settings - 设置对象
     */
    saveSettings(settings) {
        try {
            localStorage.setItem('ttsSettings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Failed to save TTS settings:', error);
        }
    }

    /**
     * 从本地存储加载设置
     * @returns {Object} - 设置对象
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('ttsSettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Failed to load TTS settings:', error);
        }

        return {
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0,
            language: 'en-US'
        };
    }

    /**
     * 事件处理器
     */
    onSpeechStart(text) {
        console.log('Speech started:', text.substring(0, 50) + '...');
    }

    onSpeechEnd(text) {
        console.log('Speech ended:', text.substring(0, 50) + '...');
    }

    onSpeechError(error, text) {
        console.error('Speech error:', error, 'Text:', text);
    }

    onSpeechPause() {
        console.log('Speech paused');
    }

    onSpeechResume() {
        console.log('Speech resumed');
    }

    onSpeechStop() {
        console.log('Speech stopped');
    }

    /**
     * 设置事件处理器
     * @param {Object} handlers - 事件处理器对象
     */
    setEventHandlers(handlers) {
        if (handlers.onSpeechStart) this.onSpeechStart = handlers.onSpeechStart;
        if (handlers.onSpeechEnd) this.onSpeechEnd = handlers.onSpeechEnd;
        if (handlers.onSpeechError) this.onSpeechError = handlers.onSpeechError;
        if (handlers.onSpeechPause) this.onSpeechPause = handlers.onSpeechPause;
        if (handlers.onSpeechResume) this.onSpeechResume = handlers.onSpeechResume;
        if (handlers.onSpeechStop) this.onSpeechStop = handlers.onSpeechStop;
    }

    /**
     * 获取系统状态
     * @returns {Object} - 系统状态
     */
    getSystemStatus() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            supportsSpeechSynthesis: 'speechSynthesis' in window,
            supportsSSML: this.supportsSSML(),
            availableVoices: this.getAvailableVoices().length,
            currentVoice: this.voiceSettings.voice?.name || 'default',
            settings: this.getVoiceSettings()
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedTTSController;
} else {
    window.AdvancedTTSController = AdvancedTTSController;
}