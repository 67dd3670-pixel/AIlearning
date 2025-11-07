/**
 * 数据上传和管理工具
 * 允许用户上传和管理自己的课程数据
 */
class DataUploader {
    constructor() {
        this.init();
    }

    init() {
        this.createUploadInterface();
        this.setupEventListeners();
        this.loadSavedData();
    }

    createUploadInterface() {
        // 创建上传界面
        const uploadDiv = document.createElement('div');
        uploadDiv.id = 'data-uploader';
        uploadDiv.className = 'fixed bottom-6 left-6 z-40';
        uploadDiv.innerHTML = `
            <button id="upload-btn" class="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full flex items-center justify-center btn-effect shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
                <i class="fa fa-upload text-xl"></i>
            </button>
        `;

        document.body.appendChild(uploadDiv);

        // 创建上传模态框
        const modalDiv = document.createElement('div');
        modalDiv.id = 'upload-modal';
        modalDiv.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 hidden';
        modalDiv.innerHTML = `
            <div class="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4 shadow-2xl border border-white/20 animate-slide-up">
                <div class="flex justify-between items-center mb-6 pb-3 border-b border-blue-200">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                            <i class="fa fa-upload text-white text-lg"></i>
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold gradient-text">课程数据管理</h3>
                            <p class="text-gray-600 text-xs mt-1">上传和管理您的学习内容</p>
                        </div>
                    </div>
                    <button id="close-upload-modal" class="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center btn-effect transition-all duration-300 hover:scale-110">
                        <i class="fa fa-times text-gray-600"></i>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- 文件上传区域 -->
                    <div class="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-blue-100">
                        <h4 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fa fa-file-upload text-blue-500 mr-2"></i>
                            上传课程数据文件
                        </h4>
                        <div class="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                            <i class="fa fa-cloud-upload text-4xl text-blue-400 mb-4"></i>
                            <p class="text-gray-600 mb-4">拖拽文件到这里，或点击选择文件</p>
                            <p class="text-xs text-gray-500 mb-4">支持JSON格式课程数据或JS格式填空题</p>
                            <input type="file" id="file-input" accept=".json,.js" class="hidden">
                            <button id="select-file-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg btn-effect font-medium">
                                选择文件
                            </button>
                        </div>
                        
                        <!-- 填空题上传区域 -->
                        <div class="mt-6 bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-blue-100">
                            <h4 class="text-lg font-semibold mb-4 flex items-center">
                                <i class="fa fa-clone text-red-500 mr-2"></i>
                                上传填空题文件（JS格式）
                            </h4>
                            <div class="border-2 border-dashed border-red-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                                <i class="fa fa-file-code-o text-3xl text-red-400 mb-3"></i>
                                <p class="text-gray-600 mb-3 text-sm">拖拽JS格式填空题文件到这里</p>
                                <input type="file" id="fill-blank-input" accept=".js" class="hidden">
                                <button id="select-fill-blank-btn" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg btn-effect font-medium text-sm">
                                    选择填空题文件
                                </button>
                            </div>
                        </div>

                        <!-- 简答题上传区域 -->
                        <div class="mt-6 bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-blue-100">
                            <h4 class="text-lg font-semibold mb-4 flex items-center">
                                <i class="fa fa-edit text-green-500 mr-2"></i>
                                上传简答题文件（JS格式）
                            </h4>
                            <div class="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
                                <i class="fa fa-file-code-o text-3xl text-green-400 mb-3"></i>
                                <p class="text-gray-600 mb-3 text-sm">拖拽JS格式简答题文件到这里</p>
                                <input type="file" id="short-answer-input" accept=".js" class="hidden">
                                <button id="select-short-answer-btn" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg btn-effect font-medium text-sm">
                                    选择简答题文件
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 数据预览区域 -->
                    <div id="data-preview" class="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-blue-100 hidden">
                        <h4 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fa fa-eye text-blue-500 mr-2"></i>
                            数据预览
                        </h4>
                        <div id="preview-content" class="space-y-4">
                            <!-- 预览内容将在这里显示 -->
                        </div>
                        <div class="flex justify-end gap-3 mt-6">
                            <button id="cancel-upload" class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg btn-effect font-medium">
                                取消
                            </button>
                            <button id="confirm-upload" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg btn-effect font-medium">
                                确认上传
                            </button>
                        </div>
                    </div>

                    <!-- 已保存的数据列表 -->
                    <div class="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-blue-100">
                        <h4 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fa fa-database text-blue-500 mr-2"></i>
                            已保存的课程数据
                        </h4>
                        <div id="saved-data-list" class="space-y-3">
                            <!-- 保存的数据列表将在这里显示 -->
                        </div>
                    </div>

                    <!-- 数据模板下载 -->
                    <div class="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-blue-100">
                        <h4 class="text-lg font-semibold mb-4 flex items-center">
                            <i class="fa fa-download text-blue-500 mr-2"></i>
                            数据模板
                        </h4>
                        <p class="text-gray-600 mb-4">下载标准数据模板，按照格式准备您的内容</p>
                        <button id="download-template" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg btn-effect font-medium">
                            <i class="fa fa-download mr-2"></i>下载模板
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalDiv);
    }

    setupEventListeners() {
        // 上传按钮
        document.getElementById('upload-btn')?.addEventListener('click', () => {
            document.getElementById('upload-modal').classList.remove('hidden');
        });

        // 关闭模态框
        document.getElementById('close-upload-modal')?.addEventListener('click', () => {
            document.getElementById('upload-modal').classList.add('hidden');
        });

        // 选择文件按钮
        document.getElementById('select-file-btn')?.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        // 文件输入变化
        document.getElementById('file-input')?.addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        // 填空题文件输入变化
        document.getElementById('select-fill-blank-btn')?.addEventListener('click', () => {
            document.getElementById('fill-blank-input').click();
        });

        document.getElementById('fill-blank-input')?.addEventListener('change', (e) => {
            this.handleFillBlankFileSelect(e.target.files[0]);
        });

        // 简答题文件输入变化
        document.getElementById('select-short-answer-btn')?.addEventListener('click', () => {
            document.getElementById('short-answer-input').click();
        });

        document.getElementById('short-answer-input')?.addEventListener('change', (e) => {
            this.handleShortAnswerFileSelect(e.target.files[0]);
        });

        // 拖拽上传
        const dropZone = document.querySelector('#upload-modal .border-dashed');
        dropZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-blue-500', 'bg-blue-50');
        });

        dropZone?.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-blue-500', 'bg-blue-50');
        });

        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-blue-500', 'bg-blue-50');
            const file = e.dataTransfer.files[0];
            if (file && (file.type === 'application/json' || file.name.endsWith('.json') || file.name.endsWith('.js'))) {
                if (file.name.endsWith('.js')) {
                    this.handleFillBlankFileSelect(file);
                } else {
                    this.handleFileSelect(file);
                }
            }
        });

        // 确认上传
        document.getElementById('confirm-upload')?.addEventListener('click', () => {
            this.confirmUpload();
        });

        // 取消上传
        document.getElementById('cancel-upload')?.addEventListener('click', () => {
            this.cancelUpload();
        });

        // 下载模板
        document.getElementById('download-template')?.addEventListener('click', () => {
            this.downloadTemplate();
        });
    }

    handleFileSelect(file) {
        if (!file) return;
        
        const isJson = file.type === 'application/json' || file.name.endsWith('.json');
        const isJs = file.name.endsWith('.js');
        
        if (!isJson && !isJs) {
            alert('请选择JSON或JS格式的文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (isJs) {
                    // JS文件需要特殊处理
                    this.handleJsFile(e.target.result);
                } else {
                    const data = JSON.parse(e.target.result);
                    this.previewData(data);
                }
            } catch (error) {
                alert('文件格式错误，请检查文件格式');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    /**
     * 处理填空题JS文件
     */
    handleFillBlankFileSelect(file) {
        if (!file || !file.name.endsWith('.js')) {
            alert('请选择JS格式的填空题文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.parseFillBlankJs(e.target.result);
            } catch (error) {
                alert('填空题文件解析失败: ' + error.message);
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    /**
     * 解析填空题JS文件
     */
    parseFillBlankJs(content) {
        // 尝试提取JavaScript对象
        // 支持格式: const fillInTheBlanks = [...] 或 var fillInTheBlanks = [...] 或 window.fillInTheBlanks = [...]
        const patterns = [
            /(?:const|var|let|window\.)\s*fillInTheBlanks\s*=\s*(\[[\s\S]*?\]);/,
            /fillInTheBlanks\s*=\s*(\[[\s\S]*?\]);/
        ];

        let fillBlanks = null;
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                try {
                    fillBlanks = JSON.parse(match[1]);
                    break;
                } catch (e) {
                    console.warn('JSON解析失败，尝试eval:', e);
                }
            }
        }

        // 如果正则匹配失败，尝试执行JS代码（安全风险较低，因为是本地文件）
        if (!fillBlanks) {
            try {
                // 创建一个新的作用域来执行代码
                const func = new Function('var module = {}; var exports = {}; ' + content + '; return typeof fillInTheBlanks !== "undefined" ? fillInTheBlanks : (typeof module.exports !== "undefined" && module.exports.fillInTheBlanks ? module.exports.fillInTheBlanks : null);');
                fillBlanks = func();
            } catch (e) {
                throw new Error('无法解析JS文件格式，请确保文件包含 fillInTheBlanks 数组变量');
            }
        }

        if (!Array.isArray(fillBlanks)) {
            throw new Error('填空题数据必须是数组格式');
        }

        // 验证填空题格式
        fillBlanks.forEach((item, index) => {
            if (!item.text || !Array.isArray(item.answers) || item.answers.length === 0) {
                throw new Error(`填空题 ${index + 1} 格式不正确，需要包含 text 和 answers 字段`);
            }
        });

        // 保存到localStorage并更新练习管理器
        localStorage.setItem('fillInTheBlanks', JSON.stringify(fillBlanks));
        
        // 如果练习管理器已初始化，更新它
        if (typeof window.exerciseManager !== 'undefined') {
            window.exerciseManager.exercises.fillInTheBlanks = fillBlanks;
            window.exerciseManager.renderExercises();
        }

        alert(`成功加载 ${fillBlanks.length} 个填空题！`);
        console.log('填空题已加载:', fillBlanks);
    }

    /**
     * 处理简答题JS文件
     */
    handleShortAnswerFileSelect(file) {
        if (!file || !file.name.endsWith('.js')) {
            alert('请选择JS格式的简答题文件');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.parseShortAnswerJs(e.target.result);
            } catch (error) {
                alert('简答题文件解析失败: ' + error.message);
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    /**
     * 解析简答题JS文件
     */
    parseShortAnswerJs(content) {
        // 尝试提取JavaScript对象
        const patterns = [
            /(?:const|var|let|window\.)\s*shortAnswerQuestions\s*=\s*(\[[\s\S]*?\]);/,
            /shortAnswerQuestions\s*=\s*(\[[\s\S]*?\]);/
        ];

        let shortAnswers = null;
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                try {
                    shortAnswers = JSON.parse(match[1]);
                    break;
                } catch (e) {
                    console.warn('JSON解析失败，尝试eval:', e);
                }
            }
        }

        // 如果正则匹配失败，尝试执行JS代码
        if (!shortAnswers) {
            try {
                const func = new Function('var module = {}; var exports = {}; ' + content + '; return typeof shortAnswerQuestions !== "undefined" ? shortAnswerQuestions : (typeof module.exports !== "undefined" && module.exports.shortAnswerQuestions ? module.exports.shortAnswerQuestions : null);');
                shortAnswers = func();
            } catch (e) {
                throw new Error('无法解析JS文件格式，请确保文件包含 shortAnswerQuestions 数组变量');
            }
        }

        if (!Array.isArray(shortAnswers)) {
            throw new Error('简答题数据必须是数组格式');
        }

        // 验证简答题格式
        shortAnswers.forEach((item, index) => {
            if (!item.question || typeof item.question !== 'string') {
                throw new Error(`简答题 ${index + 1} 格式不正确，需要包含 question 字段`);
            }
        });

        // 保存到localStorage并更新练习管理器
        localStorage.setItem('shortAnswerQuestions', JSON.stringify(shortAnswers));
        
        // 如果练习管理器已初始化，更新它
        if (typeof window.exerciseManager !== 'undefined') {
            window.exerciseManager.exercises.shortAnswer = shortAnswers;
            window.exerciseManager.renderExercises();
        }

        alert(`成功加载 ${shortAnswers.length} 道简答题！`);
        console.log('简答题已加载:', shortAnswers);
    }

    /**
     * 处理JS格式的课程数据文件
     */
    handleJsFile(content) {
        // 尝试提取lessonData对象
        const patterns = [
            /(?:const|var|let|window\.)\s*lessonData\s*=\s*(\{[\s\S]*?\});/,
            /lessonData\s*=\s*(\{[\s\S]*?\});/
        ];

        let lessonData = null;
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                try {
                    // 尝试直接解析JSON
                    lessonData = JSON.parse(match[1]);
                    break;
                } catch (e) {
                    // 如果JSON解析失败，可能需要eval（不推荐但支持）
                    console.warn('JSON解析失败:', e);
                }
            }
        }

        if (!lessonData) {
            throw new Error('无法从JS文件中提取lessonData对象');
        }

        this.previewData(lessonData);
    }

    previewData(data) {
        const previewDiv = document.getElementById('data-preview');
        const contentDiv = document.getElementById('preview-content');

        // 验证数据格式
        if (!this.validateData(data)) {
            alert('数据格式不正确，请参考模板格式');
            return;
        }

        // 显示预览
        contentDiv.innerHTML = `
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-blue-50 rounded-xl p-4">
                    <h5 class="font-semibold text-blue-700 mb-2">课程信息</h5>
                    <p><strong>标题：</strong>${data.courseInfo?.title || '未设置'}</p>
                    <p><strong>单元：</strong>${data.courseInfo?.unit || '未设置'}</p>
                    <p><strong>段落数：</strong>${data.paragraphs?.length || 0}</p>
                </div>
                <div class="bg-green-50 rounded-xl p-4">
                    <h5 class="font-semibold text-green-700 mb-2">数据统计</h5>
                    <p><strong>总词汇数：</strong>${this.getTotalVocabularyCount(data)}</p>
                    <p><strong>总衍生词：</strong>${this.getTotalDerivationsCount(data)}</p>
                    <p><strong>平均词汇/段：</strong>${this.getAverageVocabularyPerParagraph(data)}</p>
                    <p><strong>平均衍生词/词：</strong>${this.getAverageDerivationsPerWord(data)}</p>
                </div>
            </div>
            <div class="mt-4">
                <h5 class="font-semibold text-purple-700 mb-2">段落列表</h5>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                    ${data.paragraphs?.map((para, index) => {
                        const derivationsCount = para.vocabulary?.reduce((total, vocab) => total + (vocab.derivations?.length || 0), 0) || 0;
                        return `
                        <div class="bg-white rounded-lg p-3 border border-gray-200">
                            <strong>段落 ${index + 1}:</strong> ${para.title}
                            <div class="text-sm text-gray-600">
                                词汇数：${para.vocabulary?.length || 0} |
                                衍生词：${derivationsCount} |
                                阅读时间：${para.readingTime || '未设置'}
                            </div>
                        </div>
                    `;}).join('') || '<p>暂无段落数据</p>'}
                </div>
            </div>
        `;

        previewDiv.classList.remove('hidden');
        this.pendingData = data;
    }

    validateData(data) {
        // 基本数据格式验证
        if (!data || typeof data !== 'object') return false;
        if (!data.paragraphs || !Array.isArray(data.paragraphs)) return false;

        // 验证每个段落
        return data.paragraphs.every(para => {
            if (!para.id || !para.title || !para.englishText || !Array.isArray(para.vocabulary)) {
                return false;
            }

            // 验证词汇格式（兼容新旧格式）
            return para.vocabulary.every(vocab => {
                if (!vocab.word || !vocab.meaning || !vocab.example) {
                    return false;
                }

                // 检查衍生词格式（如果存在）
                if (vocab.derivations) {
                    return vocab.derivations.every(derivation => {
                        return derivation.word && derivation.partOfSpeech && derivation.meaning;
                    });
                }

                // 兼容旧的 derivation 字段
                if (vocab.derivation) {
                    return typeof vocab.derivation === 'string';
                }

                return true;
            });
        });
    }

    getTotalVocabularyCount(data) {
        return data.paragraphs?.reduce((total, para) => total + (para.vocabulary?.length || 0), 0) || 0;
    }

    getTotalDerivationsCount(data) {
        return data.paragraphs?.reduce((total, para) =>
            total + para.vocabulary?.reduce((vocabTotal, vocab) =>
                vocabTotal + (vocab.derivations?.length || 0), 0), 0) || 0;
    }

    getAverageVocabularyPerParagraph(data) {
        const total = this.getTotalVocabularyCount(data);
        const count = data.paragraphs?.length || 0;
        return count > 0 ? Math.round(total / count) : 0;
    }

    getAverageDerivationsPerWord(data) {
        const totalDerivations = this.getTotalDerivationsCount(data);
        const totalVocabulary = this.getTotalVocabularyCount(data);
        return totalVocabulary > 0 ? Math.round(totalDerivations / totalVocabulary * 10) / 10 : 0;
    }

    confirmUpload() {
        if (!this.pendingData) return;

        // 保存数据到localStorage
        const savedData = JSON.parse(localStorage.getItem('savedCourseData') || '[]');
        const newData = {
            id: Date.now(),
            name: this.pendingData.courseInfo?.title || `课程数据 ${savedData.length + 1}`,
            data: this.pendingData,
            uploadedAt: new Date().toISOString()
        };

        savedData.push(newData);
        localStorage.setItem('savedCourseData', JSON.stringify(savedData));

        // 应用新数据
        this.applyData(this.pendingData);

        // 刷新列表
        this.loadSavedData();

        // 隐藏预览
        document.getElementById('data-preview').classList.add('hidden');

        alert('数据上传成功！');
    }

    cancelUpload() {
        document.getElementById('data-preview').classList.add('hidden');
        this.pendingData = null;
        document.getElementById('file-input').value = '';
    }

    applyData(data) {
        // 应用数据到全局变量
        window.lessonData = data;
        window.pageConfig = data.pageConfig || {};

        // 重新初始化内容渲染器
        if (window.contentRenderer) {
            window.contentRenderer.loadLessonData();
            window.contentRenderer.renderCurrentPage();
        }
    }

    loadSavedData() {
        const savedData = JSON.parse(localStorage.getItem('savedCourseData') || '[]');
        const listDiv = document.getElementById('saved-data-list');

        if (savedData.length === 0) {
            listDiv.innerHTML = '<p class="text-gray-500 text-center py-4">暂无保存的课程数据</p>';
            return;
        }

        listDiv.innerHTML = savedData.map(item => {
            const derivationsCount = this.getTotalDerivationsCount(item.data);
            return `
            <div class="bg-white rounded-xl p-4 border border-gray-200">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h5 class="font-semibold text-gray-800">${item.name}</h5>
                        <p class="text-sm text-gray-600">
                            上传时间：${new Date(item.uploadedAt).toLocaleString('zh-CN')}
                        </p>
                        <p class="text-sm text-gray-600">
                            段落数：${item.data.paragraphs?.length || 0} |
                            词汇数：${this.getTotalVocabularyCount(item.data)} |
                            衍生词：${derivationsCount}
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="dataUploader.applySavedData(${item.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm btn-effect">
                            应用
                        </button>
                        <button onclick="dataUploader.deleteSavedData(${item.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm btn-effect">
                            删除
                        </button>
                    </div>
                </div>
            </div>
        `;}).join('');
    }

    applySavedData(id) {
        const savedData = JSON.parse(localStorage.getItem('savedCourseData') || '[]');
        const item = savedData.find(d => d.id === id);

        if (item) {
            this.applyData(item.data);
            document.getElementById('upload-modal').classList.add('hidden');
            alert('数据应用成功！');
        }
    }

    deleteSavedData(id) {
        if (!confirm('确定要删除这个课程数据吗？')) return;

        const savedData = JSON.parse(localStorage.getItem('savedCourseData') || '[]');
        const filteredData = savedData.filter(d => d.id !== id);
        localStorage.setItem('savedCourseData', JSON.stringify(filteredData));

        this.loadSavedData();
    }

    downloadTemplate() {
        const template = {
            courseInfo: {
                title: "您的课程标题",
                unit: "Unit 1",
                unitTitle: "单元标题",
                totalParagraphs: 2,
                totalPages: 1,
                description: "课程描述"
            },
            paragraphs: [
                {
                    id: 1,
                    title: "第一段标题",
                    subtitle: "副标题",
                    readingTime: "1分钟",
                    englishText: "这里是英文文本内容...",
                    vocabulary: [
                        {
                            word: "example",
                            phonetic: "/ɪɡˈzæmpl/",
                            level: "核心词汇",
                            meaning: "例子，示例",
                            example: {
                                english: "This is an example sentence.",
                                chinese: "这是一个例句。"
                            },
                            derivations: [
                                {
                                    word: "example",
                                    phonetic: "/ɪɡˈzæmpl/",
                                    partOfSpeech: "n.",
                                    meaning: "例子，示例",
                                    note: "可数名词，用来说明或代表某类事物"
                                },
                                {
                                    word: "exemplary",
                                    phonetic: "/ɪɡˈzempləri/",
                                    partOfSpeech: "adj.",
                                    meaning: "模范的，典范的",
                                    note: "形容词形式，描述值得模仿的典范"
                                },
                                {
                                    word: "exemplify",
                                    phonetic: "/ɪɡˈzemplɪfaɪ/",
                                    partOfSpeech: "v.",
                                    meaning: "举例说明，例证",
                                    note: "动词形式，指通过例子来说明"
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    title: "第二段标题",
                    subtitle: "副标题",
                    readingTime: "1分钟",
                    englishText: "这里是第二段的英文文本内容...",
                    vocabulary: []
                }
            ],
            pageConfig: {
                itemsPerPage: 7,
                animationDuration: 300,
                ttsSettings: {
                    rate: 0.8,
                    pitch: 1,
                    volume: 1
                }
            }
        };

        const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'course-data-template.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 初始化数据上传工具
document.addEventListener('DOMContentLoaded', () => {
    window.dataUploader = new DataUploader();
});