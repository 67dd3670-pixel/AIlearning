/**
 * 特殊字符处理器
 * 用于处理数字、日期、缩写、符号等特殊字符的语音合成
 */
class SpecialCharsProcessor {
    constructor() {
        // 数字转换规则
        this.numberRules = {
            // 基本数字
            units: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
            teens: ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
            tens: ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
            scales: ['', 'thousand', 'million', 'billion', 'trillion']
        };

        // 月份名称
        this.monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        // 日期格式
        this.dateFormats = {
            american: /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/, // MM/DD/YYYY
            european: /^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/, // DD.MM.YYYY
            iso: /^(\d{4})-(\d{1,2})-(\d{1,2})$/ // YYYY-MM-DD
        };

        // 时间格式
        this.timeFormats = {
            twelveHour: /^(\d{1,2}):(\d{2})\s*(am|pm)?$/i,
            twentyFourHour: /^(\d{1,2}):(\d{2}):(\d{2})$/
        };

        // 货币符号
        this.currencySymbols = {
            '$': 'dollar',
            '€': 'euro',
            '£': 'pound',
            '¥': 'yen',
            '₹': 'rupee',
            '₩': 'won'
        };

        // 常见缩写
        this.abbreviations = {
            // 称谓
            'Mr.': 'Mister',
            'Mrs.': 'Misses',
            'Ms.': 'Miss',
            'Dr.': 'Doctor',
            'Prof.': 'Professor',
            'Sr.': 'Senior',
            'Jr.': 'Junior',
            'St.': 'Saint',

            // 学术头衔
            'Ph.D.': 'Doctor of Philosophy',
            'M.A.': 'Master of Arts',
            'B.A.': 'Bachelor of Arts',
            'B.S.': 'Bachelor of Science',
            'M.S.': 'Master of Science',

            // 地理
            'Ave.': 'Avenue',
            'Blvd.': 'Boulevard',
            'St.': 'Street',
            'Rd.': 'Road',
            'Ct.': 'Court',
            'Ln.': 'Lane',
            'Pl.': 'Place',

            // 时间
            'a.m.': 'a m',
            'p.m.': 'p m',
            'AM': 'a m',
            'PM': 'p m',

            // 拉丁语缩写
            'e.g.': 'for example',
            'i.e.': 'that is',
            'etc.': 'et cetera',
            'vs.': 'versus',
            'et al.': 'and others'
        };

        // 符号发音
        this.symbols = {
            '@': 'at',
            '#': 'hashtag',
            '&': 'and',
            '%': 'percent',
            '+': 'plus',
            '-': 'minus',
            '=': 'equals',
            '×': 'times',
            '÷': 'divided by',
            '<': 'less than',
            '>': 'greater than',
            '≤': 'less than or equal to',
            '≥': 'greater than or equal to',
            '≠': 'not equal to',
            '±': 'plus or minus',
            '∞': 'infinity',
            '°': 'degrees',
            '′': 'minutes',
            '″': 'seconds'
        };

        // 单位符号
        this.units = {
            // 长度
            'mm': 'millimeters',
            'cm': 'centimeters',
            'm': 'meters',
            'km': 'kilometers',
            'in': 'inches',
            'ft': 'feet',
            'yd': 'yards',
            'mi': 'miles',

            // 重量
            'g': 'grams',
            'kg': 'kilograms',
            'mg': 'milligrams',
            'lb': 'pounds',
            'oz': 'ounces',

            // 温度
            '°C': 'degrees celsius',
            '°F': 'degrees fahrenheit',
            'K': 'kelvin',

            // 数据
            'KB': 'kilobytes',
            'MB': 'megabytes',
            'GB': 'gigabytes',
            'TB': 'terabytes'
        };
    }

    /**
     * 处理文本中的特殊字符
     * @param {string} text - 原始文本
     * @returns {string} - 处理后的文本
     */
    processText(text) {
        let processed = text;

        // 处理数字
        processed = this.processNumbers(processed);

        // 处理日期
        processed = this.processDates(processed);

        // 处理时间
        processed = this.processTime(processed);

        // 处理货币
        processed = this.processCurrency(processed);

        // 处理缩写
        processed = this.processAbbreviations(processed);

        // 处理符号
        processed = this.processSymbols(processed);

        // 处理单位
        processed = this.processUnits(processed);

        // 处理URL和邮箱
        processed = this.processURLs(processed);

        return processed;
    }

    /**
     * 处理数字转换
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processNumbers(text) {
        return text.replace(/\b\d+(\.\d+)?\b/g, (match) => {
            if (match.includes('.')) {
                return this.numberToWords(parseFloat(match));
            } else {
                return this.numberToWords(parseInt(match));
            }
        });
    }

    /**
     * 将数字转换为英文单词
     * @param {number} number - 数字
     * @returns {string} - 英文单词
     */
    numberToWords(number) {
        if (number === 0) return 'zero';

        let words = '';
        let remainingNumber = Math.abs(number);

        // 处理负数
        if (number < 0) {
            words = 'negative ';
        }

        // 处理小数部分
        if (number % 1 !== 0) {
            const integerPart = Math.floor(number);
            const decimalPart = Math.round((number - integerPart) * 100);
            words += this.numberToWords(integerPart) + ' point ' + this.numberToWords(decimalPart);
            return words;
        }

        // 处理整数部分
        for (let i = 0; i < this.numberRules.scales.length; i++) {
            const scale = Math.pow(1000, i);
            const scaleValue = Math.floor(remainingNumber / scale);

            if (scaleValue > 0) {
                if (i > 0) {
                    words += this.convertUnderThousand(scaleValue) + ' ' + this.numberRules.scales[i] + ' ';
                } else {
                    words += this.convertUnderThousand(scaleValue) + ' ';
                }
                remainingNumber %= scale;
            }
        }

        return words.trim();
    }

    /**
     * 转换小于1000的数字
     * @param {number} number - 数字
     * @returns {string} - 英文单词
     */
    convertUnderThousand(number) {
        if (number === 0) return '';

        let words = '';

        // 处理百位
        const hundreds = Math.floor(number / 100);
        if (hundreds > 0) {
            words += this.numberRules.units[hundreds] + ' hundred ';
            number %= 100;
        }

        // 处理十位和个位
        if (number > 0) {
            if (number < 20) {
                words += this.numberRules.units[number] || this.numberRules.teens[number - 10];
            } else {
                const tens = Math.floor(number / 10);
                const units = number % 10;
                words += this.numberRules.tens[tens];
                if (units > 0) {
                    words += '-' + this.numberRules.units[units];
                }
            }
        }

        return words.trim();
    }

    /**
     * 处理日期
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processDates(text) {
        // 处理美国格式日期 MM/DD/YYYY
        text = text.replace(this.dateFormats.american, (match, month, day, year) => {
            const monthName = this.monthNames[parseInt(month) - 1];
            const dayNum = this.numberToWords(parseInt(day));
            const yearNum = this.numberToWords(parseInt(year));
            return `${monthName} ${dayNum}, ${yearNum}`;
        });

        // 处理欧洲格式日期 DD.MM.YYYY
        text = text.replace(this.dateFormats.european, (match, day, month, year) => {
            const monthName = this.monthNames[parseInt(month) - 1];
            const dayNum = this.numberToWords(parseInt(day));
            const yearNum = this.numberToWords(parseInt(year));
            return `${dayNum} of ${monthName} ${yearNum}`;
        });

        // 处理ISO格式日期 YYYY-MM-DD
        text = text.replace(this.dateFormats.iso, (match, year, month, day) => {
            const monthName = this.monthNames[parseInt(month) - 1];
            const dayNum = this.numberToWords(parseInt(day));
            const yearNum = this.numberToWords(parseInt(year));
            return `${monthName} ${dayNum}, ${yearNum}`;
        });

        return text;
    }

    /**
     * 处理时间
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processTime(text) {
        // 处理12小时制时间
        text = text.replace(this.timeFormats.twelveHour, (match, hours, minutes, period) => {
            const hourNum = parseInt(hours);
            const minuteNum = parseInt(minutes);
            let timeWords = '';

            // 转换小时
            if (hourNum === 0) {
                timeWords = 'twelve';
            } else if (hourNum <= 12) {
                timeWords = this.numberToWords(hourNum);
            } else {
                timeWords = this.numberToWords(hourNum - 12);
            }

            // 转换分钟
            if (minuteNum > 0) {
                timeWords += ' ' + this.numberToWords(minuteNum);
            }

            // 添加时期
            if (period) {
                timeWords += ' ' + period.toLowerCase();
            }

            return timeWords;
        });

        // 处理24小时制时间
        text = text.replace(this.timeFormats.twentyFourHour, (match, hours, minutes, seconds) => {
            const hourNum = parseInt(hours);
            const minuteNum = parseInt(minutes);
            const secondNum = parseInt(seconds);
            let timeWords = this.numberToWords(hourNum) + ' ' + this.numberToWords(minuteNum);

            if (secondNum > 0) {
                timeWords += ' ' + this.numberToWords(secondNum);
            }

            return timeWords;
        });

        return text;
    }

    /**
     * 处理货币
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processCurrency(text) {
        // 处理美元格式
        text = text.replace(/\$(\d+(\.\d{2})?)/g, (match, amount) => {
            const numAmount = parseFloat(amount);
            const words = this.numberToWords(numAmount);
            return `${words} ${numAmount === 1 ? 'dollar' : 'dollars'}`;
        });

        // 处理其他货币
        for (const [symbol, name] of Object.entries(this.currencySymbols)) {
            if (symbol !== '$') {
                const regex = new RegExp(`\\${symbol}(\\d+(\\.\\d{2})?)`, 'g');
                text = text.replace(regex, (match, amount) => {
                    const numAmount = parseFloat(amount);
                    const words = this.numberToWords(numAmount);
                    return `${words} ${name}${numAmount === 1 ? '' : 's'}`;
                });
            }
        }

        // 处理百分比
        text = text.replace(/(\d+(\.\d+)?)%/g, (match, amount) => {
            const words = this.numberToWords(parseFloat(amount));
            return `${words} percent`;
        });

        return text;
    }

    /**
     * 处理缩写
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processAbbreviations(text) {
        for (const [abbreviation, expansion] of Object.entries(this.abbreviations)) {
            const regex = new RegExp(`\\b${abbreviation.replace('.', '\\.')}\\b`, 'gi');
            text = text.replace(regex, expansion);
        }

        return text;
    }

    /**
     * 处理符号
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processSymbols(text) {
        for (const [symbol, pronunciation] of Object.entries(this.symbols)) {
            const regex = new RegExp(`\\${symbol}`, 'g');
            text = text.replace(regex, ` ${pronunciation} `);
        }

        return text;
    }

    /**
     * 处理单位
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processUnits(text) {
        // 处理数字+单位的组合
        for (const [unit, name] of Object.entries(this.units)) {
            const regex = new RegExp(`(\\d+(\\.\\d+)?)\\s*${unit}`, 'gi');
            text = text.replace(regex, (match, number) => {
                const numValue = parseFloat(number);
                const words = this.numberToWords(numValue);
                return `${words} ${name}`;
            });
        }

        return text;
    }

    /**
     * 处理URL和邮箱
     * @param {string} text - 文本内容
     * @returns {string} - 处理后的文本
     */
    processURLs(text) {
        // 处理URL
        text = text.replace(/https?:\/\/([^\s]+)/g, (match, domain) => {
            return `website ${domain.replace(/\//g, ' slash ')}`;
        });

        // 处理邮箱
        text = text.replace(/([^\s]+)@([^\s]+)/g, (match, username, domain) => {
            return `${username.replace(/[\._-]/g, ' ')} at ${domain.replace(/\./g, ' dot ')}`;
        });

        return text;
    }

    /**
     * 智能处理特殊字符
     * @param {string} text - 文本内容
     * @returns {Object} - 处理结果
     */
    processSmart(text) {
        const original = text;
        const processed = this.processText(text);

        return {
            original: original,
            processed: processed,
            changes: this.identifyChanges(original, processed),
            confidence: this.calculateConfidence(text)
        };
    }

    /**
     * 识别文本变化
     * @param {string} original - 原始文本
     * @param {string} processed - 处理后文本
     * @returns {Array} - 变化数组
     */
    identifyChanges(original, processed) {
        const changes = [];
        const originalWords = original.split(/\s+/);
        const processedWords = processed.split(/\s+/);

        // 简单的变化检测
        for (let i = 0; i < Math.max(originalWords.length, processedWords.length); i++) {
            if (originalWords[i] !== processedWords[i]) {
                changes.push({
                    position: i,
                    original: originalWords[i],
                    processed: processedWords[i] || '',
                    type: this.detectChangeType(originalWords[i], processedWords[i])
                });
            }
        }

        return changes;
    }

    /**
     * 检测变化类型
     * @param {string} original - 原始文本
     * @param {string} processed - 处理后文本
     * @returns {string} - 变化类型
     */
    detectChangeType(original, processed) {
        if (/\d/.test(original)) {
            return 'number_conversion';
        } else if (/[^\w\s]/.test(original)) {
            return 'symbol_processing';
        } else if (/\./.test(original)) {
            return 'abbreviation_expansion';
        } else {
            return 'other';
        }
    }

    /**
     * 计算处理置信度
     * @param {string} text - 文本内容
     * @returns {number} - 置信度 (0-1)
     */
    calculateConfidence(text) {
        let score = 1.0;

        // 检查复杂程度
        const specialChars = (text.match(/[^\w\s]/g) || []).length;
        const numbers = (text.match(/\d/g) || []).length;
        const totalChars = text.length;

        // 特殊字符比例
        const specialCharRatio = specialChars / totalChars;
        if (specialCharRatio > 0.3) score -= 0.2;

        // 数字比例
        const numberRatio = numbers / totalChars;
        if (numberRatio > 0.2) score -= 0.1;

        return Math.max(0.1, score);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpecialCharsProcessor;
} else {
    window.SpecialCharsProcessor = SpecialCharsProcessor;
}