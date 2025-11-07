// 英语阅读课程数据文件
// 包含所有用户可替换的学习内容
const lessonData = {
    // 课程基本信息
    courseInfo: {
        title: "交互式英语阅读学习",
        unit: "Unit 4",
        unitTitle: "A Note on the Slowness of the English Character",
        totalParagraphs: 5,
        totalPages: 2,
        description: "英语阅读学习系统 - 第四单元（E. M. Forster关于英国人性格的思考）"
    },
    // 段落数据
    paragraphs: [
        {
            id: 1,
            title: "",
            subtitle: "",
            readingTime: "3分钟",
            englishText: "The Englishman appears to be cold and unemotional because he is really slow. When an event happens, he may understand it quickly enough with his mind, but he takes quite a while to feel it. Once upon a time a coach, containing some Englishmen and some Frenchmen, was driving over the Alps. The horses ran away, and as they were dashing across a bridge the coach caught on the stonework, tottered, and nearly fell into the ravine below. The Frenchmen were frantic with terror: they screamed and gesticulated and flung themselves about, as Frenchmen would. The Englishmen sat quite calm. An hour later, the coach drew up at an inn to change horses, and by that time the situations were exactly reversed. The Frenchmen had forgotten all about the danger, and were chattering gaily; the Englishmen had just begun to feel it, and one had a nervous breakdown and was obliged to go to bed. We have here a clear physical difference between the two races a difference that goes deep into character. The Frenchmen responded at once; the Englishmen responded in time. They were slow and they were also practical. Their instinct forbade them to throw themselves about in the coach, because it was more likely to tip over if they did. They had this extraordinary appreciation of fact that we shall notice again and again. When a disaster comes, the English instinct is to do what can be done first, and to postpone the feeling as long as possible. Hence they are splendid at emergencies. No doubt they are brave—no one will deny that bravery is partly an affair of the nerves, and the English nervous system is well equipped for meeting physical emergency.",
            chineseTranslation: "英国人看起来冷漠且缺乏情感，因为他确实反应慢。当事件发生时，他可能很快就能在理智上理解，但要感受到它却需要相当长的时间。从前，一辆载着一些英国人和法国人的马车正在穿越阿尔卑斯山。马匹受惊，当它们冲过一座桥时，马车撞到了石砌结构，摇晃起来，几乎掉进下面的深谷。法国人惊恐万分：他们尖叫、比划手势，四处乱动，这是法国人的典型反应。英国人则安静地坐着。一小时后，马车在一家客栈停下换马，这时情况完全逆转了。法国人已经完全忘记了危险，正在愉快地聊天；英国人则刚刚开始感受到恐惧，其中一人神经崩溃，不得不卧床休息。我们在这里看到了两个种族之间明显的生理差异——这种差异深入性格。法国人立即做出反应；英国人及时做出反应。他们反应慢，但他们也很实际。他们的本能阻止他们在马车里乱动，因为那样做更可能使马车翻倒。他们具有这种对事实的非凡理解力，我们将一再注意到这一点。当灾难来临时，英国人的本能是先做能做的事，尽可能推迟感受。因此，他们在紧急情况下表现卓越。毫无疑问，他们是勇敢的——没有人会否认勇敢部分上是神经的事，而英国人的神经系统在应对身体紧急情况方面装备精良。",
            grammarAnalysis: "1. 原因状语从句：\"The Englishman appears to be cold and unemotional because he is really slow\" 中，because引导原因状语从句；2. 时间状语从句：\"When an event happens\" 中，When引导时间从句，说明事件发生的时机；3. 转折并列句：\"he may understand it quickly enough with his mind, but he takes quite a while to feel it\" 中，but连接两个并列分句，形成对比；4. 现在分词作后置定语：\"containing some Englishmen and some Frenchmen\" 修饰coach，说明马车的内容；5. 时间状语从句：\"as they were dashing across a bridge\" 中，as表“当……时”，引导时间从句；6. 并列谓语：\"caught on the stonework, tottered, and nearly fell\" 中，三个动词并列描述连续动作；7. 同位语省略：\"The Frenchmen were frantic with terror: they screamed...\" 中，冒号后为同位语，解释frantic的具体表现；8. 时间状语从句：\"An hour later, the coach drew up... and by that time the situations were exactly reversed\" 中，by that time为时间状语，强调时间点的对比；9. 定语从句：\"a difference that goes deep into character\" 中，that引导定语从句修饰difference；10. 原因状语从句：\"because it was more likely to tip over if they did\" 中，because引导原因从句，从句内含if条件从句；11. 宾语从句：\"that we shall notice again and again\" 为that引导的定语从句，修饰appreciation；12. 不定式作表语：\"the English instinct is to do what can be done first\" 中，to do为不定式作表语，what引导宾语从句作do的宾语。",
            vocabulary: [
                {
                    word: "unemotional",
                    phonetic: "/ˌʌnɪˈmoʊʃənl/",
                    level: "四六级/雅思词汇",
                    partOfSpeech: "adj.",
                    meaning: "缺乏情感的，冷漠的",
                    example: { english: "He remained unemotional even when hearing the bad news.", chinese: "即使听到坏消息，他仍然保持冷静。" },
                    derivations: [
                        { word: "emotional", phonetic: "/ɪˈmoʊʃənl/", partOfSpeech: "adj.", meaning: "情感的，感性的", note: "反义词，如emotional support（情感支持）" },
                        { word: "emotion", phonetic: "/ɪˈmoʊʃn/", partOfSpeech: "n.", meaning: "情感，情绪", note: "名词形式，如strong emotions（强烈的情感）" }
                    ]
                },
                {
                    word: "dash",
                    phonetic: "/dæʃ/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "猛冲，飞奔",
                    example: { english: "The children dashed across the playground.", chinese: "孩子们冲过操场。" },
                    derivations: [
                        { word: "dashing", phonetic: "/ˈdæʃɪŋ/", partOfSpeech: "adj.", meaning: "飞奔的；潇洒的", note: "形容词形式，如a dashing young man（潇洒的年轻人）" }
                    ]
                },
                {
                    word: "totter",
                    phonetic: "/ˈtɑːtər/",
                    level: "雅思词汇",
                    partOfSpeech: "v.",
                    meaning: "摇摇欲坠，蹒跚",
                    example: { english: "The old building tottered in the strong wind.", chinese: "这座老建筑在强风中摇摇欲坠。" },
                    derivations: []
                },
                {
                    word: "ravine",
                    phonetic: "/rəˈviːn/",
                    level: "雅思词汇",
                    partOfSpeech: "n.",
                    meaning: "深谷，沟壑",
                    example: { english: "The path leads down into a deep ravine.", chinese: "这条小路通向一个深谷。" },
                    derivations: []
                },
                {
                    word: "frantic",
                    phonetic: "/ˈfræntɪk/",
                    level: "四六级词汇",
                    partOfSpeech: "adj.",
                    meaning: "疯狂的，极度焦虑的",
                    example: { english: "She was frantic with worry about her missing child.", chinese: "她对失踪的孩子担心得发疯。" },
                    derivations: [
                        { word: "frantically", phonetic: "/ˈfræntɪkli/", partOfSpeech: "adv.", meaning: "疯狂地，极度焦虑地", note: "副词形式，如search frantically（疯狂地搜索）" }
                    ]
                },
                {
                    word: "gesticulate",
                    phonetic: "/dʒeˈstɪkjuleɪt/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "v.",
                    meaning: "做手势，比划",
                    example: { english: "He gesticulated wildly to get our attention.", chinese: "他疯狂地做手势以引起我们的注意。" },
                    derivations: [
                        { word: "gesticulation", phonetic: "/dʒeˌstɪkjuˈleɪʃn/", partOfSpeech: "n.", meaning: "手势，比划", note: "名词形式，如wild gesticulation（疯狂的手势）" }
                    ]
                },
                {
                    word: "nervous breakdown",
                    phonetic: "/ˈnɜːrvəs ˈbreɪkdaʊn/",
                    level: "四六级短语",
                    partOfSpeech: "n. phr.",
                    meaning: "神经崩溃，精神崩溃",
                    example: { english: "The stress caused him to have a nervous breakdown.", chinese: "压力导致他神经崩溃。" },
                    derivations: []
                },
                {
                    word: "oblige",
                    phonetic: "/əˈblaɪdʒ/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "迫使，强制（常用于被动语态）",
                    example: { english: "I was obliged to leave early due to an emergency.", chinese: "由于紧急情况，我不得不提前离开。" },
                    derivations: [
                        { word: "obligation", phonetic: "/ˌɑːblɪˈɡeɪʃn/", partOfSpeech: "n.", meaning: "义务，责任", note: "名词形式，如moral obligation（道德义务）" },
                        { word: "obligatory", phonetic: "/əˈblɪɡətɔːri/", partOfSpeech: "adj.", meaning: "强制性的，义务的", note: "形容词形式，如obligatory courses（必修课程）" }
                    ]
                },
                {
                    word: "forbid",
                    phonetic: "/fərˈbɪd/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "禁止，阻止",
                    example: { english: "The law forbids smoking in public places.", chinese: "法律禁止在公共场所吸烟。" },
                    derivations: [
                        { word: "forbidden", phonetic: "/fərˈbɪdn/", partOfSpeech: "adj.", meaning: "被禁止的", note: "过去分词作形容词，如forbidden fruit（禁果）" }
                    ]
                },
                {
                    word: "tip over",
                    phonetic: "/tɪp ˈoʊvər/",
                    level: "基础短语",
                    partOfSpeech: "v. phr.",
                    meaning: "翻倒，倾倒",
                    example: { english: "Be careful not to tip over the vase.", chinese: "小心别把花瓶打翻。" },
                    derivations: []
                },
                {
                    word: "appreciation",
                    phonetic: "/əˌpriːʃiˈeɪʃn/",
                    level: "四六级词汇",
                    partOfSpeech: "n.",
                    meaning: "理解，欣赏，感激",
                    example: { english: "I have a deep appreciation for classical music.", chinese: "我对古典音乐有深刻的理解和欣赏。" },
                    derivations: [
                        { word: "appreciate", phonetic: "/əˈpriːʃieɪt/", partOfSpeech: "v.", meaning: "理解，欣赏，感激", note: "动词形式，如appreciate art（欣赏艺术）" },
                        { word: "appreciative", phonetic: "/əˈpriːʃətɪv/", partOfSpeech: "adj.", meaning: "感激的，欣赏的", note: "形容词形式，如appreciative audience（欣赏的观众）" }
                    ]
                },
                {
                    word: "postpone",
                    phonetic: "/poʊstˈpoʊn/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "推迟，延期",
                    example: { english: "We had to postpone the meeting until next week.", chinese: "我们不得不将会议推迟到下星期。" },
                    derivations: [
                        { word: "postponement", phonetic: "/poʊstˈpoʊnmənt/", partOfSpeech: "n.", meaning: "推迟，延期", note: "名词形式，如postponement of the event（活动的延期）" }
                    ]
                },
                {
                    word: "splendid",
                    phonetic: "/ˈsplendɪd/",
                    level: "基础词汇",
                    partOfSpeech: "adj.",
                    meaning: "卓越的，出色的",
                    example: { english: "She did a splendid job on the project.", chinese: "她在项目上做得非常出色。" },
                    derivations: []
                },
                {
                    word: "emergency",
                    phonetic: "/ɪˈmɜːrdʒənsi/",
                    level: "基础词汇",
                    partOfSpeech: "n.",
                    meaning: "紧急情况，突发事件",
                    example: { english: "Call 911 in case of emergency.", chinese: "遇到紧急情况请拨打911。" },
                    derivations: [
                        { word: "emergent", phonetic: "/ɪˈmɜːrdʒənt/", partOfSpeech: "adj.", meaning: "紧急的，新兴的", note: "形容词形式，如emergent situation（紧急情况）" }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: "",
            subtitle: "",
            readingTime: "1分钟",
            englishText: "It acts promptly and feels slowly. Such a combination is fruitful, and anyone who possesses it has gone a long way toward being brave. And when the action is over, then the Englishman can feel.",
            chineseTranslation: "它行动迅速，感受缓慢。这样的结合是富有成效的，任何拥有这种特质的人都在勇敢的道路上走得很远。当行动结束后，英国人才能感受。",
            grammarAnalysis: "1. 并列句：\"It acts promptly and feels slowly\" 中，and连接两个并列谓语，形成对比；2. 主语从句：\"Such a combination is fruitful\" 中，such a combination为主语，强调这种结合；3. 定语从句：\"anyone who possesses it\" 中，who引导定语从句修饰anyone；4. 固定搭配：\"has gone a long way toward being brave\" 中，go a long way toward表“在……方面取得很大进展”；5. 时间状语从句：\"when the action is over\" 中，when引导时间从句，then为副词，强调时间顺序。",
            vocabulary: [
                {
                    word: "promptly",
                    phonetic: "/ˈprɑːmptli/",
                    level: "四六级词汇",
                    partOfSpeech: "adv.",
                    meaning: "迅速地，立即",
                    example: { english: "She responded promptly to the email.", chinese: "她立即回复了邮件。" },
                    derivations: [
                        { word: "prompt", phonetic: "/prɑːmpt/", partOfSpeech: "adj./v.", meaning: "迅速的；促使", note: "形容词如prompt reply（迅速回复），动词如prompt action（促使行动）" },
                        { word: "promptness", phonetic: "/ˈprɑːmptnəs/", partOfSpeech: "n.", meaning: "迅速，及时", note: "名词形式，如promptness of response（反应的迅速）" }
                    ]
                },
                {
                    word: "fruitful",
                    phonetic: "/ˈfruːtfl/",
                    level: "四六级词汇",
                    partOfSpeech: "adj.",
                    meaning: "富有成效的，多产的",
                    example: { english: "The meeting was very fruitful and produced many new ideas.", chinese: "这次会议很有成效，产生了许多新想法。" },
                    derivations: [
                        { word: "fruitfully", phonetic: "/ˈfruːtfəli/", partOfSpeech: "adv.", meaning: "富有成效地", note: "副词形式，如work fruitfully（富有成效地工作）" },
                        { word: "fruitfulness", phonetic: "/ˈfruːtflnəs/", partOfSpeech: "n.", meaning: "富有成效，多产", note: "名词形式，如fruitfulness of research（研究的富有成效）" }
                    ]
                },
                {
                    word: "possess",
                    phonetic: "/pəˈzes/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "拥有，具有",
                    example: { english: "She possesses great talent for music.", chinese: "她拥有非凡的音乐天赋。" },
                    derivations: [
                        { word: "possession", phonetic: "/pəˈzeʃn/", partOfSpeech: "n.", meaning: "拥有，财产", note: "名词形式，如personal possession（个人财产）" },
                        { word: "possessive", phonetic: "/pəˈzesɪv/", partOfSpeech: "adj.", meaning: "占有的，所有格的", note: "形容词形式，如possessive pronoun（所有格代词）" }
                    ]
                },
                {
                    word: "go a long way toward",
                    phonetic: "/ɡoʊ ə lɔːŋ weɪ təˈwɔːrd/",
                    level: "四六级短语",
                    partOfSpeech: "v. phr.",
                    meaning: "在……方面取得很大进展，对……有很大帮助",
                    example: { english: "This donation will go a long way toward helping the homeless.", chinese: "这笔捐款将在帮助无家可归者方面起到很大作用。" },
                    derivations: []
                }
            ]
        },
        {
            id: 3,
            title: "",
            subtitle: "",
            readingTime: "2分钟",
            englishText: "There is one more consideration—a most important one. If the English nature is cold, how is it that it has produced a great literature and a literature that is particularly great in poetry? Judged by its prose, English literature would not stand in the first rank. It is its poetry that raises it to the level of Greek, Persian, or French. And yet the English are supposed to be so unpoetical. How is this? The nation that produced the Elizabethan drama and the Lake Poets cannot be a cold, unpoetical nation. We can't get fire out of ice. Since literature always rests upon national character, there must be in the English nature hidden springs of fire to produce the fire we see. The warm sympathy, the romance, the imagination, that we look for in Englishmen whom we meet, and too often vainly look for, must exist in the nation as a whole, or we could not have this outburst of national song. An undeveloped heart not a cold one.",
            chineseTranslation: "还有一个考虑——一个最重要的考虑。如果英国人的天性冷漠，那么它怎么可能产生伟大的文学，尤其是伟大的诗歌文学呢？就其散文而言，英国文学不会居于第一流。正是它的诗歌将它提升到希腊、波斯或法国文学的水平。然而，英国人被认为如此缺乏诗意。这是怎么回事？产生了伊丽莎白时代戏剧和湖畔诗人的民族不可能是冷漠、缺乏诗意的民族。我们不可能从冰中取火。既然文学总是建立在民族性格之上，那么在英国人的天性中一定存在隐藏的火源，才能产生我们所看到的火焰。我们在遇到的英国人身上寻找的温暖同情、浪漫情怀和想象力——虽然经常徒劳地寻找——一定在整个民族中存在，否则我们不可能有这种民族诗歌的爆发。那是一颗未开发的心，而不是冷漠的心。",
            grammarAnalysis: "1. 同位语：\"There is one more consideration—a most important one\" 中，破折号后为同位语，强调重要性；2. 条件状语从句+宾语从句：\"If the English nature is cold, how is it that it has produced...\" 中，If引导条件从句，how is it that...为特殊疑问句，that引导宾语从句；3. 定语从句：\"a literature that is particularly great in poetry\" 中，that引导定语从句修饰literature；4. 过去分词作状语：\"Judged by its prose\" 中，judged为过去分词作条件状语；5. 强调句：\"It is its poetry that raises it...\" 中，It is...that...为强调句型，强调主语its poetry；6. 定语从句：\"The nation that produced the Elizabethan drama...\" 中，that引导定语从句修饰nation；7. 原因状语从句：\"Since literature always rests upon national character\" 中，Since表“因为”，引导原因从句；8. 存在句：\"there must be in the English nature hidden springs of fire\" 中，there be结构，hidden springs为真正主语；9. 定语从句嵌套：\"that we look for in Englishmen whom we meet\" 中，that引导定语从句修饰sympathy/romance/imagination，从句内whom引导定语从句修饰Englishmen；10. 条件状语从句：\"or we could not have this outburst\" 中，or表“否则”，引导条件从句。",
            vocabulary: [
                {
                    word: "consideration",
                    phonetic: "/kənˌsɪdəˈreɪʃn/",
                    level: "四六级词汇",
                    partOfSpeech: "n.",
                    meaning: "考虑，因素",
                    example: { english: "We need to take all considerations into account.", chinese: "我们需要考虑所有因素。" },
                    derivations: [
                        { word: "consider", phonetic: "/kənˈsɪdər/", partOfSpeech: "v.", meaning: "考虑，认为", note: "动词形式，如consider carefully（仔细考虑）" },
                        { word: "considerable", phonetic: "/kənˈsɪdərəbl/", partOfSpeech: "adj.", meaning: "相当大的，重要的", note: "形容词形式，如considerable amount（相当大的数量）" }
                    ]
                },
                {
                    word: "prose",
                    phonetic: "/proʊz/",
                    level: "四六级词汇",
                    partOfSpeech: "n.",
                    meaning: "散文，白话文",
                    example: { english: "She writes both poetry and prose.", chinese: "她既写诗歌也写散文。" },
                    derivations: []
                },
                {
                    word: "stand in the first rank",
                    phonetic: "/stænd ɪn ðə fɜːrst ræŋk/",
                    level: "四六级短语",
                    partOfSpeech: "v. phr.",
                    meaning: "居于第一流，处于领先地位",
                    example: { english: "This university stands in the first rank of academic institutions.", chinese: "这所大学在学术机构中居于第一流。" },
                    derivations: []
                },
                {
                    word: "unpoetical",
                    phonetic: "/ˌʌnpoʊˈetɪkl/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "adj.",
                    meaning: "缺乏诗意的，非诗意的",
                    example: { english: "His writing style is rather unpoetical.", chinese: "他的写作风格相当缺乏诗意。" },
                    derivations: [
                        { word: "poetical", phonetic: "/poʊˈetɪkl/", partOfSpeech: "adj.", meaning: "诗意的，诗的", note: "反义词，如poetical language（诗意的语言）" },
                        { word: "poetry", phonetic: "/ˈpoʊətri/", partOfSpeech: "n.", meaning: "诗歌，诗意", note: "名词形式，如love poetry（爱情诗歌）" }
                    ]
                },
                {
                    word: "rest upon",
                    phonetic: "/rest əˈpɑːn/",
                    level: "四六级短语",
                    partOfSpeech: "v. phr.",
                    meaning: "建立在……之上，依赖于",
                    example: { english: "The theory rests upon solid evidence.", chinese: "这个理论建立在坚实的证据之上。" },
                    derivations: []
                },
                {
                    word: "spring",
                    phonetic: "/sprɪŋ/",
                    level: "基础词汇",
                    partOfSpeech: "n.",
                    meaning: "源泉，泉水（此处指“源泉”）",
                    example: { english: "The spring of knowledge flows from books.", chinese: "知识的源泉来自书籍。" },
                    derivations: []
                },
                {
                    word: "vainly",
                    phonetic: "/ˈveɪnli/",
                    level: "四六级词汇",
                    partOfSpeech: "adv.",
                    meaning: "徒劳地，无用地",
                    example: { english: "He vainly tried to convince her to stay.", chinese: "他徒劳地试图说服她留下来。" },
                    derivations: [
                        { word: "vain", phonetic: "/veɪn/", partOfSpeech: "adj.", meaning: "徒劳的；自负的", note: "形容词形式，如vain attempt（徒劳的尝试）" },
                        { word: "vanity", phonetic: "/ˈvænəti/", partOfSpeech: "n.", meaning: "虚荣，自负", note: "名词形式，如vanity fair（名利场）" }
                    ]
                },
                {
                    word: "outburst",
                    phonetic: "/ˈaʊtbɜːrst/",
                    level: "四六级词汇",
                    partOfSpeech: "n.",
                    meaning: "爆发，突发",
                    example: { english: "There was an outburst of applause when the singer finished.", chinese: "歌手唱完时爆发出一阵掌声。" },
                    derivations: []
                },
                {
                    word: "undeveloped",
                    phonetic: "/ˌʌndɪˈveləpt/",
                    level: "四六级词汇",
                    partOfSpeech: "adj.",
                    meaning: "未开发的，未发展的",
                    example: { english: "The undeveloped land has great potential.", chinese: "这片未开发的土地有很大的潜力。" },
                    derivations: [
                        { word: "develop", phonetic: "/dɪˈveləp/", partOfSpeech: "v.", meaning: "发展，开发", note: "动词形式，如develop skills（发展技能）" },
                        { word: "development", phonetic: "/dɪˈveləpmənt/", partOfSpeech: "n.", meaning: "发展，开发", note: "名词形式，如economic development（经济发展）" }
                    ]
                }
            ]
        },
        {
            id: 4,
            title: "",
            subtitle: "",
            readingTime: "3分钟",
            englishText: "The trouble is that the English nature is not at all easy to understand. It has a great air of simplicity, it advertises itself as simple, but the more we consider it, the greater the problems we shall encounter. People talk of the mysterious East, but the West also is mysterious. It has depths that do not reveal themselves at the first gaze. We know what the sea looks like from a distance: it is of one color, and level, and obviously cannot contain such creatures as fish. But if we look into the sea over the edge of a boat, we see a dozen colors, and depth below depth, and fish swimming in them. That sea is the English character apparently imperturbable and even. These depths and the colors are the English romanticism and the English sensitiveness-we do not expect to find such things, but they exist. And—to continue my metaphor-the fish are the English emotions, which are always trying to get up to the surface, but don't quite know how. For the most part we see them moving far below, distorted and obscure. Now and then they succeed and we exclaim, \"Why, the Englishman has emotions! He actually can feel!\" And occasionally we see that beautiful creature the flying fish, which rises out of the water altogether into the air and the sunlight. English literature is a flying fish. It is a sample of the life that goes on day after day beneath the surface; it is a proof that beauty and emotion exist in the salt, inhospitable sea.",
            chineseTranslation: "问题在于，英国人的天性一点也不容易理解。它有一种强烈的简单感，它把自己宣传为简单，但我们越考虑它，就会遇到越大的问题。人们谈论神秘的东方，但西方也是神秘的。它有在第一眼时不会显露的深度。我们知道从远处看海是什么样子：它是一种颜色，是平的，显然不可能包含像鱼这样的生物。但如果我们从船边往海里看，我们会看到十几种颜色，深度之下还有深度，鱼在其中游动。那片海就是英国人的性格——表面上平静而均匀。这些深度和颜色就是英国人的浪漫主义和敏感性——我们不期望找到这些东西，但它们确实存在。而且——继续我的比喻——鱼就是英国人的情感，它们总是试图浮到表面，但不太知道如何做到。在大多数情况下，我们看到它们在深处游动，扭曲而模糊。偶尔它们成功了，我们惊呼：“怎么，英国人也有情感！他实际上能感受！”偶尔我们也会看到那种美丽的生物——飞鱼，它完全从水中跃出，进入空气和阳光中。英国文学就是一条飞鱼。它是表面之下日复一日持续的生活的一个样本；它是证明，证明在盐分浓重、不友好的海洋中存在着美丽和情感。",
            grammarAnalysis: "1. 表语从句：\"The trouble is that the English nature is not at all easy to understand\" 中，that引导表语从句；2. 并列句：\"It has a great air of simplicity, it advertises itself as simple\" 中，两个分句并列；3. 比较结构：\"the more we consider it, the greater the problems\" 中，the more...the greater...为比较结构；4. 转折并列句：\"People talk of the mysterious East, but the West also is mysterious\" 中，but表转折；5. 定语从句：\"depths that do not reveal themselves at the first gaze\" 中，that引导定语从句修饰depths；6. 宾语从句：\"We know what the sea looks like\" 中，what引导宾语从句作know的宾语；7. 条件状语从句：\"if we look into the sea over the edge of a boat\" 中，if引导条件从句；8. 现在分词作后置定语：\"fish swimming in them\" 中，swimming为现在分词作后置定语；9. 同位语：\"That sea is the English character apparently imperturbable and even\" 中，apparently imperturbable and even为形容词短语作character的同位语；10. 插入语：\"to continue my metaphor\" 为不定式作插入语；11. 定语从句：\"which are always trying to get up to the surface\" 中，which引导非限制性定语从句修饰emotions；12. 定语从句：\"which rises out of the water altogether\" 中，which引导定语从句修饰flying fish；13. 定语从句：\"that goes on day after day beneath the surface\" 中，that引导定语从句修饰life；14. 同位语从句：\"it is a proof that beauty and emotion exist\" 中，that引导同位语从句，说明proof的内容。",
            vocabulary: [
                {
                    word: "air",
                    phonetic: "/er/",
                    level: "基础词汇",
                    partOfSpeech: "n.",
                    meaning: "外观，神态（此处指“外观、感觉”）",
                    example: { english: "She has an air of confidence about her.", chinese: "她有一种自信的神态。" },
                    derivations: []
                },
                {
                    word: "advertise",
                    phonetic: "/ˈædvərtaɪz/",
                    level: "基础词汇",
                    partOfSpeech: "v.",
                    meaning: "宣传，做广告（此处指“展示、表现”）",
                    example: { english: "The company advertises its products on television.", chinese: "这家公司在电视上做产品广告。" },
                    derivations: [
                        { word: "advertisement", phonetic: "/ədˈvɜːrtɪsmənt/", partOfSpeech: "n.", meaning: "广告", note: "名词形式，如TV advertisement（电视广告）" },
                        { word: "advertising", phonetic: "/ˈædvərtaɪzɪŋ/", partOfSpeech: "n.", meaning: "广告业，广告活动", note: "名词形式，如advertising industry（广告业）" }
                    ]
                },
                {
                    word: "reveal",
                    phonetic: "/rɪˈviːl/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "显露，揭示",
                    example: { english: "The investigation revealed the truth.", chinese: "调查揭示了真相。" },
                    derivations: [
                        { word: "revelation", phonetic: "/ˌrevəˈleɪʃn/", partOfSpeech: "n.", meaning: "揭示，启示", note: "名词形式，如divine revelation（神的启示）" }
                    ]
                },
                {
                    word: "gaze",
                    phonetic: "/ɡeɪz/",
                    level: "四六级词汇",
                    partOfSpeech: "n./v.",
                    meaning: "凝视，注视",
                    example: { english: "She fixed her gaze on the horizon.", chinese: "她凝视着地平线。" },
                    derivations: []
                },
                {
                    word: "imperturbable",
                    phonetic: "/ˌɪmpərˈtɜːrbəbl/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "adj.",
                    meaning: "平静的，不易激动的",
                    example: { english: "He remained imperturbable despite the chaos around him.", chinese: "尽管周围一片混乱，他仍然保持平静。" },
                    derivations: [
                        { word: "perturb", phonetic: "/pərˈtɜːrb/", partOfSpeech: "v.", meaning: "扰乱，使不安", note: "词根，如perturb the peace（扰乱和平）" }
                    ]
                },
                {
                    word: "romanticism",
                    phonetic: "/roʊˈmæntɪsɪzəm/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "n.",
                    meaning: "浪漫主义",
                    example: { english: "Romanticism flourished in the 19th century.", chinese: "浪漫主义在19世纪蓬勃发展。" },
                    derivations: [
                        { word: "romantic", phonetic: "/roʊˈmæntɪk/", partOfSpeech: "adj.", meaning: "浪漫的", note: "形容词形式，如romantic story（浪漫故事）" },
                        { word: "romance", phonetic: "/roʊˈmæns/", partOfSpeech: "n.", meaning: "浪漫，爱情", note: "名词形式，如a romance novel（爱情小说）" }
                    ]
                },
                {
                    word: "sensitiveness",
                    phonetic: "/ˈsensətɪvnəs/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "n.",
                    meaning: "敏感性，感受性",
                    example: { english: "Her sensitiveness to criticism made her vulnerable.", chinese: "她对批评的敏感性使她脆弱。" },
                    derivations: [
                        { word: "sensitive", phonetic: "/ˈsensətɪv/", partOfSpeech: "adj.", meaning: "敏感的", note: "形容词形式，如sensitive skin（敏感肌肤）" },
                        { word: "sensitivity", phonetic: "/ˌsensəˈtɪvəti/", partOfSpeech: "n.", meaning: "敏感性", note: "名词形式，如sensitivity to light（对光的敏感性）" }
                    ]
                },
                {
                    word: "metaphor",
                    phonetic: "/ˈmetəfɔːr/",
                    level: "四六级词汇",
                    partOfSpeech: "n.",
                    meaning: "隐喻，比喻",
                    example: { english: "The author uses the sea as a metaphor for life.", chinese: "作者用大海作为生活的隐喻。" },
                    derivations: [
                        { word: "metaphorical", phonetic: "/ˌmetəˈfɔːrɪkl/", partOfSpeech: "adj.", meaning: "隐喻的，比喻的", note: "形容词形式，如metaphorical language（隐喻语言）" }
                    ]
                },
                {
                    word: "distorted",
                    phonetic: "/dɪˈstɔːrtɪd/",
                    level: "四六级词汇",
                    partOfSpeech: "adj.",
                    meaning: "扭曲的，变形的",
                    example: { english: "The distorted image reflected his inner turmoil.", chinese: "扭曲的影像反映了他内心的混乱。" },
                    derivations: [
                        { word: "distort", phonetic: "/dɪˈstɔːrt/", partOfSpeech: "v.", meaning: "扭曲，歪曲", note: "动词形式，如distort the truth（歪曲真相）" },
                        { word: "distortion", phonetic: "/dɪˈstɔːrʃn/", partOfSpeech: "n.", meaning: "扭曲，变形", note: "名词形式，如image distortion（图像失真）" }
                    ]
                },
                {
                    word: "obscure",
                    phonetic: "/əbˈskjʊr/",
                    level: "四六级/雅思词汇",
                    partOfSpeech: "adj.",
                    meaning: "模糊的，不清楚的",
                    example: { english: "The meaning of the poem remains obscure.", chinese: "这首诗的含义仍然模糊不清。" },
                    derivations: [
                        { word: "obscurity", phonetic: "/əbˈskjʊrəti/", partOfSpeech: "n.", meaning: "模糊，晦涩", note: "名词形式，如obscurity of meaning（含义的晦涩）" }
                    ]
                },
                {
                    word: "exclaim",
                    phonetic: "/ɪkˈskleɪm/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "惊呼，大声说",
                    example: { english: "She exclaimed in surprise when she saw the gift.", chinese: "她看到礼物时惊讶地叫了起来。" },
                    derivations: [
                        { word: "exclamation", phonetic: "/ˌekskləˈmeɪʃn/", partOfSpeech: "n.", meaning: "惊呼，感叹", note: "名词形式，如exclamation mark（感叹号）" }
                    ]
                },
                {
                    word: "inhospitable",
                    phonetic: "/ˌɪnhɑːˈspɪtəbl/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "adj.",
                    meaning: "不友好的，不适宜居住的",
                    example: { english: "The inhospitable desert made travel difficult.", chinese: "不友好的沙漠使旅行变得困难。" },
                    derivations: [
                        { word: "hospitable", phonetic: "/hɑːˈspɪtəbl/", partOfSpeech: "adj.", meaning: "友好的，好客的", note: "反义词，如hospitable host（好客的主人）" },
                        { word: "hospitality", phonetic: "/ˌhɑːspɪˈtæləti/", partOfSpeech: "n.", meaning: "好客，热情", note: "名词形式，如hospitality industry（ hospitality业）" }
                    ]
                }
            ]
        },
        {
            id: 5,
            title: "",
            subtitle: "",
            readingTime: "2分钟",
            englishText: "And now let's get back to terra firma. The Englishman's attitude toward criticism will give us another starting point. He is not annoyed by criticism. He listens or not as the case may be, smiles and passes on, saying, \"Oh, the fellow's jealous\"; \"Oh, I'm used to Bernard Shaw° ; monkey tricks don't hurt me.\" It never occurs to him that the fellow may be accurate as well as jealous, and that he might do well to take the criticism to heart and profit by it. It never strikes him except as a form of words— that he is capable of improvement; his self-complacency is abysmal. Other nations, both Oriental and European, have an uneasy feeling that they are not quite perfect. In consequence they resent criticism. It hurts them; and their snappy answers often mask a determination to improve themselves. Not so the Englishman. He has no uneasy feeling. Let the critics bark. And the \"tolerant humorous attitude\" with which he confronts them is not really humorous, because it is bounded by the titter and the guffaw.",
            chineseTranslation: "现在让我们回到现实中来。英国人对批评的态度将给我们另一个起点。他不会因为批评而烦恼。他可能听也可能不听，视情况而定，微笑着继续前进，说：“哦，那家伙嫉妒了”；“哦，我已经习惯了萧伯纳；那些小把戏伤害不了我。”他从未想到那个批评者可能既准确又嫉妒，也从未想到他最好把批评放在心上并从中受益。除了作为语言形式外，他从未意识到——他是有能力改进的；他的自满情绪是深不可测的。其他民族，无论是东方的还是欧洲的，都有一种不安的感觉，即他们并不完美。因此，他们怨恨批评。这伤害了他们；他们尖锐的回答往往掩盖了改进自己的决心。英国人不是这样。他没有任何不安的感觉。让批评者吠叫吧。他用这种“宽容幽默的态度”来面对他们，但并不是真正的幽默，因为它被窃笑和大笑所限制。",
            grammarAnalysis: "1. 固定短语：\"get back to terra firma\" 中，terra firma为拉丁语，表“实地，现实”；2. 介词短语：\"attitude toward criticism\" 中，toward表“对……的态度”；3. 被动语态：\"He is not annoyed by criticism\" 中，be annoyed by表“被……困扰”；4. 条件状语：\"as the case may be\" 为固定短语，表“视情况而定”；5. 并列谓语：\"smiles and passes on\" 中，两个动词并列；6. 现在分词作状语：\"saying...\" 中，saying为现在分词作伴随状语；7. 形式主语：\"It never occurs to him that...\" 中，it为形式主语，真正主语为that引导的主语从句；8. 并列宾语从句：\"that the fellow may be accurate as well as jealous, and that he might do well...\" 中，两个that引导并列宾语从句；9. 固定搭配：\"take the criticism to heart\" 表“把批评放在心上”；10. 固定搭配：\"profit by it\" 表“从中受益”；11. 同位语：\"except as a form of words— that he is capable of improvement\" 中，that引导同位语从句，说明words的内容；12. 同位语：\"both Oriental and European\" 为both...and...结构，作nations的同位语；13. 同位语从句：\"that they are not quite perfect\" 中，that引导同位语从句，说明feeling的内容；14. 结果状语：\"In consequence\" 为固定短语，表“因此”；15. 定语从句：\"with which he confronts them\" 中，which引导定语从句修饰attitude，with which表“用这种态度”；16. 原因状语从句：\"because it is bounded by...\" 中，because引导原因从句。",
            vocabulary: [
                {
                    word: "terra firma",
                    phonetic: "/ˌterə ˈfɜːrmə/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "n. phr.",
                    meaning: "实地，现实（拉丁语，字面意思为“坚实的大地”）",
                    example: { english: "After the long flight, we were glad to be back on terra firma.", chinese: "经过长途飞行，我们很高兴回到实地。" },
                    derivations: []
                },
                {
                    word: "annoy",
                    phonetic: "/əˈnɔɪ/",
                    level: "基础词汇",
                    partOfSpeech: "v.",
                    meaning: "使烦恼，使生气",
                    example: { english: "The loud music annoyed the neighbors.", chinese: "吵闹的音乐让邻居很烦恼。" },
                    derivations: [
                        { word: "annoyed", phonetic: "/əˈnɔɪd/", partOfSpeech: "adj.", meaning: "烦恼的，生气的", note: "形容词形式，如annoyed look（烦恼的表情）" },
                        { word: "annoyance", phonetic: "/əˈnɔɪəns/", partOfSpeech: "n.", meaning: "烦恼，恼怒", note: "名词形式，如cause annoyance（引起烦恼）" }
                    ]
                },
                {
                    word: "as the case may be",
                    phonetic: "/æz ðə keɪs meɪ biː/",
                    level: "四六级短语",
                    partOfSpeech: "adv. phr.",
                    meaning: "视情况而定",
                    example: { english: "We'll decide tomorrow, as the case may be.", chinese: "我们明天会决定，视情况而定。" },
                    derivations: []
                },
                {
                    word: "occur to",
                    phonetic: "/əˈkɜːr tuː/",
                    level: "四六级短语",
                    partOfSpeech: "v. phr.",
                    meaning: "想到，想起",
                    example: { english: "It never occurred to me that he might be lying.", chinese: "我从未想到他可能在撒谎。" },
                    derivations: []
                },
                {
                    word: "take to heart",
                    phonetic: "/teɪk tuː hɑːrt/",
                    level: "四六级短语",
                    partOfSpeech: "v. phr.",
                    meaning: "放在心上，认真对待",
                    example: { english: "She took his advice to heart and changed her behavior.", chinese: "她把他的建议放在心上，改变了她的行为。" },
                    derivations: []
                },
                {
                    word: "profit by",
                    phonetic: "/ˈprɑːfɪt baɪ/",
                    level: "四六级短语",
                    partOfSpeech: "v. phr.",
                    meaning: "从……中受益，从……中获利",
                    example: { english: "We should profit by our mistakes.", chinese: "我们应该从错误中受益。" },
                    derivations: []
                },
                {
                    word: "strike",
                    phonetic: "/straɪk/",
                    level: "基础词汇",
                    partOfSpeech: "v.",
                    meaning: "使想到，给……留下印象",
                    example: { english: "It struck me that we had met before.", chinese: "我突然想到我们以前见过。" },
                    derivations: []
                },
                {
                    word: "self-complacency",
                    phonetic: "/ˌself kəmˈpleɪsənsi/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "n.",
                    meaning: "自满，自鸣得意",
                    example: { english: "His self-complacency prevented him from improving.", chinese: "他的自满阻碍了他的进步。" },
                    derivations: [
                        { word: "complacent", phonetic: "/kəmˈpleɪsnt/", partOfSpeech: "adj.", meaning: "自满的，自得的", note: "形容词形式，如complacent attitude（自满的态度）" },
                        { word: "complacency", phonetic: "/kəmˈpleɪsənsi/", partOfSpeech: "n.", meaning: "自满，自得", note: "名词形式，如dangerous complacency（危险的自满）" }
                    ]
                },
                {
                    word: "abysmal",
                    phonetic: "/əˈbɪzməl/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "adj.",
                    meaning: "极深的，深不可测的",
                    example: { english: "The team's performance was abysmal.", chinese: "团队的表现糟糕透顶。" },
                    derivations: [
                        { word: "abyss", phonetic: "/əˈbɪs/", partOfSpeech: "n.", meaning: "深渊，无底洞", note: "词根，如abyss of despair（绝望的深渊）" }
                    ]
                },
                {
                    word: "Oriental",
                    phonetic: "/ˌɔːriˈentl/",
                    level: "四六级词汇",
                    partOfSpeech: "adj./n.",
                    meaning: "东方的；东方人",
                    example: { english: "Oriental art has a long history.", chinese: "东方艺术有着悠久的历史。" },
                    derivations: [
                        { word: "orient", phonetic: "/ˈɔːrient/", partOfSpeech: "n./v.", meaning: "东方；使朝向", note: "名词如the Orient（东方），动词如orient oneself（确定方向）" }
                    ]
                },
                {
                    word: "in consequence",
                    phonetic: "/ɪn ˈkɑːnsəkwəns/",
                    level: "四六级短语",
                    partOfSpeech: "adv. phr.",
                    meaning: "因此，结果",
                    example: { english: "He failed the exam, and in consequence, he had to retake the course.", chinese: "他考试不及格，因此必须重修这门课。" },
                    derivations: []
                },
                {
                    word: "resent",
                    phonetic: "/rɪˈzent/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "怨恨，愤恨",
                    example: { english: "She resented his unfair treatment.", chinese: "她怨恨他的不公平对待。" },
                    derivations: [
                        { word: "resentment", phonetic: "/rɪˈzentmənt/", partOfSpeech: "n.", meaning: "怨恨，愤恨", note: "名词形式，如deep resentment（深深的怨恨）" },
                        { word: "resentful", phonetic: "/rɪˈzentfl/", partOfSpeech: "adj.", meaning: "怨恨的，愤恨的", note: "形容词形式，如resentful attitude（怨恨的态度）" }
                    ]
                },
                {
                    word: "snappy",
                    phonetic: "/ˈsnæpi/",
                    level: "四六级词汇",
                    partOfSpeech: "adj.",
                    meaning: "尖锐的，敏捷的",
                    example: { english: "She gave a snappy reply to his question.", chinese: "她对他的问题给出了尖锐的回答。" },
                    derivations: [
                        { word: "snap", phonetic: "/snæp/", partOfSpeech: "v./n.", meaning: "快速说；啪的一声", note: "动词如snap at someone（对某人厉声说），名词如snap of fingers（手指的啪声）" }
                    ]
                },
                {
                    word: "bark",
                    phonetic: "/bɑːrk/",
                    level: "基础词汇",
                    partOfSpeech: "v.",
                    meaning: "吠叫；大声喊（此处为比喻用法）",
                    example: { english: "The dog barked at the stranger.", chinese: "狗对陌生人吠叫。" },
                    derivations: []
                },
                {
                    word: "confront",
                    phonetic: "/kənˈfrʌnt/",
                    level: "四六级词汇",
                    partOfSpeech: "v.",
                    meaning: "面对，对抗",
                    example: { english: "We must confront the challenges ahead.", chinese: "我们必须面对前方的挑战。" },
                    derivations: [
                        { word: "confrontation", phonetic: "/ˌkɑːnfrʌnˈteɪʃn/", partOfSpeech: "n.", meaning: "对抗，冲突", note: "名词形式，如direct confrontation（直接对抗）" }
                    ]
                },
                {
                    word: "titter",
                    phonetic: "/ˈtɪtər/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "n./v.",
                    meaning: "窃笑，傻笑",
                    example: { english: "There was a titter in the audience when he made the joke.", chinese: "他讲笑话时，观众中发出一阵窃笑。" },
                    derivations: []
                },
                {
                    word: "guffaw",
                    phonetic: "/ɡəˈfɔː/",
                    level: "专八/雅思词汇",
                    partOfSpeech: "n./v.",
                    meaning: "大笑，哄笑",
                    example: { english: "His joke caused a loud guffaw from the crowd.", chinese: "他的笑话引起了人群的哄堂大笑。" },
                    derivations: []
                }
            ]
        }
    ],

    // 练习题目数据
    exercises: {
        // 阅读选择题（可以通过AI自动生成）
        readingComprehension: [
            // 示例题目
            {
                question: "According to the passage, why do Englishmen appear to be cold and unemotional?",
                options: [
                    "They are naturally unemotional people.",
                    "They are really slow to feel emotions.",
                    "They hide their emotions deliberately.",
                    "They lack emotional intelligence."
                ],
                correctAnswer: 1
            },
            {
                question: "What happened to the coach in the story?",
                options: [
                    "It fell into the ravine.",
                    "It caught on the stonework and nearly fell.",
                    "It crashed into the inn.",
                    "It was damaged by the horses."
                ],
                correctAnswer: 1
            }
        ],

        // 简答题（可以手动配置或自动生成）
        shortAnswer: [
            {
                question: "请用自己的话总结这篇文章的主要内容。",
                paragraphId: "all"
            },
            {
                question: "文章中提到了哪些主要观点？请列举至少三个。",
                paragraphId: "all"
            }
        ],

        // 语法题（可以从grammarAnalysis自动生成）
        grammar: [
            {
                type: 'choice',
                question: "______ the English nature is cold, how is it that it has produced a great literature?",
                options: [
                    "If",
                    "Whether",
                    "As if",
                    "Even if"
                ],
                correctAnswer: 0,
                explanation: "本题考查条件状语从句的引导词。句意：如果英国人的天性冷漠，那么它怎么可能产生伟大的文学呢？'If' 引导真实条件句，表示'如果'，符合语境。'Whether' 表示'是否'，用于宾语从句；'As if' 表示'好像'，用于方式状语从句；'Even if' 表示'即使'，用于让步状语从句，均不符合句意。"
            },
            {
                type: 'choice',
                question: "The nation ______ produced the Elizabethan drama and the Lake Poets cannot be a cold, unpoetical nation.",
                options: [
                    "which",
                    "that",
                    "who",
                    "what"
                ],
                correctAnswer: 1,
                explanation: "本题考查定语从句的关系代词。句意：产生了伊丽莎白时代戏剧和湖畔诗人的民族不可能是冷漠、缺乏诗意的民族。先行词是 'nation'（民族），在定语从句中作主语。虽然 'which' 和 'that' 都可以指物，但此处由于先行词 'nation' 被强调且从句较短，使用 'that' 更符合习惯。'who' 用于指人；'what' 不能引导定语从句。"
            },
            {
                type: 'choice',
                question: "The trouble is ______ the English nature is not at all easy to understand.",
                options: [
                    "that",
                    "what",
                    "which",
                    "why"
                ],
                correctAnswer: 0,
                explanation: "本题考查表语从句的引导词。句意：问题在于，英国人的天性一点也不容易理解。'The trouble is...' 后面接表语从句，说明 'trouble' 的具体内容。'that' 引导表语从句，只起连接作用，无实义，符合题意。'what' 在表语从句中需要充当成分；'which' 用于定语从句；'why' 表示原因，不符合句意。"
            },
            {
                type: 'choice',
                question: "The more we consider the English nature, ______ the problems we shall encounter.",
                options: [
                    "the greater",
                    "greater",
                    "the more greater",
                    "more greater"
                ],
                correctAnswer: 0,
                explanation: "本题考查比较结构 'the more...the more...' 的用法。句意：我们越考虑英国人的天性，就会遇到越大的问题。'the more...the more...' 是固定结构，表示'越……越……'，前后两个 'the' 都不能省略，且 'great' 的比较级是 'greater'，不能用 'more greater'。因此正确答案是 'the greater'。"
            }
        ],

        // 填空题（需要通过JS文件上传）
        fillInTheBlanks: [
            // 填空题通过JS文件上传，格式示例：
            // {
            //     text: "The Englishman appears to be cold and unemotional because he is really __1__. When an event happens, he may understand it quickly enough with his mind, but he takes quite a while to __2__ it.",
            //     answers: ["slow", "feel"]
            // }
        ]
    }
};
// 页面配置（与unit2.js保持一致，确保功能兼容）
const pageConfig = {
    itemsPerPage: 4, // 每页显示4个段落，适配5段内容（共2页：第1页4段，第2页1段）
    animationDuration: 300, // 动画持续时间（毫秒）
    ttsSettings: {
        rate: 0.8, // 语速（0.1-1.0，数值越小越慢）
        pitch: 1, // 音调（0-2，1为正常）
        volume: 1 // 音量（0-1）
    }
};
// 导出数据供其他模块使用（兼容Node.js和浏览器环境）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lessonData, pageConfig };
} else {
    window.lessonData = lessonData;
    window.pageConfig = pageConfig;
}

