/**
 * 内容渲染引擎
 * 负责将数据动态渲染到页面模板中
 */
class ContentRenderer {
    constructor() {
        this.currentParagraphs = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.collectedWords = JSON.parse(localStorage.getItem('collectedWords') || '[]');
        this.ttsController = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentParagraphId = null;
        this.init();
    }

    init() {
        this.loadLessonData();
        this.initializeTTSController();
        this.setupEventListeners();
        this.renderParagraphNavigation();
        this.updatePagination();
        this.updateCollectionCount(); // 确保初始化时更新收藏计数
        this.renderCurrentPage();
    }

    loadLessonData() {
        if (typeof window.lessonData !== 'undefined') {
            this.lessonData = window.lessonData;
            this.pageConfig = window.pageConfig || {};
            this.totalPages = Math.ceil(this.lessonData.paragraphs.length / (this.pageConfig.itemsPerPage || 7));
        } else {
            console.error('课程数据未加载');
            this.lessonData = { paragraphs: [] };
        }
    }

    renderParagraphNavigation() {
        const navContainer = document.getElementById('paragraph-nav-container');
        if (!navContainer || !this.lessonData.paragraphs) return;

        const colors = [
            'from-purple-500 to-pink-500',
            'from-blue-500 to-cyan-500',
            'from-green-500 to-teal-500',
            'from-yellow-500 to-orange-500',
            'from-red-500 to-pink-500',
            'from-indigo-500 to-purple-500',
            'from-teal-500 to-blue-500',
            'from-pink-500 to-rose-500',
            'from-amber-500 to-yellow-500',
            'from-lime-500 to-green-500',
            'from-cyan-500 to-blue-500',
            'from-violet-500 to-purple-500',
            'from-fuchsia-500 to-pink-500',
            'from-rose-500 to-red-500'
        ];

        navContainer.innerHTML = this.lessonData.paragraphs.map((paragraph, index) => {
            const colorClass = colors[index % colors.length];
            return `
                <button class="paragraph-nav-btn group px-3 py-2 bg-gradient-to-r ${colorClass} text-white rounded-lg btn-effect font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm" data-para="${paragraph.id}">
                    <i class="fa fa-file-text-o block mb-1 text-xs"></i>
                    段落 ${paragraph.id}
                </button>
            `;
        }).join('');

        console.log(`段落导航已生成，共 ${this.lessonData.paragraphs.length} 个段落`);
    }

    /**
     * 更新段落导航状态
     */
    updateParagraphNavigation() {
        const startIndex = (this.currentPage - 1) * (this.pageConfig.itemsPerPage || 7);
        const endIndex = Math.min(startIndex + (this.pageConfig.itemsPerPage || 7), this.lessonData.paragraphs.length);

        // 更新段落导航按钮状态
        document.querySelectorAll('.paragraph-nav-btn').forEach(btn => {
            const paraId = parseInt(btn.dataset.para);
            if (paraId >= startIndex + 1 && paraId <= endIndex) {
                // 当前页面的段落
                btn.classList.add('ring-2', 'ring-white', 'ring-opacity-60');
                btn.classList.remove('opacity-60');
            } else {
                // 其他页面的段落
                btn.classList.remove('ring-2', 'ring-white', 'ring-opacity-60');
                btn.classList.add('opacity-60');
            }
        });
    }

    initializeTTSController() {
        // 初始化TTS控制器
        if (typeof AdvancedTTSController !== 'undefined') {
            try {
                this.ttsController = new AdvancedTTSController();
                console.log('高级TTS控制器初始化成功');
            } catch (error) {
                console.warn('高级TTS控制器初始化失败，将使用基础TTS:', error);
                this.ttsController = null;
            }
        } else {
            console.warn('未找到高级TTS控制器，将使用基础TTS');
            this.ttsController = null;
        }
    }

    setupEventListeners() {
        // 分页导航
        document.getElementById('prev-page')?.addEventListener('click', () => this.previousPage());
        document.getElementById('next-page')?.addEventListener('click', () => this.nextPage());

        // 段落导航（优先处理，避免被其他事件干扰）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.read-paragraph')) {
                const paraId = parseInt(e.target.closest('.read-paragraph').dataset.para);
                this.readParagraph(paraId);
                return; // 确保段落朗读优先处理
            } else if (e.target.closest('.paragraph-nav-btn')) {
                const paraId = parseInt(e.target.closest('.paragraph-nav-btn').dataset.para);
                this.navigateToParagraph(paraId);
                return;
            } else if (e.target.closest('.prev-para')) {
                const paraId = parseInt(e.target.closest('.prev-para').dataset.para);
                this.previousParagraph(paraId);
            } else if (e.target.closest('.next-para')) {
                const paraId = parseInt(e.target.closest('.next-para').dataset.para);
                this.nextParagraph(paraId);
            }
        });

        // 词汇功能
        document.addEventListener('click', (e) => {
            if (e.target.closest('.play-audio')) {
                const word = e.target.closest('.play-audio').dataset.word;
                this.playWordAudio(word);
            } else if (e.target.closest('.play-derivation-audio')) {
                const word = e.target.closest('.play-derivation-audio').dataset.word;
                this.playWordAudio(word);
            } else if (e.target.closest('.toggle-bookmark')) {
                const button = e.target.closest('.toggle-bookmark');
                const paraId = parseInt(button.dataset.para);
                this.toggleBookmark(button, paraId);
            } else if (e.target.closest('.toggle-derivations')) {
                const button = e.target.closest('.toggle-derivations');
                const derivationsId = button.dataset.derivationsId;
                this.toggleDerivations(button, derivationsId);
            }
        });

        // 收藏功能事件绑定
        document.getElementById('collection-btn')?.addEventListener('click', () => this.showCollectionModal());
        document.getElementById('view-collection')?.addEventListener('click', () => this.showCollectionModal());
        document.getElementById('close-modal')?.addEventListener('click', () => this.hideCollectionModal());
        document.getElementById('export-excel')?.addEventListener('click', () => this.exportToExcel());
        document.getElementById('export-collection')?.addEventListener('click', () => this.exportToExcel());
        document.getElementById('export-from-modal')?.addEventListener('click', () => this.exportToExcel());
        document.getElementById('clear-collection')?.addEventListener('click', () => this.clearCollection());

        // 语法翻译按钮（使用事件委托）
        document.addEventListener('click', (e) => {
            if (e.target.closest('.toggle-translation')) {
                const button = e.target.closest('.toggle-translation');
                const paraId = button.dataset.para;
                this.toggleTranslation(button, paraId);
            } else if (e.target.closest('.toggle-grammar')) {
                const button = e.target.closest('.toggle-grammar');
                const paraId = button.dataset.para;
                this.toggleGrammar(button, paraId);
            } else if (e.target.closest('.toggle-vocab')) {
                const button = e.target.closest('.toggle-vocab');
                const paraId = button.dataset.para;
                this.toggleVocabulary(button, paraId);
            } else if (e.target.closest('.vocab-highlight')) {
                // 处理词汇高亮点击事件
                const highlight = e.target.closest('.vocab-highlight');
                const word = highlight.dataset.word;
                this.playWordAudio(word);

                // 添加点击动画效果
                highlight.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    highlight.style.transform = '';
                }, 200);

                e.stopPropagation(); // 阻止事件冒泡
            }
        });
    }

    renderCurrentPage() {
        const container = document.getElementById('content-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * (this.pageConfig.itemsPerPage || 7);
        const endIndex = Math.min(startIndex + (this.pageConfig.itemsPerPage || 7), this.lessonData.paragraphs.length);

        this.currentParagraphs = this.lessonData.paragraphs.slice(startIndex, endIndex);

        container.innerHTML = '';
        this.currentParagraphs.forEach(paragraph => {
            container.appendChild(this.createParagraphElement(paragraph));
        });

        this.updatePagination();
        this.updateParagraphNavigation();

        // 应用词汇高亮和恢复展开状态
        setTimeout(() => {
            this.applyVocabHighlighting();
            this.restoreVocabExpansionStates();
        }, 100);
    }

    createParagraphElement(paragraph) {
        const section = document.createElement('section');
        section.id = `para-${paragraph.id}`;
        section.className = 'mb-12 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl p-8 md:p-10 card-shadow border border-white/20 animate-fade-in';

        section.innerHTML = `
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg inline-flex items-center gap-2">
                            <i class="fa fa-file-text"></i>
                            段落 ${paragraph.id}
                        </span>
                        <div class="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-30 animate-pulse"></div>
                    </div>
                    <div class="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                        <i class="fa fa-clock-o"></i>
                        <span>建议阅读时间：${paragraph.readingTime}</span>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button class="prev-para bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center btn-effect transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" ${paragraph.id === 1 ? 'disabled' : ''} data-para="${paragraph.id}">
                        <i class="fa fa-chevron-left mr-2"></i>
                        <span class="hidden sm:inline">上一段</span>
                    </button>
                    <button class="read-paragraph bg-gradient-to-r from-accent to-green-500 text-white px-6 py-3 rounded-xl flex items-center btn-effect font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" data-para="${paragraph.id}">
                        <i class="fa fa-volume-up mr-3 text-lg"></i>
                        <span class="hidden sm:inline">朗读本段</span>
                    </button>
                    <button class="next-para bg-blue-100 hover:bg-blue-200 text-blue-600 px-4 py-2 rounded-lg flex items-center btn-effect transition-all duration-300" ${paragraph.id === this.lessonData.paragraphs.length ? 'disabled' : ''} data-para="${paragraph.id}">
                        <span class="hidden sm:inline">下一段</span>
                        <i class="fa fa-chevron-right ml-2"></i>
                    </button>
                </div>
            </div>

            <div class="english-text mb-8 text-xl text-gray-800 leading-relaxed font-medium bg-white/60 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                <span class="text-3xl font-bold gradient-text block mb-4 text-center">${paragraph.title}</span>
                <div class="text-center text-gray-600 italic mb-4">${paragraph.subtitle}</div>
                <p class="text-lg paragraph-content" data-paragraph-id="${paragraph.id}">${paragraph.englishText}</p>
            </div>

            <div class="vocab-section mb-8">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold gradient-text flex items-center para-title">
                        <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                            <i class="fa fa-book text-white"></i>
                        </div>
                        词汇知识
                    </h3>
                    <button class="toggle-vocab w-10 h-10 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center btn-effect transition-all duration-300 transform hover:scale-110 shadow-lg"
                            data-para="${paragraph.id}"
                            title="隐藏词汇知识">
                        <i class="fa fa-chevron-up text-xs"></i>
                    </button>
                </div>
                <div class="vocab-content grid md:grid-cols-2 gap-6" id="vocab-content-${paragraph.id}">
                    ${paragraph.vocabulary.map(vocab => this.createVocabularyElement(vocab, paragraph.id)).join('')}
                </div>
            </div>

            <!-- 语法知识与翻译部分 -->
            <div class="grammar-translation">
                <h3 class="text-xl font-semibold mb-4 text-secondary flex items-center">
                    <i class="fa fa-language mr-2"></i> 语法知识与翻译
                </h3>
                <div class="flex flex-wrap gap-3 mb-4">
                    <button class="toggle-translation bg-secondary text-white px-4 py-2 rounded-lg flex items-center btn-effect" data-para="${paragraph.id}">
                        <i class="fa fa-eye mr-2"></i> 显示中文翻译
                    </button>
                    <button class="toggle-grammar bg-secondary/80 text-white px-4 py-2 rounded-lg flex items-center btn-effect" data-para="${paragraph.id}">
                        <i class="fa fa-code mr-2"></i> 显示语法分析
                    </button>
                </div>

                <div class="chinese-translation hidden bg-gray-50 p-4 rounded-lg mb-4" id="translation-${paragraph.id}">
                    <h4 class="font-semibold mb-2 text-secondary">中文翻译：</h4>
                    <p class="text-gray-700">${paragraph.chineseTranslation || '暂无翻译'}</p>
                </div>

                <div class="grammar-analysis hidden bg-blue-50 p-4 rounded-lg" id="grammar-${paragraph.id}">
                    <h4 class="font-semibold mb-2 text-primary">语法分析：</h4>
                    <div class="space-y-4 text-gray-700">
                        <div>
                            <p class="font-medium">${paragraph.grammarAnalysis || '暂无语法分析'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return section;
    }

    createVocabularyElement(vocab, paragraphId) {
        const isCollected = this.collectedWords.some(w => w.word === vocab.word);

        return `
            <div class="vocab-item bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl p-6 vocab-item-hover vocab-card border border-purple-100 shadow-lg" data-word="${vocab.word}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="vocab-word text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${vocab.word}</span>
                            <span class="vocab-phonetic text-purple-500 font-medium">${vocab.phonetic}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium">
                                ${vocab.level}
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="play-audio w-10 h-10 bg-gradient-to-r from-accent to-green-500 text-white rounded-xl flex items-center justify-center btn-effect shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300" data-word="${vocab.word}">
                            <i class="fa fa-volume-up"></i>
                        </button>
                        <button class="toggle-bookmark w-10 h-10 ${isCollected ? 'bg-yellow-100 text-yellow-500' : 'bg-gray-100 hover:bg-yellow-100 text-gray-400 hover:text-yellow-500'} rounded-xl flex items-center justify-center btn-effect shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300" data-para="${paragraphId}">
                            <i class="fa fa-${isCollected ? 'bookmark' : 'bookmark-o'} text-lg"></i>
                        </button>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                                <i class="fa fa-language text-white text-xs"></i>
                            </div>
                            <span class="font-semibold text-purple-700">含义</span>
                        </div>
                        <div class="pl-8">
                            <div class="flex items-baseline gap-2 mb-1">
                                <span class="text-sm font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">${vocab.partOfSpeech || 'n.'}</span>
                                <p class="text-gray-700">${vocab.meaning}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-blue-50 rounded-xl p-4 backdrop-blur-sm">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                                <i class="fa fa-quote-left text-white text-xs"></i>
                            </div>
                            <span class="font-semibold text-blue-700">例句</span>
                        </div>
                        <p class="text-gray-700 pl-8 mb-2">${vocab.example.english}</p>
                        <p class="text-gray-500 pl-8 text-sm">（${vocab.example.chinese}）</p>
                    </div>

                    ${this.createDerivationsSection(vocab)}
                </div>
            </div>
        `;
    }

    createDerivationsSection(vocab) {
        if (!vocab.derivations || vocab.derivations.length === 0) {
            // 兼容旧数据格式
            if (vocab.derivation) {
                return `
                    <div class="bg-green-50 rounded-xl p-4 backdrop-blur-sm">
                        <div class="flex items-center gap-2 mb-2">
                            <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                <i class="fa fa-random text-white text-xs"></i>
                            </div>
                            <span class="font-semibold text-green-700">变形</span>
                        </div>
                        <p class="text-gray-700 pl-8">${vocab.derivation}</p>
                    </div>
                `;
            }
            return '';
        }

        const uniqueId = `derivations-${vocab.word.replace(/[^a-zA-Z0-9]/g, '-')}`;
        const isExpanded = this.getDerivationExpansionState(uniqueId);

        return `
            <div class="bg-green-50 rounded-xl p-4 backdrop-blur-sm">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <div class="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                            <i class="fa fa-random text-white text-xs"></i>
                        </div>
                        <span class="font-semibold text-green-700">词汇拓展</span>
                        <span class="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">${vocab.derivations.length} 个衍生词</span>
                    </div>
                    <button class="toggle-derivations w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center btn-effect transition-all duration-300 transform hover:scale-110"
                            data-derivations-id="${uniqueId}"
                            title="${isExpanded ? '隐藏衍生词' : '显示衍生词'}">
                        <i class="fa fa-chevron-${isExpanded ? 'up' : 'down'} text-xs"></i>
                    </button>
                </div>
                <div class="derivations-content ${isExpanded ? '' : 'hidden'}" id="${uniqueId}">
                    <div class="space-y-3 pl-8">
                        ${vocab.derivations.map(derivation => this.createDerivationItem(derivation)).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createDerivationItem(derivation) {
        return `
            <div class="bg-white/70 rounded-lg p-3 border border-green-200 hover:border-green-300 transition-colors">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-green-800">${derivation.word}</span>
                        <span class="text-sm text-green-600">${derivation.phonetic}</span>
                        <span class="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">${derivation.partOfSpeech}</span>
                    </div>
                    <button class="play-derivation-audio w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center btn-effect transition-all duration-300" data-word="${derivation.word}" title="播放发音">
                        <i class="fa fa-volume-up text-xs"></i>
                    </button>
                </div>
                <p class="text-gray-700 text-sm mb-1">${derivation.meaning}</p>
                ${derivation.note ? `<p class="text-gray-500 text-xs italic">${derivation.note}</p>` : ''}
            </div>
        `;
    }

    updatePagination() {
        const currentPageElement = document.getElementById('current-page');
        const totalPagesElement = document.getElementById('total-pages');
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');

        if (currentPageElement) currentPageElement.textContent = this.currentPage;
        if (totalPagesElement) totalPagesElement.textContent = this.totalPages;
        if (prevPageBtn) prevPageBtn.disabled = this.currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = this.currentPage === this.totalPages;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderCurrentPage();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderCurrentPage();
        }
    }

    previousParagraph(currentId) {
        if (currentId > 1) {
            const targetParaId = currentId - 1;
            const prevPara = document.getElementById(`para-${targetParaId}`);

            if (prevPara) {
                // 段落在当前页面，直接滚动
                prevPara.scrollIntoView({ behavior: 'smooth' });
            } else {
                // 段落不在当前页面，需要切换页面
                this.navigateToParagraph(targetParaId);
            }
        }
    }

    nextParagraph(currentId) {
        if (currentId < this.lessonData.paragraphs.length) {
            const targetParaId = currentId + 1;
            const nextPara = document.getElementById(`para-${targetParaId}`);

            if (nextPara) {
                // 段落在当前页面，直接滚动
                nextPara.scrollIntoView({ behavior: 'smooth' });
            } else {
                // 段落不在当前页面，需要切换页面
                this.navigateToParagraph(targetParaId);
            }
        }
    }

    /**
     * 导航到指定段落（跨页面）
     * @param {number} paragraphId - 目标段落ID
     */
    navigateToParagraph(paragraphId) {
        const itemsPerPage = this.pageConfig.itemsPerPage || 7;
        const targetPage = Math.ceil(paragraphId / itemsPerPage);

        if (targetPage !== this.currentPage && targetPage >= 1 && targetPage <= this.totalPages) {
            // 切换到目标页面
            this.currentPage = targetPage;
            this.renderCurrentPage();

            // 等待页面渲染完成后滚动到目标段落
            setTimeout(() => {
                const targetElement = document.getElementById(`para-${paragraphId}`);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // 高亮显示目标段落
                    this.highlightParagraph(targetElement);
                }
            }, 300);
        }
    }

    /**
     * 高亮显示段落
     * @param {HTMLElement} paragraphElement - 段落元素
     */
    highlightParagraph(paragraphElement) {
        // 添加高亮效果
        paragraphElement.classList.add('ring-2', 'ring-purple-500', 'ring-opacity-50');

        // 3秒后移除高亮
        setTimeout(() => {
            paragraphElement.classList.remove('ring-2', 'ring-purple-500', 'ring-opacity-50');
        }, 3000);
    }

    readParagraph(paragraphId) {
        const paragraph = this.lessonData.paragraphs.find(p => p.id === paragraphId);
        if (!paragraph) return;

        // 检查是否正在朗读，如果是则暂停/继续
        if (this.isPlaying && this.currentParagraphId === paragraphId) {
            this.togglePauseResume();
            return;
        }

        // 停止当前朗读
        this.stopReading();

        // 开始新的朗读
        this.currentParagraphId = paragraphId;
        this.isPlaying = true;
        this.isPaused = false;

        if (this.ttsController) {
            // 使用高级TTS控制器
            this.ttsController.speak(paragraph.englishText)
                .then(() => {
                    this.onReadingComplete();
                })
                .catch((error) => {
                    console.error('TTS朗读错误:', error);
                    this.fallbackToBasicTTS(paragraph.englishText);
                });
        } else {
            // 使用基础TTS
            this.fallbackToBasicTTS(paragraph.englishText);
        }

        this.updateReadingButton();
    }

  togglePauseResume() {
        if (!this.isPlaying) return;

        if (this.isPaused) {
            // 继续朗读
            if (this.ttsController && this.ttsController.resume) {
                this.ttsController.resume();
            } else {
                speechSynthesis.resume();
            }
            this.isPaused = false;
        } else {
            // 暂停朗读
            if (this.ttsController && this.ttsController.pause) {
                this.ttsController.pause();
            } else {
                speechSynthesis.pause();
            }
            this.isPaused = true;
        }

        this.updateReadingButton();
    }

  stopReading() {
        if (this.ttsController && this.ttsController.stop) {
            this.ttsController.stop();
        } else {
            speechSynthesis.cancel();
        }
        this.isPlaying = false;
        this.isPaused = false;
        this.currentParagraphId = null;
        this.updateReadingButton();
    }

  fallbackToBasicTTS(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
            this.onReadingComplete();
        };

        utterance.onerror = (error) => {
            console.error('基础TTS错误:', error);
            this.onReadingComplete();
        };

        speechSynthesis.speak(utterance);
    }

  onReadingComplete() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentParagraphId = null;
        this.updateReadingButton();
    }

  updateReadingButton() {
        const button = document.querySelector(`[data-para="${this.currentParagraphId}"] .read-paragraph`);
        if (!button) return;

        const icon = button.querySelector('i');
        const text = button.querySelector('span') || button;

        if (this.isPaused) {
            icon.className = 'fa fa-play mr-3 text-lg';
            text.textContent = '继续朗读';
            button.classList.remove('bg-red-500', 'hover:bg-red-600');
            button.classList.add('bg-green-500', 'hover:bg-green-600');
        } else if (this.isPlaying) {
            icon.className = 'fa fa-pause mr-3 text-lg';
            text.textContent = '暂停朗读';
            button.classList.remove('bg-green-500', 'hover:bg-green-600');
            button.classList.add('bg-red-500', 'hover:bg-red-600');
        } else {
            icon.className = 'fa fa-volume-up mr-3 text-lg';
            text.textContent = '朗读本段';
            button.classList.remove('bg-red-500', 'hover:bg-red-600', 'bg-green-500', 'hover:bg-green-600');
            button.classList.add('bg-gradient-to-r', 'from-accent', 'to-green-500');
        }
    }

    playWordAudio(word) {
        console.log('playWordAudio 被调用，单词:', word);

        // 检查浏览器是否支持语音合成
        if (!('speechSynthesis' in window)) {
            console.error('浏览器不支持语音合成');
            return;
        }

        // 取消任何正在进行的语音合成
        speechSynthesis.cancel();

        // 创建语音合成实例
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // 添加事件监听器用于调试
        utterance.onstart = () => {
            console.log('开始朗读单词:', word);
        };

        utterance.onend = () => {
            console.log('单词朗读完成:', word);
        };

        utterance.onerror = (error) => {
            console.error('单词朗读错误:', error, '单词:', word);
        };

        // 开始朗读
        try {
            speechSynthesis.speak(utterance);
            console.log('语音合成请求已发送');
        } catch (error) {
            console.error('语音合成失败:', error);
        }
    }

    toggleBookmark(button, paragraphId) {
        const vocabItem = button.closest('.vocab-item');
        const word = vocabItem.dataset.word;
        const paragraph = this.lessonData.paragraphs.find(p => p.id === paragraphId);
        const vocab = paragraph.vocabulary.find(v => v.word === word);

        if (!vocab) return;

        const existingIndex = this.collectedWords.findIndex(w => w.word === word);

        if (existingIndex > -1) {
            // 取消收藏
            this.collectedWords.splice(existingIndex, 1);
            button.className = 'toggle-bookmark w-10 h-10 bg-gray-100 hover:bg-yellow-100 text-gray-400 hover:text-yellow-500 rounded-xl flex items-center justify-center btn-effect shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300';
            button.innerHTML = '<i class="fa fa-bookmark-o text-lg"></i>';
        } else {
            // 添加收藏
            this.collectedWords.push({
                ...vocab,
                paragraphId: paragraphId,
                collectedAt: new Date().toISOString()
            });
            button.className = 'toggle-bookmark w-10 h-10 bg-yellow-100 text-yellow-500 rounded-xl flex items-center justify-center btn-effect shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300';
            button.innerHTML = '<i class="fa fa-bookmark text-lg"></i>';
        }

        localStorage.setItem('collectedWords', JSON.stringify(this.collectedWords));
        this.updateCollectionCount();
    }

    updateCollectionCount() {
        const countElement = document.getElementById('collection-count');
        const badgeElement = document.getElementById('collection-badge');
        const modalCountElement = document.getElementById('modal-collection-count');

        if (countElement) {
            countElement.textContent = this.collectedWords.length;
        }

        if (badgeElement) {
            badgeElement.textContent = this.collectedWords.length;
            // 如果收藏数为0，隐藏徽章
            if (this.collectedWords.length === 0) {
                badgeElement.style.display = 'none';
            } else {
                badgeElement.style.display = 'flex';
            }
        }

        if (modalCountElement) {
            modalCountElement.textContent = this.collectedWords.length;
        }

        console.log('收藏计数已更新:', this.collectedWords.length);
    }

    showCollectionModal() {
        const modal = document.getElementById('collection-modal');
        const emptyState = document.getElementById('empty-collection');
        const collectionList = document.getElementById('collection-list');

        if (!modal) return;

        if (this.collectedWords.length === 0) {
            emptyState.classList.remove('hidden');
            collectionList.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            collectionList.classList.remove('hidden');
            this.renderCollectionList();
        }

        modal.classList.remove('hidden');
    }

    renderCollectionList() {
        const collectionList = document.getElementById('collection-list');
        if (!collectionList) return;

        collectionList.innerHTML = this.collectedWords.map(word => `
            <div class="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-2xl p-6 vocab-item-hover vocab-card border border-purple-100 shadow-lg">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="vocab-word text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${word.word}</span>
                            <span class="vocab-phonetic text-purple-500 font-medium">${word.phonetic}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium">
                                ${word.level}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="bg-white/60 rounded-xl p-4 backdrop-blur-sm">
                        <p class="text-gray-700">${word.meaning}</p>
                    </div>
                    <div class="bg-blue-50 rounded-xl p-4 backdrop-blur-sm">
                        <p class="text-gray-700 mb-2">${word.example.english}</p>
                        <p class="text-gray-500 text-sm">（${word.example.chinese}）</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    hideCollectionModal() {
        const modal = document.getElementById('collection-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    exportToExcel() {
        // 检查是否有收藏词汇
        if (this.collectedWords.length === 0) {
            alert('没有可导出的收藏词汇');
            return;
        }

        // 检查XLSX库是否已加载
        if (typeof XLSX === 'undefined') {
            console.error('XLSX库未加载');
            alert('Excel导出功能暂时不可用，请稍后再试');
            return;
        }

        try {
            console.log('开始导出Excel文件，词汇数量:', this.collectedWords.length);

            // 准备数据
            const ws_data = [
                ['单词', '音标', '级别', '含义', '例句', '翻译', '词形变化', '收藏时间']
            ];

            this.collectedWords.forEach(word => {
                ws_data.push([
                    word.word || '',
                    word.phonetic || '',
                    word.level || '',
                    word.meaning || '',
                    word.example?.english || '',
                    word.example?.chinese || '',
                    word.derivation || '',
                    word.collectedAt ? new Date(word.collectedAt).toLocaleString('zh-CN') : ''
                ]);
            });

            // 创建工作簿
            const ws = XLSX.utils.aoa_to_sheet(ws_data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "收藏词汇");

            // 生成文件名
            const fileName = `英语词汇收藏_${new Date().toISOString().split('T')[0]}.xlsx`;

            // 导出文件
            XLSX.writeFile(wb, fileName);

            console.log('Excel文件导出成功:', fileName);

            // 可选：显示成功消息
            setTimeout(() => {
                alert(`词汇导出成功！\n共导出 ${this.collectedWords.length} 个词汇\n文件名：${fileName}`);
            }, 500);

        } catch (error) {
            console.error('Excel导出失败:', error);
            alert('词汇导出失败，请稍后再试或联系管理员');
        }
    }

    clearCollection() {
        if (confirm('确定要清空所有收藏的词汇吗？此操作不可恢复。')) {
            this.collectedWords = [];
            localStorage.setItem('collectedWords', JSON.stringify(this.collectedWords));
            this.updateCollectionCount();
            this.hideCollectionModal();

            // 更新页面上的收藏按钮状态
            document.querySelectorAll('.toggle-bookmark').forEach(button => {
                button.className = 'toggle-bookmark w-10 h-10 bg-gray-100 hover:bg-yellow-100 text-gray-400 hover:text-yellow-500 rounded-xl flex items-center justify-center btn-effect shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300';
                button.innerHTML = '<i class="fa fa-bookmark-o text-lg"></i>';
            });
        }
    }

    // 衍生词显示/隐藏管理
    getDerivationExpansionState(derivationsId) {
        const expandedStates = JSON.parse(localStorage.getItem('derivationsExpandedStates') || '{}');
        // 默认为展开状态
        return expandedStates[derivationsId] !== false;
    }

    setDerivationExpansionState(derivationsId, isExpanded) {
        const expandedStates = JSON.parse(localStorage.getItem('derivationsExpandedStates') || '{}');
        expandedStates[derivationsId] = isExpanded;
        localStorage.setItem('derivationsExpandedStates', JSON.stringify(expandedStates));
    }

    toggleDerivations(button, derivationsId) {
        const contentDiv = document.getElementById(derivationsId);
        const icon = button.querySelector('i');

        if (contentDiv.classList.contains('hidden')) {
            // 展开衍生词
            contentDiv.classList.remove('hidden');
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
            button.title = '隐藏衍生词';
            this.setDerivationExpansionState(derivationsId, true);

            // 添加展开动画
            contentDiv.style.opacity = '0';
            contentDiv.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                contentDiv.style.transition = 'all 0.3s ease';
                contentDiv.style.opacity = '1';
                contentDiv.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // 折叠衍生词
            contentDiv.style.transition = 'all 0.3s ease';
            contentDiv.style.opacity = '0';
            contentDiv.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                contentDiv.classList.add('hidden');
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
                button.title = '显示衍生词';
                this.setDerivationExpansionState(derivationsId, false);
            }, 300);
        }
    }

    // 批量操作衍生词显示状态
    expandAllDerivations() {
        document.querySelectorAll('.derivations-content').forEach(contentDiv => {
            contentDiv.classList.remove('hidden');
        });
        document.querySelectorAll('.toggle-derivations i').forEach(icon => {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        });
        document.querySelectorAll('.toggle-derivations').forEach(button => {
            button.title = '隐藏衍生词';
        });

        // 更新所有状态为展开
        const expandedStates = JSON.parse(localStorage.getItem('derivationsExpandedStates') || '{}');
        document.querySelectorAll('.toggle-derivations').forEach(button => {
            const derivationsId = button.dataset.derivationsId;
            expandedStates[derivationsId] = true;
        });
        localStorage.setItem('derivationsExpandedStates', JSON.stringify(expandedStates));
    }

    collapseAllDerivations() {
        document.querySelectorAll('.derivations-content').forEach(contentDiv => {
            contentDiv.classList.add('hidden');
        });
        document.querySelectorAll('.toggle-derivations i').forEach(icon => {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        });
        document.querySelectorAll('.toggle-derivations').forEach(button => {
            button.title = '显示衍生词';
        });

        // 更新所有状态为折叠
        const expandedStates = JSON.parse(localStorage.getItem('derivationsExpandedStates') || '{}');
        document.querySelectorAll('.toggle-derivations').forEach(button => {
            const derivationsId = button.dataset.derivationsId;
            expandedStates[derivationsId] = false;
        });
        localStorage.setItem('derivationsExpandedStates', JSON.stringify(expandedStates));
    }

    // 切换中文翻译显示
    toggleTranslation(button, paraId) {
        const translationDiv = document.getElementById(`translation-${paraId}`);
        const icon = button.querySelector('i');

        if (translationDiv.classList.contains('hidden')) {
            translationDiv.classList.remove('hidden');
            icon.className = 'fa fa-eye-slash mr-2';
            button.innerHTML = '<i class="fa fa-eye-slash mr-2"></i> 隐藏中文翻译';
        } else {
            translationDiv.classList.add('hidden');
            icon.className = 'fa fa-eye mr-2';
            button.innerHTML = '<i class="fa fa-eye mr-2"></i> 显示中文翻译';
        }
    }

    // 切换语法分析显示
    toggleGrammar(button, paraId) {
        const grammarDiv = document.getElementById(`grammar-${paraId}`);
        const icon = button.querySelector('i');

        if (grammarDiv.classList.contains('hidden')) {
            grammarDiv.classList.remove('hidden');
            icon.className = 'fa fa-code-fork mr-2';
            button.innerHTML = '<i class="fa fa-code-fork mr-2"></i> 隐藏语法分析';
        } else {
            grammarDiv.classList.add('hidden');
            icon.className = 'fa fa-code mr-2';
            button.innerHTML = '<i class="fa fa-code mr-2"></i> 显示语法分析';
        }
    }

    // 切换词汇知识显示
    toggleVocabulary(button, paraId) {
        const vocabContent = document.getElementById(`vocab-content-${paraId}`);
        const icon = button.querySelector('i');

        if (vocabContent.classList.contains('hidden')) {
            // 展开词汇知识
            vocabContent.classList.remove('hidden');
            icon.className = 'fa fa-chevron-up text-xs';
            button.title = '隐藏词汇知识';

            // 添加展开动画
            vocabContent.style.opacity = '0';
            vocabContent.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                vocabContent.style.transition = 'all 0.3s ease';
                vocabContent.style.opacity = '1';
                vocabContent.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // 折叠词汇知识
            vocabContent.style.transition = 'all 0.3s ease';
            vocabContent.style.opacity = '0';
            vocabContent.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                vocabContent.classList.add('hidden');
                icon.className = 'fa fa-chevron-down text-xs';
                button.title = '显示词汇知识';
            }, 300);
        }

        // 保存状态到 localStorage
        this.setVocabExpansionState(paraId, !vocabContent.classList.contains('hidden'));
    }

    // 获取词汇知识展开状态
    getVocabExpansionState(paraId) {
        const expandedStates = JSON.parse(localStorage.getItem('vocabExpandedStates') || '{}');
        // 默认为展开状态
        return expandedStates[paraId] !== false;
    }

    // 设置词汇知识展开状态
    setVocabExpansionState(paraId, isExpanded) {
        const expandedStates = JSON.parse(localStorage.getItem('vocabExpandedStates') || '{}');
        expandedStates[paraId] = isExpanded;
        localStorage.setItem('vocabExpandedStates', JSON.stringify(expandedStates));
    }

    // 恢复词汇知识展开状态
    restoreVocabExpansionStates() {
        this.currentParagraphs.forEach(paragraph => {
            const vocabContent = document.getElementById(`vocab-content-${paragraph.id}`);
            const toggleButton = document.querySelector(`[data-para="${paragraph.id}"].toggle-vocab`);

            if (vocabContent && toggleButton) {
                const isExpanded = this.getVocabExpansionState(paragraph.id);
                const icon = toggleButton.querySelector('i');

                if (!isExpanded) {
                    vocabContent.classList.add('hidden');
                    icon.className = 'fa fa-chevron-down text-xs';
                    toggleButton.title = '显示词汇知识';
                } else {
                    vocabContent.classList.remove('hidden');
                    icon.className = 'fa fa-chevron-up text-xs';
                    toggleButton.title = '隐藏词汇知识';
                }
            }
        });
    }

    // 从课程数据中提取词汇高亮数据
    extractVocabData() {
        const vocabData = {};

        if (!this.lessonData || !this.lessonData.paragraphs) {
            console.warn('课程数据未加载，无法提取词汇数据');
            return vocabData;
        }

        // 遍历所有段落的词汇数据
        this.lessonData.paragraphs.forEach(paragraph => {
            if (paragraph.vocabulary && Array.isArray(paragraph.vocabulary)) {
                paragraph.vocabulary.forEach(vocab => {
                    if (vocab.word && vocab.meaning) {
                        // 确定词汇类型
                        let type = 'common';
                        if (vocab.level) {
                            if (vocab.level.includes('高级') || vocab.level.includes('雅思')) {
                                type = 'advanced';
                            } else if (vocab.level.includes('核心') || vocab.level.includes('四六级')) {
                                type = 'core';
                            } else if (vocab.level.includes('商务') || vocab.level.includes('TOEIC')) {
                                type = 'business';
                            }
                        }

                        // 添加到词汇数据映射
                        vocabData[vocab.word.toLowerCase()] = {
                            type: type,
                            meaning: vocab.meaning,
                            pos: vocab.partOfSpeech || 'n.',
                            phonetic: vocab.phonetic || ''
                        };
                    }
                });
            }
        });

        console.log(`从课程数据中提取了 ${Object.keys(vocabData).length} 个词汇用于高亮`);
        return vocabData;
    }

    // 应用词汇高亮功能
    applyVocabHighlighting() {
        // 从课程数据中提取词汇数据
        const vocabData = this.extractVocabData();

        // 如果没有词汇数据，直接返回
        if (Object.keys(vocabData).length === 0) {
            console.log('没有找到词汇数据，跳过高亮处理');
            return;
        }

        // 获取所有段落内容
        const paragraphContents = document.querySelectorAll('.paragraph-content');

        paragraphContents.forEach(contentElement => {
            let html = contentElement.innerHTML;

            // 为每个词汇创建高亮标记
            Object.entries(vocabData).forEach(([word, data]) => {
                // 创建正则表达式，匹配整个单词（不区分大小写）
                const regex = new RegExp(`\\b${word}\\b`, 'gi');

                // 替换匹配的单词为高亮版本
                html = html.replace(regex, (match) => {
                    return `<span class="vocab-highlight vocab-type-${data.type}" data-word="${word}">
                        ${match}
                        <span class="vocab-tooltip">
                            <div class="vocab-tooltip-content">
                                ${data.phonetic ? `<span class="vocab-phonetic">${data.phonetic}</span>` : ''}
                                <span class="vocab-pos">${data.pos}</span>
                                <span class="vocab-meaning">${data.meaning}</span>
                            </div>
                        </span>
                    </span>`;
                });
            });

            // 更新段落HTML
            contentElement.innerHTML = html;
        });

        // 注意：词汇高亮的点击事件已在 setupEventListeners 中统一处理，避免重复绑定

        console.log('词汇高亮功能应用完成');
    }
}

// 初始化渲染器
document.addEventListener('DOMContentLoaded', () => {
    window.contentRenderer = new ContentRenderer();
});