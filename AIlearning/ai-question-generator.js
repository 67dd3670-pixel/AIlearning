/**
 * AI题目生成器
 * 使用AI服务根据阅读内容自动生成阅读理解选择题
 */
class AIQuestionGenerator {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo'; // 可以使用 gpt-4 或 gpt-3.5-turbo
        this.cache = new Map(); // 题目缓存，避免重复生成
    }

    /**
     * 设置API密钥
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem('openai_api_key', apiKey);
    }

    /**
     * 生成阅读理解选择题
     * @param {string} text - 阅读文本
     * @param {number} count - 题目数量，默认3道
     * @returns {Promise<Array>} 题目数组
     */
    async generateQuestions(text, count = 3) {
        if (!text || text.trim().length === 0) {
            throw new Error('阅读文本不能为空');
        }

        // 检查缓存
        const cacheKey = this.getCacheKey(text, count);
        if (this.cache.has(cacheKey)) {
            console.log('从缓存中获取题目');
            return this.cache.get(cacheKey);
        }

        // 如果没有API密钥，使用模拟数据
        if (!this.apiKey || this.apiKey.trim() === '') {
            console.warn('未设置OpenAI API密钥，使用模拟题目');
            return this.generateMockQuestions(text, count);
        }

        try {
            const questions = await this.callOpenAI(text, count);
            // 缓存结果
            this.cache.set(cacheKey, questions);
            return questions;
        } catch (error) {
            console.error('AI生成题目失败，使用模拟题目:', error);
            return this.generateMockQuestions(text, count);
        }
    }

    /**
     * 调用OpenAI API
     */
    async callOpenAI(text, count) {
        const prompt = this.buildPrompt(text, count);

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert English teacher who creates reading comprehension questions based on English texts. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'API请求失败');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // 解析JSON响应
        try {
            const questions = JSON.parse(content);
            if (Array.isArray(questions)) {
                return this.validateQuestions(questions);
            } else if (questions.questions && Array.isArray(questions.questions)) {
                return this.validateQuestions(questions.questions);
            } else {
                throw new Error('返回格式不正确');
            }
        } catch (parseError) {
            console.error('解析AI响应失败:', parseError);
            console.log('原始响应:', content);
            // 尝试从文本中提取JSON
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return this.validateQuestions(JSON.parse(jsonMatch[0]));
            }
            throw new Error('无法解析AI响应');
        }
    }

    /**
     * 构建提示词
     */
    buildPrompt(text, count) {
        // 限制文本长度，避免超出token限制
        const maxLength = 2000;
        const truncatedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

        return `请根据以下英文文本，生成 ${count} 道阅读理解选择题。

要求：
1. 每道题目有4个选项（A, B, C, D）
2. 题目应该测试学生对文本的理解
3. 选项应该具有迷惑性，但只有一个正确答案
4. 返回JSON格式的数组

文本内容：
${truncatedText}

请返回以下JSON格式（数组格式）：
[
  {
    "question": "问题内容",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctAnswer": 0
  }
]

其中correctAnswer是正确答案的索引（0-3）。`;
    }

    /**
     * 验证题目格式
     */
    validateQuestions(questions) {
        if (!Array.isArray(questions)) {
            throw new Error('题目必须是数组格式');
        }

        return questions.map((q, index) => {
            if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
                throw new Error(`题目 ${index + 1} 格式不正确`);
            }
            if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                throw new Error(`题目 ${index + 1} 的正确答案索引不正确`);
            }
            return {
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer
            };
        });
    }

    /**
     * 生成模拟题目（当没有API密钥时使用）
     */
    generateMockQuestions(text, count) {
        // 从文本中提取一些关键词和句子来生成简单的题目
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const words = text.split(/\s+/).filter(w => w.length > 4);

        const mockQuestions = [];
        for (let i = 0; i < Math.min(count, 3); i++) {
            const sentence = sentences[i % sentences.length] || 'This is a sample sentence.';
            const question = `What is the main idea of the passage?`;
            const options = [
                'The passage discusses various topics.',
                'The passage focuses on the main theme.',
                'The passage presents different perspectives.',
                'The passage explores multiple concepts.'
            ];
            
            mockQuestions.push({
                question: question,
                options: options,
                correctAnswer: 1
            });
        }

        return mockQuestions;
    }

    /**
     * 生成缓存键
     */
    getCacheKey(text, count) {
        // 使用文本的前100个字符和count作为缓存键
        const textHash = text.substring(0, 100).replace(/\s+/g, '');
        return `${textHash}_${count}`;
    }

    /**
     * 显示API密钥配置界面
     */
    showApiKeyConfig() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl p-8 max-w-md w-full m-4 shadow-2xl border border-white/20">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold gradient-text">配置AI API密钥</h3>
                    <button id="close-api-modal" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center">
                        <i class="fa fa-times text-gray-600"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
                        <input 
                            type="password" 
                            id="api-key-input" 
                            value="${this.apiKey}" 
                            placeholder="sk-..." 
                            class="w-full p-3 bg-white/80 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none">
                        <p class="text-xs text-gray-500 mt-2">您的API密钥仅存储在本地，不会上传到服务器</p>
                    </div>
                    <div class="flex gap-3">
                        <button id="save-api-key" class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium">
                            保存
                        </button>
                        <button id="cancel-api-key" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium">
                            取消
                        </button>
                    </div>
                    <div class="text-xs text-gray-600">
                        <p class="mb-2">获取API密钥：</p>
                        <a href="https://platform.openai.com/api-keys" target="_blank" class="text-blue-500 hover:underline">
                            https://platform.openai.com/api-keys
                        </a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-api-modal').addEventListener('click', () => modal.remove());
        document.getElementById('cancel-api-key').addEventListener('click', () => modal.remove());
        document.getElementById('save-api-key').addEventListener('click', () => {
            const apiKey = document.getElementById('api-key-input').value.trim();
            if (apiKey) {
                this.setApiKey(apiKey);
                alert('API密钥已保存');
                modal.remove();
            } else {
                alert('请输入有效的API密钥');
            }
        });
    }
}

// 导出供全局使用
window.AIQuestionGenerator = AIQuestionGenerator;

