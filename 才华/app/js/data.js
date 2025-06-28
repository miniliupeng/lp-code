// 诗词数据
const poemsData = {
    // 触动心弦篇
    "触动心弦": [
        {
            id: "cx_001",
            plainText: "只看了你一眼，我就忘不掉。",
            poemText: "只缘感君一回顾，使我思君朝与暮。",
            author: "李白",
            dynasty: "唐",
            category: "触动心弦",
            tags: ["爱情", "思念"]
        },
        {
            id: "cx_002",
            plainText: "遇到你以后，其他人都成了将就。",
            poemText: "曾经沧海难为水，除却巫山不是云。",
            author: "元稹",
            dynasty: "唐",
            category: "触动心弦",
            tags: ["爱情"]
        },
        {
            id: "cx_003",
            plainText: "美丽贤淑的女人谁不想追求。",
            poemText: "窈窕淑女，寤寐求之。",
            author: "佚名",
            dynasty: "先秦",
            category: "触动心弦",
            tags: ["爱情"]
        },
        {
            id: "cx_004",
            plainText: "想念你，翻来覆去睡不着觉。",
            poemText: "悠哉悠哉，辗转反侧。",
            author: "佚名",
            dynasty: "先秦",
            category: "触动心弦",
            tags: ["思念"]
        },
        {
            id: "cx_005",
            plainText: "和一个姑娘约会，她却故意躲藏， 急得我抓耳挠腮。",
            poemText: "静女其姝，俟我于城隅。爱而不见，搔首踟蹰。",
            author: "佚名",
            dynasty: "先秦",
            category: "触动心弦",
            tags: ["爱情"]
        },
        {
            id: "cx_006",
            plainText: "我可真自作多情啊。",
            poemText: "我本将心向明月，奈何明月照沟渠。",
            author: "李白",
            dynasty: "唐",
            category: "触动心弦",
            tags: ["爱情", "失落"]
        },
        {
            id: "cx_007",
            plainText: "并不是所有的感情都能得到共鸣。",
            poemText: "落花有意随流水，流水无心恋落花。",
            author: "晏殊",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["爱情", "失落"]
        },
        {
            id: "cx_008",
            plainText: "思念你却见不到你，度日如年啊。",
            poemText: "一日不见，如三秋兮。",
            author: "佚名",
            dynasty: "先秦",
            category: "触动心弦",
            tags: ["思念"]
        },
        {
            id: "cx_009",
            plainText: "日夜思念你，却见不到你，只能喝着同一个地方的水。",
            poemText: "日日思君不见君，共饮长江水。",
            author: "李之仪",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["思念"]
        },
        {
            id: "cx_010",
            plainText: "真爱不会输给距离。",
            poemText: "两情若是久长时，又岂在朝朝暮暮。",
            author: "秦观",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["爱情"]
        },
        {
            id: "cx_011",
            plainText: "他的心变得好快，说不爱就不爱了。",
            poemText: "世情薄，人情恶，雨送黄昏花易落。",
            author: "唐婉",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["爱情", "失落"]
        },
        {
            id: "cx_012",
            plainText: "生死相隔，你在那边还好吗?",
            poemText: "十年生死两茫茫，不思量，自难忘。",
            author: "苏轼",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["思念"]
        },
        {
            id: "cx_013",
            plainText: "只要你不说分手，我就永远不和你分手。",
            poemText: "只愿君心似我心，定不负相思意。",
            author: "李之仪",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["爱情"]
        },
        {
            id: "cx_014",
            plainText: "那时候的我们还不懂什么是爱情。",
            poemText: "此情可待成追忆，只是当时已惘然。",
            author: "李商隐",
            dynasty: "唐",
            category: "触动心弦",
            tags: ["爱情", "失落"]
        },
        {
            id: "cx_015",
            plainText: "遇见你，是我今生最大的幸运。",
            poemText: "金风玉露一相逢，便胜却人间无数。",
            author: "秦观",
            dynasty: "宋",
            category: "触动心弦",
            tags: ["爱情"]
        }
    ],
    // 满腹经纶
    "满腹经纶": [
        {
            id: "ml_001",
            plainText: "我想你。",
            poemText: "晓看天色暮看云，行也思君，坐也思君。",
            author: "佚名",
            dynasty: "宋",
            category: "满腹经纶",
            tags: ["思念"]
        },
        {
            id: "ml_002",
            plainText: "一天不见，特别想。",
            poemText: "一日不见兮，思之如狂。",
            author: "佚名",
            dynasty: "先秦",
            category: "满腹经纶",
            tags: ["思念"]
        },
        {
            id: "ml_003",
            plainText: "没良心的，我想你，你想我吗?",
            poemText: "天涯地角有穷时，只有相思无尽处。",
            author: "晏殊",
            dynasty: "宋",
            category: "满腹经纶",
            tags: ["思念"]
        },
        {
            id: "ml_004",
            plainText: "你咋还不来?",
            poemText: "千金纵买相如赋，脉脉此情谁诉。",
            author: "李清照",
            dynasty: "宋",
            category: "满腹经纶",
            tags: ["思念"]
        },
        {
            id: "ml_005",
            plainText: "因为你，我哪儿都不想去。",
            poemText: "取次花丛懒回顾，半缘修道半缘君。",
            author: "苏轼",
            dynasty: "宋",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_006",
            plainText: "咱俩的感情牢固。",
            poemText: "我心匪石，不可转也；我心匪席，不可卷也。",
            author: "佚名",
            dynasty: "先秦",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_007",
            plainText: "我喜欢你，你也喜欢我。",
            poemText: "郎有情，妾有意。",
            author: "佚名",
            dynasty: "唐",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_008",
            plainText: "你先别走，我想再看看你。",
            poemText: "停船暂借问，或恐是同乡。",
            author: "李白",
            dynasty: "唐",
            category: "满腹经纶",
            tags: ["思念"]
        },
        {
            id: "ml_009",
            plainText: "我爱你，永远不会改变。",
            poemText: "山无陵，江水为竭，冬雷震震，夏雨雪，天地合，乃敢与君绝。",
            author: "佚名",
            dynasty: "汉",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_010",
            plainText: "希望我们永远在一起。",
            poemText: "愿我如星君如月，夜夜流光相皎洁。",
            author: "范成大",
            dynasty: "宋",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_011",
            plainText: "我喜欢你，没有道理。",
            poemText: "情不知所起，一往而深。",
            author: "佚名",
            dynasty: "魏晋",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_012",
            plainText: "我喜欢你很久了。",
            poemText: "三年前，咱们在路上见过一面。",
            author: "赵明诚",
            dynasty: "宋",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_013",
            plainText: "终于等到你。",
            poemText: "越过山丘，才发现你已等候多时。",
            author: "现代",
            dynasty: "现代",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_014",
            plainText: "为了你，我什么都愿意做。",
            poemText: "直道相思了无益，未妨惆怅是清狂。",
            author: "李商隐",
            dynasty: "唐",
            category: "满腹经纶",
            tags: ["爱情"]
        },
        {
            id: "ml_015",
            plainText: "我俩心意相通。",
            poemText: "心似双丝网，中有千千结。",
            author: "张籍",
            dynasty: "唐",
            category: "满腹经纶",
            tags: ["爱情"]
        }
    ],
    // 妙语连珠篇（示例数据）
    "妙语连珠": [
        {
            id: "my_001",
            plainText: "聪明的人，往往选择少说话。",
            poemText: "大巧若拙，大辩若讷。",
            author: "老子",
            dynasty: "春秋",
            category: "妙语连珠",
            tags: ["智慧"]
        },
        {
            id: "my_002",
            plainText: "事情往往在最绝望的时候出现转机。",
            poemText: "山重水复疑无路，柳暗花明又一村。",
            author: "陆游",
            dynasty: "宋",
            category: "妙语连珠",
            tags: ["励志"]
        }
    ],
    // 寻常滋味篇（示例数据）
    "寻常滋味": [
        {
            id: "xc_001",
            plainText: "我这里风景独好，你一定要来看看。",
            poemText: "橘生淮南则为橘，生于淮北则为枳。",
            author: "晁错",
            dynasty: "汉",
            category: "寻常滋味",
            tags: ["生活"]
        },
        {
            id: "xc_002",
            plainText: "虽然有点苦，但也别有一番滋味。",
            poemText: "世味年来薄似纱，谁令骑马客京华。",
            author: "杜牧",
            dynasty: "唐",
            category: "寻常滋味",
            tags: ["生活"]
        }
    ],
    // 励志篇（示例数据）
    "励志": [
        {
            id: "lz_001",
            plainText: "要想成功，就要不断努力。",
            poemText: "书山有路勤为径，学海无涯苦作舟。",
            author: "韩愈",
            dynasty: "唐",
            category: "励志",
            tags: ["励志"]
        },
        {
            id: "lz_002",
            plainText: "只有坚持到底，才能成功。",
            poemText: "锲而舍之，朽木不折；锲而不舍，金石可镂。",
            author: "荀子",
            dynasty: "战国",
            category: "励志",
            tags: ["励志"]
        }
    ],
    // 辛勤劳作篇（示例数据）
    "辛勤劳作": [
        {
            id: "xk_001",
            plainText: "春天播种，秋天才能收获。",
            poemText: "谁知盘中餐，粒粒皆辛苦。",
            author: "李绅",
            dynasty: "唐",
            category: "辛勤劳作",
            tags: ["劳动"]
        },
        {
            id: "xk_002",
            plainText: "别偷懒，努力工作才能有收获。",
            poemText: "鸟欲高飞先振翅，人求上进先读书。",
            author: "李苦禅",
            dynasty: "现代",
            category: "辛勤劳作",
            tags: ["励志", "劳动"]
        }
    ]
};

// 所有诗词数据合并
const allPoems = Object.values(poemsData).flat();

// 获取所有标签
const getAllTags = () => {
    const tagsSet = new Set();
    allPoems.forEach(poem => {
        poem.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
};

// 获取所有类别
const getAllCategories = () => {
    return Object.keys(poemsData);
};

// 按类别获取诗词
const getPoemsByCategory = (category) => {
    if (category === 'all') {
        return allPoems;
    }
    return poemsData[category] || [];
};

// 按标签筛选诗词
const getPoemsByTag = (tag, poems = allPoems) => {
    if (tag === 'all') {
        return poems;
    }
    return poems.filter(poem => poem.tags.includes(tag));
};

// 搜索诗词
const searchPoems = (keyword) => {
    if (!keyword) return allPoems;
    
    const lowerKeyword = keyword.toLowerCase();
    return allPoems.filter(poem => 
        poem.plainText.toLowerCase().includes(lowerKeyword) ||
        poem.poemText.toLowerCase().includes(lowerKeyword) ||
        poem.author.toLowerCase().includes(lowerKeyword) ||
        poem.dynasty.toLowerCase().includes(lowerKeyword) ||
        poem.category.toLowerCase().includes(lowerKeyword) ||
        poem.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
};

// 获取随机推荐诗词
const getRandomPoems = (count = 3) => {
    const shuffled = [...allPoems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// 根据ID获取诗词
const getPoemById = (id) => {
    return allPoems.find(poem => poem.id === id);
};

// 语义相关推荐
const getSimilarPoems = (poem, count = 3) => {
    // 这里使用简单的标签匹配作为推荐依据
    // 实际应用中可以使用更复杂的算法
    const similar = allPoems.filter(p => 
        p.id !== poem.id && 
        (p.tags.some(tag => poem.tags.includes(tag)) || 
         p.category === poem.category)
    );
    
    const shuffled = similar.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// 导出所有函数和数据
window.poemManager = {
    allPoems,
    poemsData,
    getAllTags,
    getAllCategories,
    getPoemsByCategory,
    getPoemsByTag,
    searchPoems,
    getRandomPoems,
    getPoemById,
    getSimilarPoems
}; 