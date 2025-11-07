class FloatingWindow {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupFloatingWindow();
        });
    }

    setupFloatingWindow() {
        const floatingWindowHTML = `
            <div id="floating-window" class="fixed bottom-24 right-6 z-50 w-80 max-w-sm rounded-2xl bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-2xl">
                <div class="p-5">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800">
                            <i class="fa fa-cogs mr-2 text-purple-500"></i>
                            功能设置
                        </h3>
                        <button id="close-floating-window" class="w-8 h-8 bg-gray-200/50 hover:bg-gray-300/70 rounded-full flex items-center justify-center transition-all duration-300 text-gray-600 hover:text-gray-800">
                            <i class="fa fa-times"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
                        <!-- Password Toggle -->
                        <div class="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
                            <label for="password-toggle" class="text-sm font-medium text-gray-700">自动输入密码</label>
                            <input type="checkbox" id="password-toggle" class="toggle-switch">
                        </div>
                        <!-- Dictation Helper -->
                        <div class="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
                            <label for="dictation-helper-toggle" class="text-sm font-medium text-gray-700">单词拼写助手</label>
                            <input type="checkbox" id="dictation-helper-toggle" class="toggle-switch">
                        </div>
                        <!-- Clear Answer Data -->
                        <button id="clear-data-btn" class="w-full text-left p-3 bg-gray-100/50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200/70">
                            清空做题数据
                        </button>
                        <!-- Modify User Info -->
                        <button id="modify-user-info-btn" class="w-full text-left p-3 bg-gray-100/50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200/70">
                            修改个人资料
                        </button>
                        <!-- Live Score -->
                        <div class="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
                            <label for="live-score-toggle" class="text-sm font-medium text-gray-700">实时分数</label>
                            <input type="checkbox" id="live-score-toggle" class="toggle-switch">
                        </div>
                        <!-- Stop Page Shake -->
                        <div class="flex items-center justify-between p-3 bg-gray-100/50 rounded-lg">
                            <label for="stop-shake-toggle" class="text-sm font-medium text-gray-700">停止页面晃动</label>
                            <input type="checkbox" id="stop-shake-toggle" class="toggle-switch">
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', floatingWindowHTML);

        // Add event listeners
        document.getElementById('close-floating-window').addEventListener('click', () => {
            document.getElementById('floating-window').style.display = 'none';
        });

        this.setupPasswordToggle();
        this.setupDictationHelper();
        this.setupClearData();
        this.setupModifyUserInfo();
        this.setupLiveScore();
        this.setupStopShake();
    }

    setupStopShake() {
        const toggle = document.getElementById('stop-shake-toggle');
        const isEnabled = localStorage.getItem('stopShakeToggle') === 'true';
        toggle.checked = isEnabled;

        toggle.addEventListener('change', (e) => {
            localStorage.setItem('stopShakeToggle', e.target.checked);
            this.toggleShake(e.target.checked);
        });

        if (isEnabled) {
            this.toggleShake(true);
        }
    }

    toggleShake(stop) {
        if (stop) {
            const style = document.createElement('style');
            style.id = 'stop-shake-style';
            style.innerHTML = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            const style = document.getElementById('stop-shake-style');
            if (style) {
                style.remove();
            }
        }
    }

    setupLiveScore() {
        const toggle = document.getElementById('live-score-toggle');
        const isEnabled = localStorage.getItem('liveScoreToggle') === 'true';
        toggle.checked = isEnabled;

        toggle.addEventListener('change', (e) => {
            localStorage.setItem('liveScoreToggle', e.target.checked);
            if (e.target.checked) {
                this.showLiveScore();
            } else {
                this.hideLiveScore();
            }
        });

        if (isEnabled) {
            this.showLiveScore();
        }
    }

    showLiveScore() {
        if (document.getElementById('live-score-box')) {
            return;
        }

        const scoreBoxHTML = `
            <div id="live-score-box" class="fixed top-6 right-6 z-50 bg-white/70 backdrop-blur-lg p-4 rounded-2xl shadow-lg w-64">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-gray-700">实时总分</span>
                    <span id="live-score-value" class="text-2xl font-bold text-purple-600">0%</span>
                </div>
                <div id="live-score-details" class="text-xs text-gray-500 mt-1 text-right">
                    答对 0 / 0 题
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', scoreBoxHTML);
        this.updateLiveScore();

        // Refresh score every 2 seconds
        this.liveScoreInterval = setInterval(() => this.updateLiveScore(), 2000);
    }

    hideLiveScore() {
        clearInterval(this.liveScoreInterval);
        const scoreBox = document.getElementById('live-score-box');
        if (scoreBox) {
            scoreBox.remove();
        }
    }

    updateLiveScore() {
        const scoreBox = document.getElementById('live-score-box');
        if (scoreBox && window.exerciseManager) {
            const liveScore = window.exerciseManager.getLiveScore();
            const scoreValueEl = document.getElementById('live-score-value');
            const scoreDetailsEl = document.getElementById('live-score-details');

            if (scoreValueEl) {
                scoreValueEl.textContent = `${liveScore.score}%`;
            }
            if (scoreDetailsEl) {
                scoreDetailsEl.textContent = `答对 ${liveScore.correct} / ${liveScore.total} 题`;
            }
        }
    }

    setupModifyUserInfo() {
        const modifyUserInfoBtn = document.getElementById('modify-user-info-btn');
        modifyUserInfoBtn.addEventListener('click', () => {
            this.showModifyUserInfoModal();
        });
    }

    showModifyUserInfoModal() {
        if (document.getElementById('modify-user-info-modal')) {
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        const modalHTML = `
            <div id="modify-user-info-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl p-6 w-96">
                    <h3 class="font-bold text-lg mb-4">修改个人资料</h3>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">姓名</label>
                            <input type="text" id="new-user-name" class="w-full p-2 border rounded-lg mt-1" value="${userInfo.name || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">班级</label>
                            <input type="text" id="new-user-class" class="w-full p-2 border rounded-lg mt-1" value="${userInfo.class || ''}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">学号</label>
                            <input type="text" id="new-user-id" class="w-full p-2 border rounded-lg mt-1" value="${userInfo.studentId || ''}">
                        </div>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <button id="cancel-modify-user-info" class="px-4 py-2 bg-gray-200 rounded-lg">取消</button>
                        <button id="confirm-modify-user-info" class="px-4 py-2 bg-purple-500 text-white rounded-lg">确认</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('cancel-modify-user-info').addEventListener('click', () => {
            document.getElementById('modify-user-info-modal').remove();
        });

        document.getElementById('confirm-modify-user-info').addEventListener('click', () => {
            const newName = document.getElementById('new-user-name').value;
            const newClass = document.getElementById('new-user-class').value;
            const newId = document.getElementById('new-user-id').value;

            const updatedUserInfo = {
                name: newName,
                class: newClass,
                studentId: newId
            };

            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            document.getElementById('modify-user-info-modal').remove();
        });
    }

    setupClearData() {
        const clearDataBtn = document.getElementById('clear-data-btn');
        clearDataBtn.addEventListener('click', () => {
            this.showClearDataModal();
        });
    }

    showClearDataModal() {
        if (document.getElementById('clear-data-modal')) {
            return;
        }

        const modalHTML = `
            <div id="clear-data-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div class="bg-white rounded-2xl p-6 w-96">
                    <h3 class="font-bold text-lg mb-4">清空做题数据</h3>
                    <div class="space-y-2">
                        <label class="flex items-center"><input type="checkbox" class="mr-2" value="shortAnswer"> 简答题</label>
                        <label class="flex items-center"><input type="checkbox" class="mr-2" value="reading"> 阅读理解</label>
                        <label class="flex items-center"><input type="checkbox" class="mr-2" value="fillBlank"> 填空题</label>
                        <label class="flex items-center"><input type="checkbox" class="mr-2" value="grammar"> 语法题</label>
                    </div>
                    <div class="flex justify-end gap-2 mt-4">
                        <button id="cancel-clear-data" class="px-4 py-2 bg-gray-200 rounded-lg">取消</button>
                        <button id="confirm-clear-data" class="px-4 py-2 bg-red-500 text-white rounded-lg">确认</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        document.getElementById('cancel-clear-data').addEventListener('click', () => {
            document.getElementById('clear-data-modal').remove();
        });

        document.getElementById('confirm-clear-data').addEventListener('click', () => {
            const checkboxes = document.querySelectorAll('#clear-data-modal input[type="checkbox"]:checked');
            const typesToClear = Array.from(checkboxes).map(cb => cb.value);

            if (window.exerciseManager) {
                window.exerciseManager.clearUserAnswers(typesToClear);
            }

            document.getElementById('clear-data-modal').remove();
        });
    }

    setupDictationHelper() {
        const toggle = document.getElementById('dictation-helper-toggle');
        const isEnabled = localStorage.getItem('dictationHelperToggle') === 'true';
        toggle.checked = isEnabled;

        toggle.addEventListener('change', (e) => {
            localStorage.setItem('dictationHelperToggle', e.target.checked);
            if (e.target.checked) {
                this.showDictationHelper();
            } else {
                this.hideDictationHelper();
            }
        });

        if (isEnabled) {
            this.showDictationHelper();
        }
    }

    showDictationHelper() {
        if (document.getElementById('dictation-helper')) {
            return;
        }

        const dictationHelperHTML = `
            <div id="dictation-helper" class="fixed top-20 right-6 z-50 w-64 bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl cursor-move">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-3">
                        <h4 class="font-bold text-gray-800">拼写助手</h4>
                        <button id="close-dictation-helper" class="w-7 h-7 bg-gray-200/50 hover:bg-gray-300/70 rounded-full flex items-center justify-center transition-all duration-300 text-gray-600 hover:text-gray-800">
                            <i class="fa fa-times text-xs"></i>
                        </button>
                    </div>
                    <div class="space-y-2">
                        <button id="end-challenge-btn" class="w-full text-sm text-left p-2 bg-gray-100/50 rounded-lg hover:bg-gray-200/70">结束挑战</button>
                        <button id="switch-question-btn" class="w-full text-sm text-left p-2 bg-gray-100/50 rounded-lg hover:bg-gray-200/70">切换题目</button>
                        <div class="p-2 bg-gray-100/50 rounded-lg">
                            <label for="show-answer-toggle" class="text-sm flex items-center justify-between">
                                <span>显示答案</span>
                                <input type="checkbox" id="show-answer-toggle" class="toggle-switch-sm">
                            </label>
                            <div id="current-answer" class="hidden mt-2 text-sm text-center p-2 bg-gray-200/50 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dictationHelperHTML);

        const helper = document.getElementById('dictation-helper');
        const closeBtn = document.getElementById('close-dictation-helper');
        const showAnswerToggle = document.getElementById('show-answer-toggle');

        closeBtn.addEventListener('click', () => {
            this.hideDictationHelper();
            document.getElementById('dictation-helper-toggle').checked = false;
            localStorage.setItem('dictationHelperToggle', 'false');
        });

        showAnswerToggle.addEventListener('change', (e) => {
            const answerDiv = document.getElementById('current-answer');
            if (e.target.checked) {
                answerDiv.classList.remove('hidden');
                // You'll need a way to get the current answer from the spelling game
                answerDiv.textContent = window.SpellingManager ? window.SpellingManager.currentWord : 'N/A';
            } else {
                answerDiv.classList.add('hidden');
            }
        });

        document.getElementById('end-challenge-btn').addEventListener('click', () => {
            if (window.SpellingManager) {
                window.SpellingManager.completeGame();
            }
        });

        document.getElementById('switch-question-btn').addEventListener('click', () => {
            if (window.SpellingManager) {
                window.SpellingManager.nextWord();
            }
        });

        this.makeDraggable('dictation-helper');
    }

    hideDictationHelper() {
        const helper = document.getElementById('dictation-helper');
        if (helper) {
            helper.remove();
        }
    }

    makeDraggable(elementId) {
        const element = document.getElementById(elementId);
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        element.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            };
        };
    }

    setupPasswordToggle() {
        const toggle = document.getElementById('password-toggle');
        const isEnabled = localStorage.getItem('passwordToggle') === 'true';
        toggle.checked = isEnabled;

        toggle.addEventListener('change', (e) => {
            localStorage.setItem('passwordToggle', e.target.checked);
        });

        // Observe the password modal
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'class') {
                    const passwordModal = document.getElementById('password-modal');
                    if (!passwordModal.classList.contains('hidden')) {
                        this.handlePasswordModal();
                    }
                }
            }
        });

        const passwordModal = document.getElementById('password-modal');
        if (passwordModal) {
            observer.observe(passwordModal, { attributes: true });
        }
    }

    handlePasswordModal() {
        const isEnabled = localStorage.getItem('passwordToggle') === 'true';
        if (isEnabled) {
            const passwordInput = document.getElementById('password-input');
            const passwordForm = document.getElementById('password-form');
            if (passwordInput && passwordForm) {
                passwordInput.value = '1116';
                setTimeout(() => {
                    passwordForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }, 1000);
            }
        }
    }
}

new FloatingWindow();
