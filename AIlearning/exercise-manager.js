/**
 * 练习管理器
 * 负责管理所有练习功能：选择题、简答题、语法题、填空题
 */
class ExerciseManager {
    constructor() {
        this.exercises = {
            readingComprehension: [],  // 阅读选择题
            shortAnswer: [],            // 简答题
            grammar: [],               // 语法题
            fillInTheBlanks: []        // 填空题
        };
        this.userAnswers = {};         // 用户答案（当前收集的）
        this.submittedAnswers = {};    // 已提交的答案（用于导出PDF）
        this.initialized = false;
        this.currentFilter = 'shortAnswer';    // 当前题目类型筛选（默认简答题）
        this.submittedTypes = new Set(); // 已提交的题目类型
        this.typeScores = {            // 各类型题目的分数
            reading: { total: 0, correct: 0, score: 0 },
            grammar: { total: 0, correct: 0, score: 0 },
            fillBlank: { total: 0, correct: 0, score: 0 },
            shortAnswer: { submitted: false }
        };
    }

    init() {
        if (this.initialized) {
            console.log('练习管理器已初始化，跳过重复初始化');
            return;
        }

        console.log('初始化练习管理器...');
        this.loadExercises();
        this.setupEventListeners();
        this.renderExercises();
        this.initialized = true;
        console.log('练习管理器初始化完成');
    }

    /**
     * 加载练习数据
     */
    loadExercises() {
        // 从lessonData中加载练习数据
        if (typeof window.lessonData !== 'undefined' && window.lessonData.exercises) {
            this.exercises = {
                readingComprehension: window.lessonData.exercises.readingComprehension || [],
                shortAnswer: [], // 简答题只从question.js加载，清空其他来源
                grammar: window.lessonData.exercises.grammar || [],
                fillInTheBlanks: window.lessonData.exercises.fillInTheBlanks || []
            };
        } else {
            // 如果lessonData不存在，初始化空数组
            this.exercises = {
                readingComprehension: [],
                shortAnswer: [],
                grammar: [],
                fillInTheBlanks: []
            };
        }

        // 从localStorage加载填空题
        this.loadFillBlanksFromStorage();

        // 从question.js加载练习题数据（包括简答题）
        this.loadQuestionJsData();

        // 不再从localStorage加载简答题，只使用question.js的数据

        // 如果语法题为空，尝试从grammarAnalysis生成（专四风格语法题）
        if (this.exercises.grammar.length === 0 && window.lessonData) {
            this.generateGrammarFromAnalysis();
        }

        // 简答题需要手动上传，不再自动生成

        // 初始化AI生成器
        if (typeof AIQuestionGenerator !== 'undefined') {
            this.aiGenerator = new AIQuestionGenerator();
        }
    }

    /**
     * 从语法分析生成专四风格语法题
     */
    generateGrammarFromAnalysis() {
        if (!window.lessonData || !window.lessonData.paragraphs) {
            return;
        }

        const grammarQuestions = [];
        const allSentences = [];

        // 收集所有段落中的句子和语法点
        window.lessonData.paragraphs.forEach((paragraph, paraIndex) => {
            if (!paragraph.grammarAnalysis || !paragraph.englishText) {
                return;
            }

            // 提取句子
            const sentences = paragraph.englishText.match(/[^.!?]+[.!?]+/g) || [];

            // 解析语法分析文本，提取语法点
            const grammarPoints = paragraph.grammarAnalysis.split(/[0-9]+\./).filter(g => g.trim().length > 0);

            grammarPoints.forEach((point, index) => {
                const trimmed = point.trim();
                if (trimmed.length < 10) return;

                // 提取语法点信息
                const grammarNameMatch = trimmed.match(/^(.+?)：/);
                const grammarName = grammarNameMatch ? grammarNameMatch[1] : '语法结构';

                // 提取相关句子（从语法分析中提取引用的句子）
                const sentenceMatch = trimmed.match(/[""]([^""]+)[""]/);
                let relatedSentence = sentenceMatch ? sentenceMatch[1] : null;

                // 如果没有找到引用的句子，使用段落中的第一个句子
                if (!relatedSentence && sentences.length > 0) {
                    relatedSentence = sentences[0].trim();
                }

                if (relatedSentence) {
                    // 生成专四风格的语法选择题
                    const question = this.generateTEM4StyleGrammarQuestion(
                        grammarName,
                        relatedSentence,
                        trimmed,
                        paraIndex + 1
                    );

                    if (question) {
                        grammarQuestions.push(question);
                    }
                }
            });
        });

        // 限制题目数量，优先选择不同语法点的题目
        const uniqueGrammarTypes = new Set();
        const filteredQuestions = grammarQuestions.filter(q => {
            const grammarType = q.grammarType || '';
            if (!uniqueGrammarTypes.has(grammarType) || uniqueGrammarTypes.size < 10) {
                uniqueGrammarTypes.add(grammarType);
                return true;
            }
            return false;
        });

        this.exercises.grammar = filteredQuestions.slice(0, 10); // 最多10道语法题
        console.log(`从语法分析生成了 ${this.exercises.grammar.length} 道专四风格语法题`);
    }

    /**
     * 生成专四风格语法选择题
     */
    generateTEM4StyleGrammarQuestion(grammarType, sentence, grammarAnalysis, paragraphNum) {
        // 根据语法类型生成不同类型的题目

        // 1. 从句类型题目
        if (grammarType.includes('从句')) {
            return this.generateClauseQuestion(grammarType, sentence, paragraphNum);
        }

        // 2. 时态/语态题目
        if (grammarType.includes('时态') || grammarType.includes('语态')) {
            return this.generateTenseVoiceQuestion(grammarType, sentence, paragraphNum);
        }

        // 3. 非谓语动词题目
        if (grammarType.includes('分词') || grammarType.includes('动名词') || grammarType.includes('不定式')) {
            return this.generateNonFiniteVerbQuestion(grammarType, sentence, paragraphNum);
        }

        // 4. 虚拟语气题目
        if (grammarType.includes('虚拟') || grammarAnalysis.includes('if')) {
            return this.generateSubjunctiveQuestion(sentence, paragraphNum);
        }

        // 5. 倒装题目
        if (grammarType.includes('倒装') || sentence.match(/^(Never|Hardly|Rarely|Seldom|Not only|Only|So|Such)/i)) {
            return this.generateInversionQuestion(sentence, paragraphNum);
        }

        // 6. 默认：语法结构选择
        return this.generateGeneralGrammarQuestion(grammarType, sentence, paragraphNum);
    }

    /**
     * 生成从句类型题目
     */
    generateClauseQuestion(grammarType, sentence, paragraphNum) {
        const clauseTypes = {
            '定语从句': ['that', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why'],
            '状语从句': ['because', 'although', 'though', 'if', 'when', 'while', 'as', 'since', 'until'],
            '名词性从句': ['that', 'what', 'who', 'which', 'when', 'where', 'why', 'how', 'whether', 'if']
        };

        let correctWord = '';
        let wrongWords = [];

        // 从句子中提取从句引导词
        const sentenceLower = sentence.toLowerCase();

        if (grammarType.includes('定语')) {
            correctWord = clauseTypes['定语从句'].find(w => sentenceLower.includes(` ${w} `) || sentenceLower.includes(`,${w} `)) || 'that';
            wrongWords = clauseTypes['状语从句'].slice(0, 3);
        } else if (grammarType.includes('状语')) {
            correctWord = clauseTypes['状语从句'].find(w => sentenceLower.includes(` ${w} `)) || 'because';
            wrongWords = clauseTypes['定语从句'].slice(0, 3);
        } else {
            correctWord = clauseTypes['名词性从句'].find(w => sentenceLower.includes(` ${w} `)) || 'that';
            wrongWords = clauseTypes['状语从句'].slice(0, 3);
        }

        // 生成选项
        const options = [correctWord, ...wrongWords].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctWord);

        return {
            type: 'choice',
            question: `根据段落${paragraphNum}中的句子："${sentence.substring(0, 80)}..."，选择最合适的从句引导词：`,
            options: options.map(opt => opt.charAt(0).toUpperCase() + opt.slice(1)),
            correctAnswer: correctIndex,
            grammarType: grammarType,
            paragraphNum: paragraphNum
        };
    }

    /**
     * 生成时态/语态题目
     */
    generateTenseVoiceQuestion(grammarType, sentence, paragraphNum) {
        // 提取句子中的动词
        const verbs = sentence.match(/\b(is|are|was|were|has|have|had|will|would|can|could|should|may|might|do|does|did|am)\b/gi) || [];

        if (verbs.length === 0) return null;

        const verb = verbs[0].toLowerCase();
        const alternatives = {
            'is': ['was', 'has been', 'will be'],
            'are': ['were', 'have been', 'will be'],
            'was': ['is', 'has been', 'will be'],
            'were': ['are', 'have been', 'will be'],
            'has': ['have', 'had', 'will have'],
            'have': ['has', 'had', 'will have'],
            'had': ['has', 'have', 'will have']
        };

        const wrongOptions = alternatives[verb] || ['is', 'are', 'was'];
        const options = [verb, ...wrongOptions].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(verb);

        return {
            type: 'choice',
            question: `根据段落${paragraphNum}中的句子："${sentence.substring(0, 80)}..."，选择正确的时态形式：`,
            options: options.map(opt => opt.charAt(0).toUpperCase() + opt.slice(1)),
            correctAnswer: correctIndex,
            grammarType: grammarType,
            paragraphNum: paragraphNum
        };
    }

    /**
     * 生成非谓语动词题目
     */
    generateNonFiniteVerbQuestion(grammarType, sentence, paragraphNum) {
        const patterns = {
            '现在分词': ['-ing', 'doing', 'being', 'having'],
            '过去分词': ['-ed', 'done', 'been', 'taken'],
            '不定式': ['to do', 'to be', 'to have']
        };

        let correctForm = '';
        if (grammarType.includes('现在分词')) {
            correctForm = '-ing形式';
        } else if (grammarType.includes('过去分词')) {
            correctForm = '-ed形式';
        } else {
            correctForm = 'to do形式';
        }

        const wrongForms = Object.keys(patterns).filter(k => k !== grammarType).slice(0, 3);
        const options = [correctForm, ...wrongForms].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctForm);

        return {
            type: 'choice',
            question: `根据段落${paragraphNum}中的句子："${sentence.substring(0, 80)}..."，该句中使用的非谓语动词形式是：`,
            options: options,
            correctAnswer: correctIndex,
            grammarType: grammarType,
            paragraphNum: paragraphNum
        };
    }

    /**
     * 生成虚拟语气题目
     */
    generateSubjunctiveQuestion(sentence, paragraphNum) {
        const options = [
            '虚拟语气',
            '真实条件句',
            '陈述语气',
            '祈使语气'
        ];

        return {
            type: 'choice',
            question: `根据段落${paragraphNum}中的句子："${sentence.substring(0, 80)}..."，判断该句的语法特征：`,
            options: options,
            correctAnswer: 0,
            grammarType: '虚拟语气',
            paragraphNum: paragraphNum
        };
    }

    /**
     * 生成倒装题目
     */
    generateInversionQuestion(sentence, paragraphNum) {
        const options = [
            '倒装句',
            '正常语序',
            '强调句',
            '省略句'
        ];

        return {
            type: 'choice',
            question: `根据段落${paragraphNum}中的句子："${sentence.substring(0, 80)}..."，该句的语法结构是：`,
            options: options,
            correctAnswer: 0,
            grammarType: '倒装',
            paragraphNum: paragraphNum
        };
    }

    /**
     * 生成通用语法题目
     */
    generateGeneralGrammarQuestion(grammarType, sentence, paragraphNum) {
        const wrongTypes = this.generateWrongOption(grammarType);
        const allWrongTypes = [];
        while (allWrongTypes.length < 3) {
            const wrong = this.generateWrongOption(grammarType);
            if (!allWrongTypes.includes(wrong)) {
                allWrongTypes.push(wrong);
            }
        }

        const options = [grammarType, ...allWrongTypes].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(grammarType);

        return {
            type: 'choice',
            question: `根据段落${paragraphNum}中的句子："${sentence.substring(0, 80)}..."，该句中划线部分的语法结构是：`,
            options: options,
            correctAnswer: correctIndex,
            grammarType: grammarType,
            paragraphNum: paragraphNum
        };
    }

    /**
     * 生成错误的干扰选项
     */
    generateWrongOption(correctOption) {
        const wrongOptions = [
            '定语从句',
            '状语从句',
            '主语从句',
            '宾语从句',
            '表语从句',
            '同位语从句',
            '现在分词',
            '过去分词',
            '动名词',
            '不定式',
            '并列句',
            '复合句'
        ];
        const filtered = wrongOptions.filter(opt => opt !== correctOption);
        return filtered[Math.floor(Math.random() * filtered.length)];
    }


    /**
     * 从localStorage加载填空题
     */
    loadFillBlanksFromStorage() {
        try {
            const savedFillBlanks = localStorage.getItem('fillInTheBlanks');
            if (savedFillBlanks) {
                const parsed = JSON.parse(savedFillBlanks);
                if (Array.isArray(parsed)) {
                    this.exercises.fillInTheBlanks = parsed;
                    console.log(`从localStorage加载了 ${parsed.length} 个填空题`);
                }
            }
        } catch (error) {
            console.error('加载填空题失败:', error);
        }
    }

    /**
     * 从localStorage加载简答题
     */
    loadShortAnswerFromStorage() {
        try {
            const savedShortAnswer = localStorage.getItem('shortAnswerQuestions');
            if (savedShortAnswer) {
                const parsed = JSON.parse(savedShortAnswer);
                if (Array.isArray(parsed)) {
                    // 合并到现有简答题中
                    this.exercises.shortAnswer = [...this.exercises.shortAnswer, ...parsed];
                    console.log(`从localStorage加载了 ${parsed.length} 道简答题`);
                }
            }
        } catch (error) {
            console.error('加载简答题失败:', error);
        }
    }

    /**
     * 从question.js加载练习题数据
     */
    loadQuestionJsData() {
        // 检查是否存在unit3数据
        if (typeof window.unit3 === 'undefined') {
            console.log('question.js 数据未加载');
            return;
        }

        const unit3Data = window.unit3;
        let loadedCount = 0;

        // 0. 加载阅读理解选择题
        if (unit3Data.readingComprehension && Array.isArray(unit3Data.readingComprehension)) {
            // 合并到阅读理解题中，避免重复
            unit3Data.readingComprehension.forEach(q => {
                const exists = this.exercises.readingComprehension.some(existing =>
                    existing.question === q.question
                );
                if (!exists) {
                    this.exercises.readingComprehension.push(q);
                    loadedCount++;
                }
            });
            console.log(`从question.js加载了 ${unit3Data.readingComprehension.length} 道阅读理解选择题`);
        }

        // 1. 加载理解文本题目（简答题）
        if (unit3Data.understandingTheText) {
            const understandingQuestions = Object.keys(unit3Data.understandingTheText).map(key => {
                const item = unit3Data.understandingTheText[key];
                return {
                    question: item.question,
                    paragraphId: 'all',
                    referenceAnswer: item.answer, // 保存参考答案用于后续显示
                    source: 'understandingTheText'
                };
            });

            // 合并到简答题中，避免重复
            understandingQuestions.forEach(q => {
                const exists = this.exercises.shortAnswer.some(existing =>
                    existing.question === q.question
                );
                if (!exists) {
                    this.exercises.shortAnswer.push(q);
                    loadedCount++;
                }
            });
            console.log(`从question.js加载了 ${understandingQuestions.length} 道理解文本题目`);
        }

        // 2. 优先加载新的层级结构填空题
        if (unit3Data.fillBlankGroups && Array.isArray(unit3Data.fillBlankGroups)) {
            unit3Data.fillBlankGroups.forEach((group, groupIndex) => {
                // 如果大题有子题组（subGroups）
                if (group.subGroups && Array.isArray(group.subGroups)) {
                    // 处理有子题的大题（如搭配填空包含as短语和case短语）
                    group.subGroups.forEach((subGroup, subGroupIndex) => {
                        const subGroupItems = subGroup.items || [];
                        subGroupItems.forEach(item => {
                            const text = item.s.replace(/______+/g, (match, offset) => {
                                const beforeText = item.s.substring(0, offset);
                                const blankCount = (beforeText.match(/______+/g) || []).length;
                                return `__${blankCount + 1}__`;
                            });
                            const answers = item.a.split(';').map(a => a.trim());

                            this.exercises.fillInTheBlanks.push({
                                text: text,
                                answers: answers,
                                source: `fillBlankGroups-${groupIndex}-subGroup-${subGroupIndex}`,
                                category: subGroup.category || subGroup.title,
                                wordOptions: subGroup.wordOptions || [],
                                groupTitle: group.title, // 大题标题
                                subGroupTitle: subGroup.title, // 子题标题
                                isSubGroup: true, // 标记为子题
                                explanation: item.explanation || '' // 保存解析
                            });
                            loadedCount++;
                        });
                    });
                } else if (group.items && Array.isArray(group.items)) {
                    // 处理没有子题的大题（如词汇填空）
                    group.items.forEach(item => {
                        const text = item.s.replace(/______+/g, (match, offset) => {
                            const beforeText = item.s.substring(0, offset);
                            const blankCount = (beforeText.match(/______+/g) || []).length;
                            return `__${blankCount + 1}__`;
                        });
                        const answers = item.a.split(';').map(a => a.trim());

                        this.exercises.fillInTheBlanks.push({
                            text: text,
                            answers: answers,
                            source: `fillBlankGroups-${groupIndex}`,
                            category: group.category || group.title,
                            wordOptions: group.wordOptions || [],
                            groupTitle: group.title, // 大题标题
                            isSubGroup: false, // 标记为普通题
                            explanation: item.explanation || '' // 保存解析
                        });
                        loadedCount++;
                    });
                }
            });
            console.log(`从question.js加载了新的层级结构填空题，共 ${loadedCount} 道小题`);
        } else {
            // 兼容旧格式：加载词汇填空题
            if (unit3Data.vocabulary && unit3Data.vocabulary.items) {
                const vocabWords = unit3Data.vocabulary.words || [];
                const vocabFillBlanks = unit3Data.vocabulary.items.map(item => {
                    const text = item.s.replace(/______+/g, (match, offset) => {
                        const beforeText = item.s.substring(0, offset);
                        const blankCount = (beforeText.match(/______+/g) || []).length;
                        return `__${blankCount + 1}__`;
                    });
                    const answers = item.a.split(';').map(a => a.trim());

                    return {
                        text: text,
                        answers: answers,
                        source: 'vocabulary',
                        category: '词汇填空',
                        wordOptions: vocabWords,
                        groupTitle: '词汇填空',
                        isSubGroup: false
                    };
                }).filter(item => item); // 确保返回有效对象

                vocabFillBlanks.forEach(fb => {
                    const exists = this.exercises.fillInTheBlanks.some(existing =>
                        existing.text === fb.text
                    );
                    if (!exists) {
                        this.exercises.fillInTheBlanks.push(fb);
                        loadedCount++;
                    }
                });
                console.log(`从question.js加载了 ${vocabFillBlanks.length} 道词汇填空题（旧格式）`);
            }

            // 兼容旧格式：加载搭配填空题（as短语）
            if (unit3Data.collocation && unit3Data.collocation.asItems) {
                const asPhrases = unit3Data.collocation.asPhrases || [];
                const asFillBlanks = unit3Data.collocation.asItems.map(item => {
                    const text = item.s.replace(/______+/g, '__1__');
                    return {
                        text: text,
                        answers: [item.a.trim()],
                        source: 'collocation-as',
                        category: 'as短语填空',
                        wordOptions: asPhrases,
                        groupTitle: '搭配填空',
                        subGroupTitle: 'as短语填空',
                        isSubGroup: true
                    };
                });

                asFillBlanks.forEach(fb => {
                    const exists = this.exercises.fillInTheBlanks.some(existing =>
                        existing.text === fb.text
                    );
                    if (!exists) {
                        this.exercises.fillInTheBlanks.push(fb);
                        loadedCount++;
                    }
                });
                console.log(`从question.js加载了 ${asFillBlanks.length} 道as短语填空题（旧格式）`);
            }

            // 兼容旧格式：加载搭配填空题（case短语）
            if (unit3Data.collocation && unit3Data.collocation.caseItems) {
                const casePhrases = unit3Data.collocation.casePhrases || [];
                const caseFillBlanks = unit3Data.collocation.caseItems.map(item => {
                    const text = item.s.replace(/______+/g, '__1__');
                    return {
                        text: text,
                        answers: [item.a.trim()],
                        source: 'collocation-case',
                        category: 'case短语填空',
                        wordOptions: casePhrases,
                        groupTitle: '搭配填空',
                        subGroupTitle: 'case短语填空',
                        isSubGroup: true
                    };
                });

                caseFillBlanks.forEach(fb => {
                    const exists = this.exercises.fillInTheBlanks.some(existing =>
                        existing.text === fb.text
                    );
                    if (!exists) {
                        this.exercises.fillInTheBlanks.push(fb);
                        loadedCount++;
                    }
                });
                console.log(`从question.js加载了 ${caseFillBlanks.length} 道case短语填空题（旧格式）`);
            }
        }

        console.log(`从question.js总共加载了 ${loadedCount} 道练习题`);
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 题目类型筛选按钮
        document.querySelectorAll('.exercise-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.filterExercises(type);

                // 更新按钮状态
                document.querySelectorAll('.exercise-type-btn').forEach(b => {
                    b.classList.remove('active');
                    b.classList.remove('bg-gradient-to-r', 'from-purple-500', 'to-pink-500');
                    b.classList.add('bg-gray-100', 'text-gray-600');
                });
                e.currentTarget.classList.add('active');
                e.currentTarget.classList.remove('bg-gray-100', 'text-gray-600');
                e.currentTarget.classList.add('bg-gradient-to-r', 'from-purple-500', 'to-pink-500', 'text-white');
            });
        });

        // 统一提交按钮
        const submitBtn = document.getElementById('submit-current-type-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const currentType = this.currentFilter;
                if (currentType) {
                    this.submitAnswersByType(currentType);
                }
            });
        }

        // 初始化分数显示
        this.updateScoreDisplay();

        // 更新提交按钮状态
        this.updateSubmitButtonsState();
    }

    /**
     * 更新提交按钮状态（根据是否有题目）
     */
    updateSubmitButtonsState() {
        const submitBtn = document.getElementById('submit-current-type-btn');
        const submitBtnText = document.getElementById('submit-btn-text');
        const statusDisplay = document.getElementById('submit-status-display');

        if (!submitBtn) return;

        const currentType = this.currentFilter;
        const hasQuestions = this.getQuestionCount(currentType) > 0;
        const isSubmitted = this.submittedTypes.has(currentType);

        // 更新按钮状态
        if (!hasQuestions || isSubmitted) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        // 更新按钮文本（显示当前题型名称）
        if (submitBtnText) {
            const typeNames = {
                'reading': '阅读理解',
                'shortAnswer': '简答题',
                'grammar': '语法题',
                'fillBlank': '填空题'
            };
            const typeName = typeNames[currentType] || '当前题型';
            submitBtnText.textContent = `提交${typeName}所有答案`;
        }

        // 更新状态显示
        if (statusDisplay && !isSubmitted) {
            if (hasQuestions) {
                statusDisplay.innerHTML = '<span class="text-gray-600">待提交</span>';
            } else {
                statusDisplay.innerHTML = '<span class="text-gray-400">暂无题目</span>';
            }
        }
    }

    /**
     * 获取指定类型的题目数量
     */
    getQuestionCount(type) {
        switch (type) {
            case 'reading':
                return this.exercises.readingComprehension.length;
            case 'shortAnswer':
                return this.exercises.shortAnswer.length;
            case 'grammar':
                return this.exercises.grammar.length;
            case 'fillBlank':
                return this.exercises.fillInTheBlanks.length;
            default:
                return 0;
        }
    }

    /**
     * 筛选题目类型
     */
    filterExercises(type) {
        this.currentFilter = type;
        this.renderExercises();

        // 更新提交按钮状态
        this.updateSubmitButtonsState();

        // 滚动到题目容器顶部
        const exerciseContainer = document.getElementById('exercise-container');
        if (exerciseContainer) {
            setTimeout(() => {
                exerciseContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    /**
     * 渲染所有练习题目
     */
    renderExercises() {
        const container = document.getElementById('exercise-container');
        if (!container) {
            console.error('练习容器未找到');
            return;
        }

        container.innerHTML = '';

        // 根据筛选类型显示题目（只显示当前选中的类型）
        if (this.currentFilter === 'reading') {
            this.renderReadingComprehension();
        } else if (this.currentFilter === 'shortAnswer') {
            this.renderShortAnswer();
        } else if (this.currentFilter === 'grammar') {
            this.renderGrammar();
        } else if (this.currentFilter === 'fillBlank') {
            this.renderFillInTheBlanks();
        }

        // 如果没有题目，显示提示
        if (container.innerHTML.trim() === '') {
            container.innerHTML = `
                <div class="text-center py-12 bg-white/60 rounded-2xl backdrop-blur-sm">
                    <i class="fa fa-inbox text-6xl text-gray-300 mb-4"></i>
                    <p class="text-gray-600 text-lg">暂无${this.getCurrentFilterName()}练习题</p>
                    <p class="text-gray-500 text-sm mt-2">请切换到其他题目类型查看</p>
                </div>
            `;
        }

        // 更新提交按钮状态
        this.updateSubmitButtonsState();
    }

    /**
     * 获取当前筛选类型的名称
     */
    getCurrentFilterName() {
        const names = {
            'reading': '阅读理解',
            'shortAnswer': '简答题',
            'grammar': '语法题',
            'fillBlank': '填空题'
        };
        return names[this.currentFilter] || '简答题';
    }

    /**
     * 渲染阅读选择题
     */
    renderReadingComprehension() {
        const container = document.getElementById('exercise-container');
        if (!container || this.exercises.readingComprehension.length === 0) {
            return;
        }

        const questionsHTML = this.exercises.readingComprehension.map((question, index) => {
            const questionId = `reading-${index}`;
            const optionsHTML = question.options.map((option, optIndex) => {
                const optionId = `${questionId}-opt-${optIndex}`;
                return `
                    <label class="flex items-center gap-3 p-4 bg-white/60 rounded-xl cursor-pointer hover:bg-white/80 transition-all border border-gray-200 hover:border-purple-300">
                        <input type="radio" name="${questionId}" value="${optIndex}" id="${optionId}" class="w-5 h-5 text-purple-600">
                        <span class="flex-1">${option}</span>
                    </label>
                `;
            }).join('');

            return `
                <div class="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-white/20 exercise-item" data-type="reading" data-index="${index}">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold">${index + 1}</div>
                        <h3 class="text-xl font-bold text-gray-800">阅读理解题</h3>
                    </div>
                    <div class="mb-6">
                        <p class="text-gray-700 text-lg leading-relaxed">${question.question}</p>
                    </div>
                    <div class="space-y-2">
                        ${optionsHTML}
                    </div>
                </div>
            `;
        }).join('');

        container.insertAdjacentHTML('beforeend', questionsHTML);
    }

    /**
     * 渲染简答题
     */
    renderShortAnswer() {
        const container = document.getElementById('exercise-container');
        if (!container || this.exercises.shortAnswer.length === 0) {
            return;
        }

        const questionsHTML = this.exercises.shortAnswer.map((question, index) => {
            const questionId = `shortAnswer-${index}`;

            return `
                <div class="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-white/20 exercise-item" data-type="shortAnswer" data-index="${index}">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center font-bold">${index + 1}</div>
                        <h3 class="text-xl font-bold text-gray-800">简答题</h3>
                        ${question.source ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">${question.source === 'understandingTheText' ? '理解文本' : '自定义'}</span>` : ''}
                    </div>
                    <div class="mb-4">
                        <p class="text-gray-700 text-lg leading-relaxed">${question.question}</p>
                    </div>
                    <textarea 
                        id="${questionId}" 
                        name="${questionId}"
                        rows="4" 
                        class="w-full p-4 bg-white/80 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                        placeholder="请输入您的答案..."></textarea>
                </div>
            `;
        }).join('');

        container.insertAdjacentHTML('beforeend', questionsHTML);
    }

    /**
     * 渲染语法题
     */
    renderGrammar() {
        const container = document.getElementById('exercise-container');
        if (!container || this.exercises.grammar.length === 0) {
            return;
        }

        const questionsHTML = this.exercises.grammar.map((question, index) => {
            const questionId = `grammar-${index}`;

            // 如果是选择题
            if (question.type === 'choice' && question.options) {
                const optionsHTML = question.options.map((option, optIndex) => {
                    const optionId = `${questionId}-opt-${optIndex}`;
                    return `
                        <label class="flex items-center gap-3 p-4 bg-white/60 rounded-xl cursor-pointer hover:bg-white/80 transition-all border border-gray-200 hover:border-yellow-300">
                            <input type="radio" name="${questionId}" value="${optIndex}" id="${optionId}" class="w-5 h-5 text-yellow-600">
                            <span class="flex-1">${option}</span>
                        </label>
                    `;
                }).join('');

                return `
                    <div class="bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-white/20 exercise-item" data-type="grammar" data-index="${index}">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold">${index + 1}</div>
                            <h3 class="text-xl font-bold text-gray-800">语法题</h3>
                        </div>
                        <div class="mb-6">
                            <p class="text-gray-700 text-lg leading-relaxed">${question.question}</p>
                        </div>
                        <div class="space-y-2">
                            ${optionsHTML}
                        </div>
                    </div>
                `;
            } else {
                // 填空题形式
                return `
                    <div class="bg-gradient-to-br from-white via-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-white/20 exercise-item" data-type="grammar" data-index="${index}">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full flex items-center justify-center font-bold">${index + 1}</div>
                            <h3 class="text-xl font-bold text-gray-800">语法题</h3>
                        </div>
                        <div class="mb-4">
                            <p class="text-gray-700 text-lg leading-relaxed">${question.question}</p>
                        </div>
                        <input 
                            type="text" 
                            id="${questionId}" 
                            name="${questionId}"
                            class="w-full p-4 bg-white/80 rounded-xl border border-gray-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                            placeholder="请输入答案...">
                    </div>
                `;
            }
        }).join('');

        container.insertAdjacentHTML('beforeend', questionsHTML);
    }

    /**
     * 渲染填空题（支持层级结构）
     */
    renderFillInTheBlanks() {
        const container = document.getElementById('exercise-container');
        if (!container || this.exercises.fillInTheBlanks.length === 0) {
            return;
        }

        // 按大题分组
        const groupedQuestions = {};
        let globalIndex = 0;

        this.exercises.fillInTheBlanks.forEach((question, index) => {
            const groupKey = question.groupTitle || 'default';
            if (!groupedQuestions[groupKey]) {
                groupedQuestions[groupKey] = {
                    title: question.groupTitle,
                    questions: [],
                    hasSubGroups: false
                };
            }

            // 添加全局索引
            question.globalIndex = globalIndex++;
            groupedQuestions[groupKey].questions.push(question);

            // 检查是否有子题
            if (question.isSubGroup && question.subGroupTitle) {
                groupedQuestions[groupKey].hasSubGroups = true;
            }
        });

        // 按子题再次分组（如果有）
        let htmlContent = '';
        let groupNumber = 1;

        Object.keys(groupedQuestions).forEach(groupKey => {
            const group = groupedQuestions[groupKey];

            // 如果有子题，按子题分组
            if (group.hasSubGroups) {
                const subGroupMap = {};
                group.questions.forEach(q => {
                    const subKey = q.subGroupTitle || 'default';
                    if (!subGroupMap[subKey]) {
                        subGroupMap[subKey] = [];
                    }
                    subGroupMap[subKey].push(q);
                });

                // 渲染大题标题
                htmlContent += `
                    <div class="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-white text-xl">${groupNumber}</div>
                            <h2 class="text-2xl font-bold text-white">${group.title}</h2>
                        </div>
                    </div>
                `;

                // 渲染各子题
                let subGroupNumber = 1;
                Object.keys(subGroupMap).forEach(subKey => {
                    const subQuestions = subGroupMap[subKey];
                    const firstSubQuestion = subQuestions[0];

                    // 渲染子题标题
                    htmlContent += `
                        <div class="mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl p-4 shadow-lg">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-white">${groupNumber}.${subGroupNumber}</div>
                                <h3 class="text-xl font-bold text-white">${firstSubQuestion.subGroupTitle}</h3>
                            </div>
                        </div>
                    `;

                    // 渲染该子题下的所有小题
                    subQuestions.forEach((question, subIndex) => {
                        htmlContent += this.renderSingleFillBlank(question, `${groupNumber}.${subGroupNumber}.${subIndex + 1}`);
                    });

                    subGroupNumber++;
                });
            } else {
                // 没有子题的大题，直接渲染所有小题
                htmlContent += `
                    <div class="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-xl">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-white text-xl">${groupNumber}</div>
                            <h2 class="text-2xl font-bold text-white">${group.title}</h2>
                        </div>
                    </div>
                `;

                group.questions.forEach((question, qIndex) => {
                    htmlContent += this.renderSingleFillBlank(question, `${groupNumber}.${qIndex + 1}`);
                });
            }

            groupNumber++;
        });

        container.insertAdjacentHTML('beforeend', htmlContent);

        // 为待选词汇添加点击填充功能
        container.querySelectorAll('.fill-blank-word-option').forEach(span => {
            const questionId = span.getAttribute('data-question-id');
            const word = span.getAttribute('data-word');
            span.addEventListener('click', () => {
                const firstInput = document.querySelector(`#${questionId}-input-0`);
                if (firstInput) {
                    firstInput.value = word;
                    firstInput.focus();
                    // 添加填充动画
                    span.style.backgroundColor = '#e9d5ff';
                    setTimeout(() => {
                        span.style.backgroundColor = '';
                    }, 500);
                }
            });
        });
    }

    /**
     * 渲染单个填空题
     */
    renderSingleFillBlank(question, questionNumber) {
        const questionId = `fillBlank-${question.globalIndex}`;

        // 将题目文本中的占位符替换为输入框
        let questionHTML = question.text;
        question.answers.forEach((answer, ansIndex) => {
            const placeholder = `__${ansIndex + 1}__`;
            const inputId = `${questionId}-input-${ansIndex}`;
            const input = `<input type="text" id="${inputId}" name="${inputId}" data-answer-index="${ansIndex}" class="inline-block mx-1 px-3 py-2 bg-white/80 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all min-w-[100px]" placeholder="答案${ansIndex + 1}">`;
            questionHTML = questionHTML.replace(new RegExp(placeholder, 'g'), input);
        });

        // 显示分类标签
        const categoryBadge = question.category ? `
            <span class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                ${question.category}
            </span>
        ` : '';

        // 显示待选词汇
        const wordOptionsHTML = question.wordOptions && question.wordOptions.length > 0 ? `
            <div class="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div class="flex items-center gap-2 mb-2">
                    <i class="fa fa-list text-purple-600"></i>
                    <span class="text-sm font-semibold text-purple-700">待选词汇：</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    ${question.wordOptions.map(word => `
                        <span class="fill-blank-word-option px-3 py-1 bg-white rounded-lg border border-purple-300 text-sm text-purple-700 font-medium cursor-pointer hover:bg-purple-100 transition-colors" data-question-id="${questionId}" data-word="${word}">
                            ${word}
                        </span>
                    `).join('')}
                </div>
                <p class="text-xs text-purple-600 mt-2 italic">点击词汇可直接填入第一个空</p>
            </div>
        ` : '';

        return `
            <div class="bg-gradient-to-br from-white via-red-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-white/20 exercise-item mb-4" data-type="fillBlank" data-index="${question.globalIndex}">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">${questionNumber}</div>
                    <h3 class="text-xl font-bold text-gray-800">填空题</h3>
                    ${categoryBadge}
                </div>
                <div class="mb-4">
                    <p class="text-gray-700 text-lg leading-relaxed">${questionHTML}</p>
                </div>
                ${wordOptionsHTML}
            </div>
        `;
    }

    /**
     * 获取下一个题目类型
     */
    getNextExerciseType(currentType) {
        const typeOrder = ['shortAnswer', 'reading', 'fillBlank', 'grammar'];
        const currentIndex = typeOrder.indexOf(currentType);

        if (currentIndex === -1) return null;

        // 查找下一个有题目的类型
        for (let i = 1; i < typeOrder.length; i++) {
            const nextIndex = (currentIndex + i) % typeOrder.length;
            const nextType = typeOrder[nextIndex];

            // 如果还有未提交的类型且有题目，返回该类型
            if (!this.submittedTypes.has(nextType) && this.getQuestionCount(nextType) > 0) {
                return nextType;
            }
        }

        // 如果所有类型都已提交或没有题目，返回null
        return null;
    }

    /**
     * 自动切换到下一个题目类型
     */
    autoSwitchToNextType(currentType) {
        const nextType = this.getNextExerciseType(currentType);

        if (nextType) {
            // 延迟2秒后自动切换，让用户看到提交结果
            setTimeout(() => {
                // 切换到下一个类型
                this.filterExercises(nextType);

                // 更新按钮状态
                document.querySelectorAll('.exercise-type-btn').forEach(btn => {
                    const btnType = btn.dataset.type;

                    // 移除所有状态类
                    btn.classList.remove('active');

                    // 移除所有渐变色类
                    btn.classList.remove('from-green-500', 'to-emerald-500',
                        'from-blue-500', 'to-cyan-500',
                        'from-red-500', 'to-pink-500',
                        'from-yellow-500', 'to-orange-500',
                        'bg-gradient-to-r', 'bg-gray-100',
                        'text-white', 'text-gray-600');

                    if (btnType === nextType) {
                        // 激活当前按钮
                        btn.classList.add('active');

                        // 根据类型设置对应的渐变色
                        const gradients = {
                            'shortAnswer': ['from-green-500', 'to-emerald-500'],
                            'reading': ['from-blue-500', 'to-cyan-500'],
                            'fillBlank': ['from-red-500', 'to-pink-500'],
                            'grammar': ['from-yellow-500', 'to-orange-500']
                        };

                        if (gradients[nextType]) {
                            btn.classList.add('bg-gradient-to-r', ...gradients[nextType], 'text-white');
                        }
                    } else {
                        // 非激活按钮使用默认样式（从HTML中获取的原始样式）
                        const gradients = {
                            'shortAnswer': ['from-green-500', 'to-emerald-500'],
                            'reading': ['from-blue-500', 'to-cyan-500'],
                            'fillBlank': ['from-red-500', 'to-pink-500'],
                            'grammar': ['from-yellow-500', 'to-orange-500']
                        };

                        if (gradients[btnType]) {
                            btn.classList.add('bg-gradient-to-r', ...gradients[btnType], 'text-white');
                        }
                    }
                });

                // 滚动到题目区域顶部
                const exerciseContainer = document.getElementById('exercise-container');
                if (exerciseContainer) {
                    exerciseContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 2000);
        } else {
            // 所有题目都已提交，显示完成提示
            setTimeout(() => {
                const resultDiv = document.getElementById('exercise-result');
                if (resultDiv) {
                    const completionMsg = `
                        <div class="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl text-center shadow-lg">
                            <i class="fa fa-check-circle text-4xl mb-3"></i>
                            <h3 class="text-2xl font-bold mb-2">恭喜！所有题目已完成</h3>
                            <p class="text-white/90">您可以查看上方的详细结果，或导出PDF报告</p>
                        </div>
                    `;
                    resultDiv.innerHTML += completionMsg;
                    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 2000);
        }
    }

    /**
     * 按类型提交答案
     */
    submitAnswersByType(type) {
        this.collectAnswers();
        
        // 保存已提交的答案（用于导出PDF）
        // 保存所有收集到的该类型答案
        Object.keys(this.userAnswers).forEach(key => {
            // 根据类型匹配答案键
            if (type === 'reading' && key.startsWith('reading-')) {
                this.submittedAnswers[key] = this.userAnswers[key];
            } else if (type === 'grammar' && key.startsWith('grammar-')) {
                this.submittedAnswers[key] = this.userAnswers[key];
            } else if (type === 'fillBlank' && key.startsWith('fillBlank-')) {
                this.submittedAnswers[key] = this.userAnswers[key];
            } else if (type === 'shortAnswer' && key.startsWith('shortAnswer-')) {
                this.submittedAnswers[key] = this.userAnswers[key];
            }
        });
        
        // 标记该类型已提交
        this.submittedTypes.add(type);
        
        const result = this.calculateScoreByType(type);
        this.displayResultByType(type, result);
        this.updateScoreDisplay();

        // 自动切换到下一个题目类型
        this.autoSwitchToNextType(type);
        
        console.log('已保存的提交答案:', this.submittedAnswers);
    }

    /**
     * 提交答案（保留用于兼容）
     */
    submitAnswers() {
        this.collectAnswers();
        const result = this.calculateScore();
        this.displayResult(result);
        this.updateScoreDisplay();
    }

    /**
     * 收集用户答案
     */
    collectAnswers() {
        this.userAnswers = {};

        // 收集选择题答案
        document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            const name = radio.name;
            this.userAnswers[name] = parseInt(radio.value);
        });

        // 收集简答题答案
        document.querySelectorAll('textarea[name^="shortAnswer"]').forEach(textarea => {
            this.userAnswers[textarea.name] = textarea.value.trim();
        });

        // 收集语法题答案
        document.querySelectorAll('input[name^="grammar"]').forEach(input => {
            if (input.type === 'radio') {
                if (input.checked) {
                    this.userAnswers[input.name] = parseInt(input.value);
                }
            } else {
                this.userAnswers[input.name] = input.value.trim();
            }
        });

        // 收集填空题答案
        document.querySelectorAll('input[name^="fillBlank"]').forEach(input => {
            this.userAnswers[input.name] = input.value.trim();
        });

        console.log('收集到的答案:', this.userAnswers);
    }

    /**
     * 获取用户答案（优先使用已提交的答案）
     */
    getUserAnswer(key) {
        // 优先使用已提交的答案，如果不存在则使用当前收集的答案
        return this.submittedAnswers[key] !== undefined ? this.submittedAnswers[key] : this.userAnswers[key];
    }

    /**
     * 按类型计算分数
     */
    calculateScoreByType(type) {
        let totalQuestions = 0;
        let correctAnswers = 0;
        const details = [];

        if (type === 'reading') {
            this.exercises.readingComprehension.forEach((question, index) => {
                totalQuestions++;
                const questionId = `reading-${index}`;
                const userAnswer = this.userAnswers[questionId];
                const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
                if (isCorrect) correctAnswers++;
                details.push({
                    type: 'reading',
                    index: index + 1,
                    question: question.question,
                    correct: userAnswer !== undefined ? isCorrect : null,
                    userAnswer: userAnswer !== undefined ? question.options[userAnswer] : '未作答',
                    correctAnswer: question.options[question.correctAnswer],
                    explanation: question.explanation || ''
                });
            });
        } else if (type === 'grammar') {
            this.exercises.grammar.forEach((question, index) => {
                if (question.type === 'choice') {
                    totalQuestions++;
                    const questionId = `grammar-${index}`;
                    const userAnswer = this.userAnswers[questionId];
                    const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
                    if (isCorrect) correctAnswers++;
                    details.push({
                        type: 'grammar',
                        index: index + 1,
                        question: question.question,
                        correct: userAnswer !== undefined ? isCorrect : null,
                        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : '未作答',
                        correctAnswer: question.options[question.correctAnswer],
                        explanation: question.explanation || ''
                    });
                }
            });
        } else if (type === 'fillBlank') {
            this.exercises.fillInTheBlanks.forEach((question, index) => {
                const globalIndex = question.globalIndex !== undefined ? question.globalIndex : index;
                question.answers.forEach((answer, ansIndex) => {
                    totalQuestions++;
                    const inputId = `fillBlank-${globalIndex}-input-${ansIndex}`;
                    const userAnswer = (this.userAnswers[inputId] || '').toLowerCase().trim();
                    const answerOptions = answer.toLowerCase().split(';').map(a => a.trim());
                    const isCorrect = userAnswer && answerOptions.some(correct => {
                        if (userAnswer === correct) return true;
                        if (correct.includes(';')) {
                            const parts = correct.split(';').map(p => p.trim());
                            return parts.some(part => userAnswer === part || userAnswer.includes(part));
                        }
                        return false;
                    });
                    if (isCorrect) correctAnswers++;
                    details.push({
                        type: 'fillBlank',
                        index: index + 1,
                        blankIndex: ansIndex + 1,
                        correct: userAnswer ? isCorrect : null,
                        userAnswer: userAnswer || '未作答',
                        correctAnswer: answer,
                        explanation: question.explanation || ''
                    });
                });
            });
        } else if (type === 'shortAnswer') {
            // 简答题只记录提交，不计分
            this.exercises.shortAnswer.forEach((question, index) => {
                const questionId = `shortAnswer-${index}`;
                const userAnswer = this.userAnswers[questionId] || '';
                if (userAnswer.trim().length > 0) {
                    details.push({
                        type: 'shortAnswer',
                        index: index + 1,
                        question: question.question,
                        userAnswer: userAnswer,
                        referenceAnswer: question.referenceAnswer || '无参考答案',
                        correct: null
                    });
                }
            });
        }

        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        // 保存该类型的分数
        if (type !== 'shortAnswer') {
            this.typeScores[type === 'fillBlank' ? 'fillBlank' : type] = {
                total: totalQuestions,
                correct: correctAnswers,
                score: score
            };
        } else {
            this.typeScores.shortAnswer.submitted = true;
        }

        return {
            totalQuestions,
            correctAnswers,
            score,
            details,
            type: type
        };
    }

    /**
     * 计算所有题目类型的总分数（简答题不计入）
     */
    calculateScore() {
        let totalQuestions = 0;
        let correctAnswers = 0;
        const details = [];

        // 收集阅读理解题的详细信息
        if (this.submittedTypes.has('reading')) {
            this.exercises.readingComprehension.forEach((question, index) => {
                totalQuestions++;
                const questionId = `reading-${index}`;
                const userAnswer = this.userAnswers[questionId];
                const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
                if (isCorrect) correctAnswers++;
                details.push({
                    type: 'reading',
                    index: index + 1,
                    question: question.question,
                    correct: userAnswer !== undefined ? isCorrect : null,
                    userAnswer: userAnswer !== undefined ? question.options[userAnswer] : '未作答',
                    correctAnswer: question.options[question.correctAnswer],
                    explanation: question.explanation || ''
                });
            });
        }

        // 收集语法题的详细信息
        if (this.submittedTypes.has('grammar')) {
            this.exercises.grammar.forEach((question, index) => {
                if (question.type === 'choice') {
                    totalQuestions++;
                    const questionId = `grammar-${index}`;
                    const userAnswer = this.userAnswers[questionId];
                    const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
                    if (isCorrect) correctAnswers++;
                    details.push({
                        type: 'grammar',
                        index: index + 1,
                        question: question.question,
                        correct: userAnswer !== undefined ? isCorrect : null,
                        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : '未作答',
                        correctAnswer: question.options[question.correctAnswer],
                        explanation: question.explanation || ''
                    });
                }
            });
        }

        // 收集填空题的详细信息
        if (this.submittedTypes.has('fillBlank')) {
            this.exercises.fillInTheBlanks.forEach((question, index) => {
                const globalIndex = question.globalIndex !== undefined ? question.globalIndex : index;
                question.answers.forEach((answer, ansIndex) => {
                    totalQuestions++;
                    const inputId = `fillBlank-${globalIndex}-input-${ansIndex}`;
                    const userAnswer = (this.userAnswers[inputId] || '').toLowerCase().trim();
                    const answerOptions = answer.toLowerCase().split(';').map(a => a.trim());
                    const isCorrect = userAnswer && answerOptions.some(correct => {
                        if (userAnswer === correct) return true;
                        if (correct.includes(';')) {
                            const parts = correct.split(';').map(p => p.trim());
                            return parts.some(part => userAnswer === part || userAnswer.includes(part));
                        }
                        return false;
                    });
                    if (isCorrect) correctAnswers++;
                    details.push({
                        type: 'fillBlank',
                        index: index + 1,
                        blankIndex: ansIndex + 1,
                        correct: userAnswer ? isCorrect : null,
                        userAnswer: userAnswer || '未作答',
                        correctAnswer: answer,
                        explanation: question.explanation || ''
                    });
                });
            });
        }

        // 简答题不计入总分，但显示在结果中
        this.exercises.shortAnswer.forEach((question, index) => {
            const questionId = `shortAnswer-${index}`;
            const userAnswer = this.userAnswers[questionId] || '';
            if (userAnswer.trim().length > 0) {
                details.push({
                    type: 'shortAnswer',
                    index: index + 1,
                    question: question.question,
                    userAnswer: userAnswer,
                    referenceAnswer: question.referenceAnswer || '无参考答案',
                    correct: null
                });
            }
        });

        const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        return {
            totalQuestions,
            correctAnswers,
            score,
            details
        };
    }

    /**
     * 按类型显示评分结果
     */
    displayResultByType(type, result) {
        // 更新统一提交按钮状态
        const submitBtn = document.getElementById('submit-current-type-btn');
        const statusDisplay = document.getElementById('submit-status-display');

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }

        if (statusDisplay) {
            if (type === 'shortAnswer') {
                statusDisplay.innerHTML = '<span class="text-green-600 font-semibold">已提交</span>';
            } else {
                statusDisplay.innerHTML = `<span class="text-blue-600 font-semibold">正确率: ${result.score}% (${result.correctAnswers}/${result.totalQuestions})</span>`;
            }
        }

        // 显示详细结果
        const resultDiv = document.getElementById('exercise-result');
        if (!resultDiv) return;

        const typeNames = {
            'reading': '阅读理解',
            'grammar': '语法题',
            'fillBlank': '填空题',
            'shortAnswer': '简答题'
        };

        const typeName = typeNames[type] || type;
        const scoreColor = result.score >= 80 ? 'from-green-500 to-emerald-600' :
            result.score >= 60 ? 'from-yellow-500 to-orange-500' :
                'from-red-500 to-pink-500';

        const detailsHTML = result.details.map(detail => {
            let iconClass = 'fa-question-circle text-gray-500';
            let borderClass = 'border-gray-200';

            if (detail.correct === true) {
                iconClass = 'fa-check-circle text-green-500';
                borderClass = 'border-green-200';
            } else if (detail.correct === false) {
                iconClass = 'fa-times-circle text-red-500';
                borderClass = 'border-red-200';
            }

            const typeNameDetail = detail.type === 'reading' ? '阅读理解' :
                detail.type === 'grammar' ? '语法题' :
                    detail.type === 'shortAnswer' ? '简答题' :
                        '填空题';

            // 提交后，所有题目都显示正确答案（包括未作答的题目）
            const showCorrectAnswer = detail.correctAnswer || detail.referenceAnswer;

            return `
                <div class="flex items-start gap-3 p-4 bg-white/60 rounded-xl ${borderClass} border">
                    <i class="fa ${iconClass} text-xl mt-1"></i>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800">${typeNameDetail} ${detail.index}${detail.blankIndex ? ` - 空${detail.blankIndex}` : ''}</p>
                        ${detail.question ? `<p class="text-sm text-gray-600 mt-1">${detail.question}</p>` : ''}
                        <div class="mt-2 text-sm">
                            <span class="text-gray-600">您的答案: </span>
                            <span class="font-medium ${detail.correct === true ? 'text-green-600' : detail.correct === false ? 'text-red-600' : 'text-gray-600'}">${detail.userAnswer || '未作答'}</span>
                        </div>
                        ${showCorrectAnswer ? `
                            <div class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p class="text-xs font-semibold text-blue-700 mb-1">${detail.type === 'shortAnswer' ? '参考答案' : '正确答案'}: </p>
                                <p class="text-sm text-gray-700 leading-relaxed">${detail.correctAnswer || detail.referenceAnswer}</p>
                                ${detail.explanation ? `<p class="text-xs text-gray-600 mt-2 italic">解析: ${detail.explanation}</p>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // 如果已有结果，追加新的结果；否则创建新的
        if (resultDiv.classList.contains('hidden') || resultDiv.innerHTML.trim() === '') {
            resultDiv.innerHTML = '';
        }

        const existingContent = resultDiv.innerHTML;
        const newContent = `
            <div class="mb-6 pb-4 border-b border-gray-200">
                <div class="text-center">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${scoreColor} rounded-full mb-3 shadow-lg">
                        <span class="text-2xl font-bold text-white">${type === 'shortAnswer' ? '✓' : result.score + '%'}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${typeName}提交完成</h3>
                    ${type !== 'shortAnswer' ? `<p class="text-gray-600">正确率: ${result.score}% (答对 ${result.correctAnswers} / ${result.totalQuestions} 题)</p>` : '<p class="text-gray-600">已提交，不计入总分</p>'}
                </div>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${detailsHTML}
            </div>
        `;

        resultDiv.innerHTML = existingContent + newContent;
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // 显示导出PDF按钮（只要有提交的题目就显示）
        const exportSection = document.getElementById('export-pdf-section');
        if (exportSection && this.submittedTypes.size > 0) {
            exportSection.classList.remove('hidden');
        }
    }

    /**
     * 更新右上角分数显示
     */
    updateScoreDisplay() {
        const scoreElement = document.getElementById('current-score');
        const detailsElement = document.getElementById('score-details');

        if (!scoreElement || !detailsElement) return;

        // 计算总分数（简答题不计入）
        let totalQuestions = 0;
        let correctAnswers = 0;

        if (this.submittedTypes.has('reading')) {
            totalQuestions += this.typeScores.reading.total;
            correctAnswers += this.typeScores.reading.correct;
        }

        if (this.submittedTypes.has('grammar')) {
            totalQuestions += this.typeScores.grammar.total;
            correctAnswers += this.typeScores.grammar.correct;
        }

        if (this.submittedTypes.has('fillBlank')) {
            totalQuestions += this.typeScores.fillBlank.total;
            correctAnswers += this.typeScores.fillBlank.correct;
        }

        const totalScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        scoreElement.textContent = totalScore > 0 ? `${totalScore}%` : '-';
        detailsElement.textContent = totalQuestions > 0 ? `正确率: ${totalScore}% (${correctAnswers} / ${totalQuestions} 题)` : '暂无答题';

        // 根据分数设置颜色
        if (totalScore >= 80) {
            scoreElement.className = 'text-3xl font-bold text-green-300';
        } else if (totalScore >= 60) {
            scoreElement.className = 'text-3xl font-bold text-yellow-300';
        } else if (totalScore > 0) {
            scoreElement.className = 'text-3xl font-bold text-red-300';
        } else {
            scoreElement.className = 'text-3xl font-bold text-white';
        }
    }

    /**
     * 显示评分结果（完整版本，保留用于兼容）
     */
    displayResult(result) {
        const resultDiv = document.getElementById('exercise-result');
        if (!resultDiv) return;

        const scoreColor = result.score >= 80 ? 'from-green-500 to-emerald-600' :
            result.score >= 60 ? 'from-yellow-500 to-orange-500' :
                'from-red-500 to-pink-500';

        const detailsHTML = result.details.map(detail => {
            let iconClass = 'fa-question-circle text-gray-500';
            let borderClass = 'border-gray-200';

            if (detail.correct === true) {
                iconClass = 'fa-check-circle text-green-500';
                borderClass = 'border-green-200';
            } else if (detail.correct === false) {
                iconClass = 'fa-times-circle text-red-500';
                borderClass = 'border-red-200';
            }

            const typeName = detail.type === 'reading' ? '阅读理解' :
                detail.type === 'grammar' ? '语法题' :
                    detail.type === 'shortAnswer' ? '简答题' :
                        '填空题';

            // 提交后，所有题目都显示正确答案（包括未作答的题目）
            const showCorrectAnswer = detail.correctAnswer || detail.referenceAnswer;

            return `
                <div class="flex items-start gap-3 p-4 bg-white/60 rounded-xl ${borderClass} border">
                    <i class="fa ${iconClass} text-xl mt-1"></i>
                    <div class="flex-1">
                        <p class="font-semibold text-gray-800">${typeName} ${detail.index}${detail.blankIndex ? ` - 空${detail.blankIndex}` : ''}</p>
                        ${detail.question ? `<p class="text-sm text-gray-600 mt-1">${detail.question}</p>` : ''}
                        <div class="mt-2 text-sm">
                            <span class="text-gray-600">您的答案: </span>
                            <span class="font-medium ${detail.correct === true ? 'text-green-600' : detail.correct === false ? 'text-red-600' : 'text-gray-600'}">${detail.userAnswer || '未作答'}</span>
                        </div>
                        ${showCorrectAnswer ? `
                            <div class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p class="text-xs font-semibold text-blue-700 mb-1">${detail.type === 'shortAnswer' ? '参考答案' : '正确答案'}: </p>
                                <p class="text-sm text-gray-700 leading-relaxed">${detail.correctAnswer || detail.referenceAnswer}</p>
                                ${detail.explanation ? `<p class="text-xs text-gray-600 mt-2 italic">解析: ${detail.explanation}</p>` : ''}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        resultDiv.innerHTML = `
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${scoreColor} rounded-full mb-4 shadow-lg">
                    <span class="text-3xl font-bold text-white">${result.score}%</span>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">练习完成</h3>
                <p class="text-gray-600">正确率: ${result.score}% (答对 ${result.correctAnswers} / ${result.totalQuestions} 题)</p>
            </div>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${detailsHTML}
            </div>
        `;

        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // 显示导出PDF按钮
        const exportSection = document.getElementById('export-pdf-section');
        if (exportSection) {
            exportSection.classList.remove('hidden');
        }
    }

    /**
     * 导出练习报告为PDF
     */
    exportToPDF() {
        // 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        if (!userInfo.class || !userInfo.name || !userInfo.studentId) {
            alert('请先填写学生信息！');
            return;
        }

        // 检查html2canvas是否加载
        if (typeof html2canvas === 'undefined') {
            alert('PDF导出功能需要html2canvas库，请检查网络连接！');
            return;
        }

        // 检查是否有已提交的答案
        if (Object.keys(this.submittedAnswers).length === 0 && this.submittedTypes.size === 0) {
            alert('请先提交至少一种类型的答案！');
            return;
        }

        // 保存当前答案状态，使用已提交的答案进行导出
        const originalUserAnswers = { ...this.userAnswers };
        // 直接使用已提交的答案（只导出已提交的内容）
        this.userAnswers = { ...this.submittedAnswers };
        
        const result = this.calculateScore();
        
        // 恢复原始答案状态
        this.userAnswers = originalUserAnswers;

        // 创建一个临时的报告容器
        const reportContainer = document.createElement('div');
        reportContainer.style.width = '210mm'; // A4宽度
        reportContainer.style.padding = '20mm';
        reportContainer.style.backgroundColor = '#ffffff';
        reportContainer.style.fontFamily = 'Arial, "Microsoft YaHei", sans-serif';
        reportContainer.style.position = 'absolute';
        reportContainer.style.left = '-9999px';
        reportContainer.style.top = '0';
        document.body.appendChild(reportContainer);

        // 生成报告HTML
        let reportHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="font-size: 24px; color: #333; margin-bottom: 10px;">英语阅读练习报告</h1>
            </div>
            <div style="margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 15px;">
                <p style="font-size: 14px; margin: 5px 0;"><strong>班级:</strong> ${userInfo.class}</p>
                <p style="font-size: 14px; margin: 5px 0;"><strong>姓名:</strong> ${userInfo.name}</p>
                <p style="font-size: 14px; margin: 5px 0;"><strong>学号:</strong> ${userInfo.studentId}</p>
                <p style="font-size: 14px; margin: 5px 0;"><strong>提交时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
            </div>
            <div style="margin-bottom: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
                <h2 style="font-size: 18px; margin-bottom: 10px;">总体成绩</h2>
                <p style="font-size: 16px; color: #333;"><strong>正确率:</strong> ${result.score}% (答对 ${result.correctAnswers} / ${result.totalQuestions} 题)</p>
                <div style="margin-top: 10px;">
        `;

        // 各类型得分
        if (this.submittedTypes.has('reading') && this.typeScores.reading.total > 0) {
            reportHTML += `<p style="font-size: 14px; margin: 5px 0;">阅读理解: ${this.typeScores.reading.score}% (${this.typeScores.reading.correct}/${this.typeScores.reading.total})</p>`;
        }
        if (this.submittedTypes.has('grammar') && this.typeScores.grammar.total > 0) {
            reportHTML += `<p style="font-size: 14px; margin: 5px 0;">语法题: ${this.typeScores.grammar.score}% (${this.typeScores.grammar.correct}/${this.typeScores.grammar.total})</p>`;
        }
        if (this.submittedTypes.has('fillBlank') && this.typeScores.fillBlank.total > 0) {
            reportHTML += `<p style="font-size: 14px; margin: 5px 0;">填空题: ${this.typeScores.fillBlank.score}% (${this.typeScores.fillBlank.correct}/${this.typeScores.fillBlank.total})</p>`;
        }
        if (this.submittedTypes.has('shortAnswer')) {
            reportHTML += `<p style="font-size: 14px; margin: 5px 0;">简答题: 已提交（不计入总分）</p>`;
        }

        reportHTML += `</div></div><div style="margin-top: 30px;"><h2 style="font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">详细作答情况</h2>`;

        // 详细作答情况
        result.details.forEach((detail, index) => {
            const typeName = detail.type === 'reading' ? '阅读理解' :
                detail.type === 'grammar' ? '语法题' :
                    detail.type === 'shortAnswer' ? '简答题' :
                        '填空题';

            const correctMark = detail.correct === true ? '<span style="color: green;">✓ 正确</span>' :
                detail.correct === false ? '<span style="color: red;">✗ 错误</span>' :
                    '<span style="color: gray;">未评分</span>';

            reportHTML += `
                <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background-color: ${detail.correct === true ? '#f0f9f0' : detail.correct === false ? '#fff0f0' : '#f9f9f9'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="font-size: 16px; margin: 0; color: #333;">${typeName} ${detail.index}${detail.blankIndex ? ` - 空${detail.blankIndex}` : ''}</h3>
                        ${correctMark}
                    </div>
            `;

            if (detail.question) {
                reportHTML += `<p style="font-size: 13px; color: #666; margin: 8px 0;"><strong>题目:</strong> ${detail.question}</p>`;
            }

            reportHTML += `<p style="font-size: 13px; margin: 5px 0;"><strong>您的答案:</strong> ${detail.userAnswer || '未作答'}</p>`;

            if (detail.correctAnswer || detail.referenceAnswer) {
                const correctText = detail.type === 'shortAnswer' ? '参考答案' : '正确答案';
                reportHTML += `<p style="font-size: 13px; margin: 5px 0; color: #0066cc;"><strong>${correctText}:</strong> ${detail.correctAnswer || detail.referenceAnswer}</p>`;
            }

            if (detail.explanation) {
                reportHTML += `<p style="font-size: 12px; margin: 5px 0; color: #666; font-style: italic;"><strong>解析:</strong> ${detail.explanation}</p>`;
            }

            reportHTML += `</div>`;
        });

        reportHTML += `</div>`;
        reportContainer.innerHTML = reportHTML;

        // 使用html2canvas将HTML转换为图片
        html2canvas(reportContainer, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            // 使用jsPDF生成PDF
            const { jsPDF } = window.jspdf;
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210; // A4宽度
            const pageHeight = 297; // A4高度
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            // 添加第一页
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // 如果内容超过一页，添加新页面
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // 生成文件名并下载
            const fileName = `${userInfo.class}-${userInfo.name}-${userInfo.studentId}.pdf`;
            pdf.save(fileName);

            // 清理临时元素
            document.body.removeChild(reportContainer);

            console.log('PDF导出成功:', fileName);
        }).catch(error => {
            console.error('PDF导出失败:', error);
            alert('PDF导出失败，请重试！');
            if (document.body.contains(reportContainer)) {
                document.body.removeChild(reportContainer);
            }
        });
    }

}

    /**
     * 清空用户指定题型的做题数据
     */
    clearUserAnswers(typesToClear) {
        if (!Array.isArray(typesToClear) || typesToClear.length === 0) {
            console.log('没有需要清空的题型');
            return;
        }

        console.log('需要清空的题型:', typesToClear);

        // 遍历所有已提交的答案，并移除匹配类型的答案
        const newSubmittedAnswers = {};
        for (const key in this.submittedAnswers) {
            let answerType = '';
            if (key.startsWith('reading-')) answerType = 'reading';
            else if (key.startsWith('grammar-')) answerType = 'grammar';
            else if (key.startsWith('fillBlank-')) answerType = 'fillBlank';
            else if (key.startsWith('shortAnswer-')) answerType = 'shortAnswer';

            // 如果答案类型不在待清除列表中，则保留
            if (!typesToClear.includes(answerType)) {
                newSubmittedAnswers[key] = this.submittedAnswers[key];
            }
        }
        this.submittedAnswers = newSubmittedAnswers;

        // 重置指定类型的分数和提交状态
        typesToClear.forEach(type => {
            this.submittedTypes.delete(type);

            if (type === 'reading' || type === 'grammar' || type === 'fillBlank') {
                this.typeScores[type] = { total: 0, correct: 0, score: 0 };
            } else if (type === 'shortAnswer') {
                this.typeScores.shortAnswer.submitted = false;
            }
        });

        // 清空页面上的输入（选择和文本框）
        document.querySelectorAll('.exercise-item').forEach(item => {
            const itemType = item.dataset.type;
            if (typesToClear.includes(itemType)) {
                // 清空单选按钮
                item.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
                // 清空文本框
                item.querySelectorAll('input[type="text"], textarea').forEach(input => {
                    input.value = '';
                });
            }
        });

        // 重新渲染当前筛选的题目，以刷新显示状态
        this.renderExercises();

        // 更新总分显示
        this.updateScoreDisplay();

        // 更新提交按钮状态
        this.updateSubmitButtonsState();

        // 隐藏并清空结果区域
        const resultDiv = document.getElementById('exercise-result');
        if (resultDiv) {
            resultDiv.innerHTML = '';
            resultDiv.classList.add('hidden');
        }

        console.log('指定题型的数据已清空');
    }

}

    /**
     * 获取实时总分（不区分提交状态）
     */
    getLiveScore() {
        // 先收集当前所有答案
        this.collectAnswers();

        let totalCorrect = 0;
        let totalQuestions = 0;

        // 实时计算所有计分题型的分数
        ['reading', 'grammar', 'fillBlank'].forEach(type => {
            const result = this.calculateScoreByType(type);
            totalCorrect += result.correctAnswers;
            totalQuestions += result.totalQuestions;
        });

        const liveScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        return {
            score: liveScore,
            correct: totalCorrect,
            total: totalQuestions
        };
    }

}

// 初始化练习管理器
window.exerciseManager = new ExerciseManager();
