// Unit3.js
// 外研版《现代大学英语》精读4 Unit 3 课后练习答案（Forster）
// 导出格式可直接用于Node端或前端调用

const unit3 = {
    // 阅读理解选择题
    readingComprehension: [
        {
            question: "According to the passage, why do Englishmen appear to be cold and unemotional?",
            options: [
                "They are naturally unemotional people.",
                "They are really slow to feel emotions.",
                "They hide their emotions deliberately.",
                "They lack emotional intelligence."
            ],
            correctAnswer: 1,
            explanation: "根据文章第一段，'The Englishman appears to be cold and unemotional because he is really slow. When an event happens, he may understand it quickly enough with his mind, but he takes quite a while to feel it.'（英国人看起来冷漠是因为他们反应慢，理解快但感受慢）。选项B正确，选项A、C、D都是对英国人性格的误解。"
        },
        {
            question: "What happened to the coach in the story about the Alps?",
            options: [
                "It fell into the ravine and crashed.",
                "It caught on the stonework, tottered, and nearly fell into the ravine.",
                "It crashed into the inn where they stopped.",
                "It was damaged by the runaway horses."
            ],
            correctAnswer: 1,
            explanation: "根据文章第一段描述：'Once upon a time a coach...was driving over the Alps. The horses ran away, and as they were dashing across a bridge the coach caught on the stonework, tottered, and nearly fell into the ravine below.'（马车撞到了石砌结构，摇晃起来，几乎掉进深谷）。选项B正确，马车并未真正掉下去，只是差点掉下去。"
        },
        {
            question: "According to Forster, what does the sea metaphor in the passage represent?",
            options: [
                "The Englishman's love for the ocean.",
                "The English character - apparently imperturbable on the surface but with hidden depths of emotion.",
                "The mysterious nature of the East.",
                "The English literature that is as vast as the sea."
            ],
            correctAnswer: 1,
            explanation: "根据文章第四段，Forster用海作为比喻来描述英国人性格：'That sea is the English character apparently imperturbable and even. These depths and the colors are the English romanticism and the English sensitiveness.'（海代表英国人的性格——表面平静，但深处有浪漫主义和敏感性）。选项B正确，这与文章的海的比喻完全吻合。"
        }
    ],

    understandingTheText: {
        1: {
            question: "What are the major arguments that Forster proposes in this text? Identify the topic sentences and the sentences which state Forster’s opinions.",
            answer: "The Englishman appears to be cold and unemotional because he is really slow. When an event happens, he may understand it quickly enough with his mind, but he takes quite a while to feel it. It acts promptly and feels slowly. An undeveloped heart—not a cold one. The trouble is that the English nature is not at all easy to understand. The Englishman's attitude toward criticism will give us another starting point."
        },
        2: {
            question: "According to Forster, what is the reason that the great English literature, particularly poetry, has been produced by a people with a seemingly cold nature?",
            answer: "He thought that the Englishman had an undeveloped heart—not a cold one; they were not really cold and unemotional."
        },
        3: {
            question: "What is Forster’s purpose in employing the sea metaphor? Explain the metaphor in your own words.",
            answer: "The sea metaphor indicated that it was hard to really understand the Englishman who was not cold and reserved as he appeared to be. The sea was deep and we couldn't know clearly about what was happening in the depth beneath its simple and quiet surface. Just like the flying fish that helped us realize the beauty and sophistication beneath the surface, the English literature helps us know the true character of the Englishman."
        }
    },

    // 填空题（支持层级结构）
    fillBlankGroups: [
        {
            // 第一大题：词汇填空
            title: "词汇填空",
            category: "词汇填空",
            wordOptions: ["confront", "encounter", "equip", "postpone", "reverse", "draw up", "get up", "rest upon", "take…to heart", "tip over"],
            items: [
                { s: "The policy is likely to be ______ if there is a change of government.", a: "reversed", explanation: "reverse作动词，意为'逆转，撤销'。句意：如果政府变更，政策可能会被逆转。" },
                { s: "I ______ to greet her when she entered the room.", a: "got up", explanation: "get up意为'站起来'。句意：当她进入房间时，我站起来向她打招呼。" },
                { s: "The little girl knew that she had to ______ her fears.", a: "confront", explanation: "confront意为'面对，正视'。句意：小女孩知道她必须面对自己的恐惧。" },
                { s: "The boat ______ and they were all thrown into the sea.", a: "tipped over", explanation: "tip over意为'翻倒，倾覆'。句意：船翻了，他们都被抛进了海里。" },
                { s: "As the car ______, the driver leaned out of the window to ask for directions.", a: "drew up", explanation: "draw up意为'（车辆）停下'。句意：当车停下时，司机探出车窗问路。" },
                { s: "The football game was ______ until tomorrow because of rain.", a: "postponed", explanation: "postpone意为'推迟，延期'。句意：由于下雨，足球比赛被推迟到明天。" },
                { s: "His daughter really ______ that college rejection ______.", a: "took; to heart", explanation: "take...to heart意为'把……放在心上，认真对待'。句意：他的女儿真的把大学拒绝放在心上（很在意）。" },
                { s: "There is not enough money to ______ investigators with the latest computer systems.", a: "equip", explanation: "equip意为'装备，配备'，常与with搭配。句意：没有足够的资金为调查人员配备最新的计算机系统。" },
                { s: "The pilot told us that we might ______ turbulence during the flight.", a: "encounter", explanation: "encounter意为'遇到，遭遇'。句意：飞行员告诉我们，在飞行过程中可能会遇到气流。" },
                { s: "Success in business ultimately ______ good judgment and luck.", a: "rests upon", explanation: "rest upon意为'依赖于，建立在……之上'。句意：商业成功最终依赖于良好的判断力和运气。" }
            ]
        },
        {
            // 第二大题：搭配填空（包含两个子题）
            title: "搭配填空",
            subGroups: [
                {
                    // 子题1：as短语填空
                    title: "as短语填空",
                    category: "as短语填空",
                    wordOptions: ["as far as", "as long as", "as many as", "as much as", "as soon as", "as well as"],
                    items: [
                        { s: "______ 15,000 civilians are thought to have fled the area.", a: "As many as", explanation: "as many as意为'多达'，用于表示数量。句意：据认为，多达15000名平民逃离了该地区。" },
                        { s: "Her parents don't care what job she does ______ she's happy.", a: "as long as", explanation: "as long as意为'只要'，引导条件状语从句。句意：只要她快乐，她的父母不在乎她做什么工作。" },
                        { s: "They sell books to individuals ______ to schools.", a: "as well as", explanation: "as well as意为'也，和'，用于连接并列成分。句意：他们既向个人也向学校出售书籍。" },
                        { s: "The suspect ______ admitted his guilt.", a: "as much as", explanation: "as much as意为'几乎，差不多'，用于强调程度。句意：嫌疑犯几乎承认了他的罪行。" },
                        { s: "Exhausted after a long day's work, I fell asleep ______ I lay down.", a: "as soon as", explanation: "as soon as意为'一……就……'，引导时间状语从句。句意：工作了一整天后筋疲力尽，我一躺下就睡着了。" },
                        { s: "______ I am concerned, everything he says is a lie.", a: "As far as", explanation: "as far as意为'就……而言'，常用结构为as far as...be concerned。句意：就我而言，他说的每句话都是谎言。" }
                    ]
                },
                {
                    // 子题2：case短语填空
                    title: "case短语填空",
                    category: "case短语填空",
                    wordOptions: ["as the case may be", "in any case", "(just) in case", "in case of", "in that case", "a case in point"],
                    items: [
                        { s: "Lack of communication causes serious problems and their marriage is ______.", a: "a case in point", explanation: "a case in point意为'一个恰当的例子，例证'。句意：缺乏沟通会导致严重问题，他们的婚姻就是一个恰当的例子。" },
                        { s: "______ fire, ring the alarm bell.", a: "In case of", explanation: "in case of意为'如果发生，万一'，后接名词。句意：如果发生火灾，请按响警铃。" },
                        { s: "When the announcement is made this evening, or tomorrow morning, ______, we shall issue our firm response immediately.", a: "as the case may be", explanation: "as the case may be意为'视情况而定'。句意：无论公告是今晚还是明早发布，视情况而定，我们都将立即发表坚定的回应。" },
                        { s: "It looks like rain. Please close the window before you leave ______.", a: "(just) in case", explanation: "(just) in case意为'以防万一'，后接从句或单独使用。句意：看起来要下雨了。请在离开前关上窗户，以防万一。" },
                        { s: "Your parents may be tired when they arrive tomorrow. ______, let's go to the new restaurant which is just around the corner.", a: "In that case", explanation: "in that case意为'如果是那样的话，那样的话'。句意：你的父母明天到达时可能会很累。那样的话，我们去附近的新餐厅吧。" },
                        { s: "This project is complex but I'll do my best to meet the deadline ______.", a: "in any case", explanation: "in any case意为'无论如何，不管怎样'。句意：这个项目很复杂，但无论如何我都会尽力按时完成。" }
                    ]
                }
            ]
        }
    ],

    // 兼容旧格式（保留用于向后兼容）
    vocabulary: {
        // 词汇列表
        words: ["confront", "encounter", "equip", "postpone", "reverse", "draw up", "get up", "rest upon", "take…to heart", "tip over"],
        // 填空题
        items: [
            { s: "The policy is likely to be ______ if there is a change of government.", a: "reversed" },
            { s: "I ______ to greet her when she entered the room.", a: "got up" },
            { s: "The little girl knew that she had to ______ her fears.", a: "confront" },
            { s: "The boat ______ and they were all thrown into the sea.", a: "tipped over" },
            { s: "As the car ______, the driver leaned out of the window to ask for directions.", a: "drew up" },
            { s: "The football game was ______ until tomorrow because of rain.", a: "postponed" },
            { s: "His daughter really ______ that college rejection ______.", a: "took; to heart" },
            { s: "There is not enough money to ______ investigators with the latest computer systems.", a: "equip" },
            { s: "The pilot told us that we might ______ turbulence during the flight.", a: "encounter" },
            { s: "Success in business ultimately ______ good judgment and luck.", a: "rests upon" }
        ]
    },

    collocation: {
        // as…as 短语
        asPhrases: ["as far as", "as long as", "as many as", "as much as", "as soon as", "as well as"],
        // case 短语
        casePhrases: ["as the case may be", "in any case", "(just) in case", "in case of", "in that case", "a case in point"],
        // 填空
        asItems: [
            { s: "______ 15,000 civilians are thought to have fled the area.", a: "As many as" },
            { s: "Her parents don't care what job she does ______ she's happy.", a: "as long as" },
            { s: "They sell books to individuals ______ to schools.", a: "as well as" },
            { s: "The suspect ______ admitted his guilt.", a: "as much as" },
            { s: "Exhausted after a long day's work, I fell asleep ______ I lay down.", a: "as soon as" },
            { s: "______ I am concerned, everything he says is a lie.", a: "As far as" }
        ],
        caseItems: [
            { s: "Lack of communication causes serious problems and their marriage is ______.", a: "a case in point" },
            { s: "______ fire, ring the alarm bell.", a: "In case of" },
            { s: "When the announcement is made this evening, or tomorrow morning, ______, we shall issue our firm response immediately.", a: "as the case may be" },
            { s: "It looks like rain. Please close the window before you leave ______.", a: "(just) in case" },
            { s: "Your parents may be tired when they arrive tomorrow. ______, let's go to the new restaurant which is just around the corner.", a: "In that case" },
            { s: "This project is complex but I'll do my best to meet the deadline ______.", a: "in any case" }
        ]
    }
};

// 浏览器全局变量导出（用于HTML直接引用）
if (typeof window !== "undefined") {
    window.unit3 = unit3;
}

// Node 导出（兼容）
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = unit3;
}