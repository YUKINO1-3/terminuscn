(function () {
    var STORAGE_KEY = "terminus-language";
    var language = localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh";
    var cache = {};
    var queues = typeof WeakMap === "function" ? new WeakMap() : null;
    var commands = [
        "pwd", "ls", "cd", "less", "man", "help", "exit", "mv", "rm", "cp",
        "grep", "touch", "mkdir", "sudo", "tellme", "add", "terminus", "IHTFP"
    ];
    var roomNames = {
        Home: "家",
        WesternForest: "西部森林",
        SpellCastingAcademy: "魔法学院",
        PracticeRoom: "练习室",
        Box: "箱子",
        NorthernMeadow: "北部草地",
        EasternMountains: "东部山脉",
        Lessons: "课堂",
        Cave: "洞穴",
        DarkCorridor: "黑暗走廊",
        Staircase: "石阶",
        DankRoom: "潮湿房间",
        SmallHole: "小洞",
        Tunnel: "隧道",
        StoneChamber: "石室",
        Portal: "传送门",
        TownSquare: "城镇广场",
        Marketplace: "集市",
        Library: "图书馆",
        BackRoom: "密室",
        RockyPath: "岩石小径",
        ArtisanShop: "工匠商店",
        Farm: "农场",
        BrokenBridge: "断桥",
        Clearing: "林中空地",
        OminousLookingPath: "阴森小径",
        CaveOfDisgruntledTrolls: "愤怒巨魔洞穴",
        Cage: "笼子",
        Slide: "滑道",
        KernelFiles: "内核文件区",
        MoreKernelFiles: "更多内核文件区",
        Paradise: "天堂",
        MIT: "麻省理工学院",
        StataCenter: "斯塔塔中心",
        AthenaCluster: "雅典娜计算机集群",
        MagicLocker: "魔法储物柜",
        House: "房屋"
    };
    var itemNames = {
        WelcomeLetter: "欢迎信",
        Sign: "告示牌",
        BackSign: "背面告示",
        HurryingStudent: "匆忙的学生",
        Instructions: "说明",
        PracticeDummy1: "练习假人1",
        PracticeDummy2: "练习假人2",
        PracticeDummy3: "练习假人3",
        PracticeDummy4: "练习假人4",
        PracticeDummy5: "练习假人5",
        Pony: "小马",
        OldMan: "老人",
        OldManuscripts: "老旧手稿",
        Professor: "教授",
        Boulder: "巨石",
        Rat: "老鼠",
        RandomCitizen1: "市民1",
        RandomCitizen2: "市民2",
        DistraughtLady: "悲痛的女士",
        Vendor: "商贩",
        Backpack: "背包",
        rmSpell: "删除术卷轴",
        mkdirSpell: "造室术卷轴",
        TotallyRadSpellbook: "超酷魔法书",
        PaperbackRomance: "平装爱情小说",
        HistoryOfTerminus: "Terminus史",
        NostalgiaForHome: "思乡录",
        InconspicuousLever: "不起眼的拉杆",
        Grep: "格雷普",
        PracticeBook: "练习册",
        Librarian: "图书管理员",
        LargeBoulder: "巨大岩石",
        StrangeTrinket: "奇异饰品",
        ClockworkDragon: "发条龙",
        Artisan: "工匠",
        Gear: "齿轮",
        gear1: "齿轮1",
        gear2: "齿轮2",
        gear3: "齿轮3",
        gear4: "齿轮4",
        gear5: "齿轮5",
        EarOfCorn: "玉米穗",
        AnotherEarOfCorn: "另一穗玉米",
        Farmer: "农夫",
        CryingMan: "哭泣的男人",
        ThornyBrambles: "荆棘丛",
        Plank: "木板",
        Certificate: "证书",
        L_txt: "L文本",
        M_txt: "M文本",
        N_txt: "N文本",
        O_txt: "O文本",
        P_txt: "P文本",
        Q_txt: "Q文本",
        R_txt: "R文本",
        S_txt: "S文本",
        T_txt: "T文本",
        U_txt: "U文本",
        V_txt: "V文本",
        W_txt: "W文本",
        X_txt: "X文本",
        Y_txt: "Y文本",
        Z_txt: "Z文本",
        AA_txt: "AA文本",
        BB_txt: "BB文本",
        CC_txt: "CC文本",
        DD_txt: "DD文本",
        EE_txt: "EE文本",
        FF_txt: "FF文本",
        UglyTroll: "丑陋巨魔",
        UglierTroll: "更丑陋的巨魔",
        AbsolutelyHideousTroll: "奇丑无比的巨魔",
        KidnappedChild: "被绑架的孩子",
        Workstation: "工作站",
        AdmissionLetter: "录取通知书",
        WaryEyeOfGradStudent: "研究生警惕的目光",
        HelpfulTA: "热心助教",
        MoreComing: "更多内容即将推出"
    };
    var displayNames = Object.assign({}, roomNames, itemNames);
    var exactTranslations = {
        "You are in the comfort of your own home.": "你正待在舒适的家（Home）中。",
        ["Welcome! If you are new to the game, here are some tips: \n\n" +
            "Look at your surroundings with the command \"ls\". \n" +
            "Move to a new location with the command \"cd LOCATION\" \n" +
            "You can backtrack with the command \"cd ..\". \n" +
            "Interact with things in the world with the command \"less ITEM\" \n\n" +
            "If you forget where you are, type \"pwd\" \n\n" +
            "Go ahead, explore. We hope you enjoy what you find. Do ls as your first command.\n"]:
            "欢迎来到 Terminus！如果你是第一次游玩，请记住以下操作：\n\n" +
            "使用 ls 查看周围环境。\n" +
            "使用 cd LOCATION 前往新地点，其中 LOCATION 要填写地点的英文标识。\n" +
            "使用 cd .. 返回上一个地点。\n" +
            "使用 less ITEM 查看物品或与角色交谈，其中 ITEM 要填写英文标识。\n\n" +
            "如果忘记自己身在何处，请输入 pwd。\n\n" +
            "现在开始探索吧。请先输入 ls。",
        "You enter and travel deep into the forest. Eventually, the path leads to a clearing with a large impressive building. A sign on it reads: Spell Casting Academy: The Elite School of Magic.":
            "你走进西部森林（WesternForest）深处。小路最终通向一片空地，那里矗立着一座宏伟的建筑。门前的告示牌（Sign）写着：“魔法学院（SpellCastingAcademy）：精英魔法学校。”",
        "The halls are filled the hustle and bustle of academy students scurrying to and from classes. The inside of the academy is as impressive as it is on the outside with a high ceiling and gothic arches, it seems even larger on the inside.":
            "魔法学院（SpellCastingAcademy）的走廊里十分热闹，学生们匆忙奔赴各自的课堂。学院内部与外观一样宏伟：高耸的穹顶和哥特式拱门让这里看起来比外面更加宽广。",
        "The room is filled with practice dummies for students to practice their new spells on.":
            "练习室（PracticeRoom）里摆满了练习假人，供学生练习刚学会的命令法术。",
        "This is a beautiful green meadow. A plump but majestic pony prances happily about.":
            "这里是一片美丽的绿色草地。圆滚滚却颇具威严的小马（Pony）正在欢快地踱步。",
        "It's your typical cave: dark and dank.": "这是一座典型的洞穴（Cave）：阴暗而潮湿。",
        "You have been transported through time...": "你穿越了时空……",
        "You are in a sunny and spacious town square. There is a pedestal at the center of the cobblestone turnabout, but no statue on it. The architecture is charming, but everyone here seems nervous for some reason.":
            "你来到阳光明媚、十分宽敞的城镇广场（TownSquare）。鹅卵石环岛中央有一座基座，上面却没有雕像。周围的建筑很迷人，但不知为何，每个人看起来都很紧张。",
        "You have arrived by magic carpet to MIT!": "你乘坐魔毯抵达了麻省理工学院（MIT）！",
        "That is not reachable from here.": "从这里无法到达那里。",
        "That is not a valid object to look at.": "这不是可查看的有效目标。",
        " Locations: \n": " 地点：\n",
        " Items: \n": " 物品与角色：\n",
        "You can't move to multiple locations.": "你不能同时前往多个地点。",
        "You have come Home!": "你回到了家（Home）！",
        "You are at the first room.": "你已经位于最初的地点。",
        "Pick a different item to less.": "请指定要用 less 查看或互动的物品。",
        "Must ask the man about something to receive a response.": "请使用 man COMMAND 查询具体命令。",
        "there is no man page for that command": "没有这个命令的 man 帮助页。",
        "Type 'man' to ask the man for help": "输入 man COMMAND 查看相应命令的帮助。",
        "You must remove a particular item": "请指定要用 rm 删除的物品。",
        "That item cannot be removed": "该物品无法删除。",
        "That's not a valid object to remove.": "这不是可用 rm 删除的有效物品。",
        "Not a valid item to search in.": "这不是可用 grep 搜索的有效物品。",
        "You haven't learned this spell yet.": "你还没有学会这个命令法术。",
        "You must touch something in particular.": "请指定要用 touch 创建的物品名称。",
        "You haven't touched anything. Check your syntax.": "你没有创建任何物品，请检查命令格式。",
        "Incorrect syntax. Ask the OldMan for help.": "命令格式错误，请向老人（OldMan）查询帮助。",
        "No item of that name to copy.": "没有可复制的同名物品。",
        "The combination is 'terminus' (without the quotes).": "组合口令是 terminus（输入时不带引号）。",
        "You have not learned this spell yet": "你还没有学会这个命令法术。",
        "Wrong syntax. Read the instructions again.": "命令格式错误，请重新阅读说明（Instructions）。",
        "You cannot cast this spell here.": "你不能在这里使用这个命令法术。",
        "Wrong password.": "密码错误。",
        "This is not a valid spell.": "这不是有效的命令法术。",
        "No valid locker of that name.": "没有这个名称的有效储物柜。"
    };
    var zhManPages = {
        cd: "老人的声音仿佛从远方传入你的脑海：\n" +
            "（切换地点）使用 cd 在世界中移动。\n" +
            "命令格式：cd LOCATION\n" +
            "LOCATION 必须使用地点的英文标识，例如：cd WesternForest\n" +
            "记住——",
        mv: "老人的声音仿佛从远方传入你的脑海：\n" +
            "（移动）使用 mv 将物品移动到另一个地点。\n" +
            "命令格式：mv ITEM NEWLOCATION\n" +
            "ITEM 和 NEWLOCATION 均须使用英文标识。\n" +
            "记住——",
        ls: "老人的声音仿佛从远方传入你的脑海：\n" +
            "（查看周围）使用 ls 查看当前位置中的地点、物品和角色。\n" +
            "命令格式：ls\n" +
            "部分情况下也可使用：ls LOCATION\n" +
            "记住——",
        less: "老人的声音仿佛从远方传入你的脑海：\n" +
            "（查看、检查或交谈）使用 less 与物品或角色互动。\n" +
            "命令格式：less ITEM\n" +
            "ITEM 须使用英文标识，例如：less WelcomeLetter\n" +
            "记住——",
        man: "我是那个老人！别想再用 man 查询我。可查询的命令有：cd、ls、rm、mv、exit、help、man、touch、grep、pwd。",
        help: "如果忘记命令用法，请输入 man COMMAND。",
        exit: "老人的声音仿佛从远方传入你的脑海：\n" +
            "使用 exit 永久退出游戏。\n" +
            "命令格式：exit\n" +
            "记住——",
        cp: "老人的声音仿佛从远方传入你的脑海：\n" +
            "（复制）使用 cp 复制一个物品。\n" +
            "命令格式：cp ITEM NEWNAME\n" +
            "记住——",
        pwd: "老人的声音仿佛从远方传入你的脑海：\n" +
            "（显示当前位置）使用 pwd 确认自己当前所在的地点。\n" +
            "命令格式：pwd\n" +
            "记住——",
        grep: "老人的声音仿佛从远方传入你的脑海：\n" +
            "使用 grep 在文本物品中搜索指定词语。\n" +
            "命令格式：grep WORD ITEM\n" +
            "记住——",
        touch: "老人的声音仿佛从远方传入你的脑海：\n" +
            "使用 touch 在世界中创建新物品。\n" +
            "命令格式：touch OBJECT\n" +
            "记住——",
        tellme: "老人的声音仿佛从远方传入你的脑海：\n" +
            "tellme combo 会告诉你麻省理工学院（MIT）的雅典娜计算机集群（AthenaCluster）组合口令。\n" +
            "命令格式：tellme combo\n" +
            "记住——"
    };

    try {
        cache = JSON.parse(localStorage.getItem("terminus-zh-cache-v4") || "{}");
    } catch (error) {
        cache = {};
    }

    function protectTechnicalTerms(text) {
        var protectedValues = [];
        var objectNames = [];

        function collectNames(room, visited) {
            if (!room || visited.indexOf(room) !== -1) {
                return;
            }
            visited.push(room);
            if (room.room_name) {
                objectNames.push(room.room_name);
            }
            (room.items || []).forEach(function (item) {
                if (item && item.itemname) {
                    objectNames.push(item.itemname);
                }
            });
            (room.children || []).forEach(function (child) {
                collectNames(child, visited);
            });
            (room.parents || []).forEach(function (parent) {
                collectNames(parent, visited);
            });
        }

        collectNames(window.current_room, []);
        collectNames(window.Home, []);

        objectNames = objectNames.concat(Object.keys(displayNames));
        var escapedNames = objectNames
            .filter(function (name, index, values) {
                return name && values.indexOf(name) === index;
            })
            .sort(function (a, b) { return b.length - a.length; })
            .map(function (name) {
                return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            });
        var pattern = new RegExp(
            "\\b(?:" + commands.concat(escapedNames).join("|") +
            ")\\b|\\b[A-Z][A-Za-z0-9]*[A-Z][A-Za-z0-9]*\\b|\\.\\.|~",
            "g"
        );
        var protectedText = text.replace(pattern, function (value) {
            var token = "XQZ" + protectedValues.length + "ZXQ";
            protectedValues.push(value);
            return token;
        });
        return { text: protectedText, values: protectedValues };
    }

    function restoreTechnicalTerms(text, values) {
        return text.replace(/XQZ(\d+)ZXQ/g, function (_, index) {
            var value = values[Number(index)];
            if (language === "zh" && displayNames[value]) {
                return displayNames[value] + "（" + value + "）";
            }
            return value || _;
        });
    }

    function saveCache() {
        try {
            localStorage.setItem("terminus-zh-cache-v4", JSON.stringify(cache));
        } catch (error) {
            // Translation still works if browser storage is full or unavailable.
        }
    }

    function localizedName(name) {
        return displayNames[name] ? displayNames[name] + "（" + name + "）" : name;
    }

    function localizedList(list) {
        return list
            .split("\n")
            .filter(function (name) { return name.trim() !== ""; })
            .map(function (name) { return localizedName(name.trim()); })
            .join("\n");
    }

    async function translate(text) {
        if (language !== "zh" || !text) {
            return text;
        }
        if (exactTranslations[text]) {
            return exactTranslations[text];
        }
        var pwdMatch = text.match(/^You are in ([A-Za-z0-9_]+)\.$/);
        if (pwdMatch) {
            return "你当前位于" + localizedName(pwdMatch[1]) + "。";
        }
        var movedMatch = text.match(/^You have moved to ([A-Za-z0-9_]+)\. ([\s\S]*)$/);
        if (movedMatch) {
            return "你来到了" + localizedName(movedMatch[1]) + "。" +
                await translate(movedMatch[2]);
        }
        var lsMatch = text.match(/^\s*Locations:\s*\n([\s\S]*?)(?:\n Items:\s*\n([\s\S]*))?$/);
        if (lsMatch) {
            var result = "地点：\n" + localizedList(lsMatch[1]);
            if (typeof lsMatch[2] !== "undefined") {
                result += "\n物品与角色：\n" + localizedList(lsMatch[2]);
            }
            return result;
        }
        var missingRoomMatch = text.match(/^There is no room called ([A-Za-z0-9_]+)\.$/);
        if (missingRoomMatch) {
            return "这里没有名为" + localizedName(missingRoomMatch[1]) + "的地点。";
        }
        var missingItemMatch = text.match(/^There is no ([A-Za-z0-9_]+) here\.$/);
        if (missingItemMatch) {
            return "这里没有" + localizedName(missingItemMatch[1]) + "。";
        }
        var commandMatch = text.match(/^Command '([^']+)' not found in room '([^']+)'$/);
        if (commandMatch) {
            return "地点" + localizedName(commandMatch[2]) + "中没有命令 '" +
                commandMatch[1] + "'。";
        }
        if (/^[>./~\w-]+$/.test(text)) {
            return text;
        }
        if (cache[text]) {
            return cache[text];
        }

        var prepared = protectTechnicalTerms(String(text));
        var endpoint = "https://translate.googleapis.com/translate_a/single" +
            "?client=gtx&sl=en&tl=zh-CN&dt=t&q=" + encodeURIComponent(prepared.text);

        try {
            var response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error("Translation request failed");
            }
            var payload = await response.json();
            var translated = payload[0].map(function (part) {
                return part[0];
            }).join("");
            translated = restoreTechnicalTerms(translated, prepared.values);
            cache[text] = translated;
            saveCache();
            return translated;
        } catch (error) {
            return text;
        }
    }

    function echo(term, text, options) {
        if (language !== "zh") {
            term.echo(text, options);
            return;
        }

        var previous = queues && queues.get(term);
        var next = (previous || Promise.resolve())
            .then(function () { return translate(text); })
            .then(function (translated) { term.echo(translated, options); });
        if (queues) {
            queues.set(term, next.catch(function () {}));
        }
    }

    window.TerminusI18n = {
        language: language,
        echo: echo,
        translate: translate,
        manPages: zhManPages,
        greetings: language === "zh"
            ? "欢迎来到 Terminus！如果你是第一次游玩，请先了解以下操作：\n\n" +
              "使用命令 \"ls\" 查看周围环境。\n" +
              "使用命令 \"cd LOCATION\" 前往新地点。\n" +
              "使用命令 \"cd ..\" 返回上一个地点。\n" +
              "使用命令 \"less ITEM\" 与场景中的物品或人物互动。\n\n" +
              "如果忘记自己身在何处，请输入 \"pwd\"。\n\n" +
              "现在开始探索吧。请先输入你的第一条命令：ls\n"
            : "Welcome! If you are new to the game, here are some tips: \n\n" +
              "Look at your surroundings with the command \"ls\". \n" +
              "Move to a new location with the command \"cd LOCATION\" \n" +
              "You can backtrack with the command \"cd ..\". \n" +
              "Interact with things in the world with the command \"less ITEM\" \n\n" +
              "If you forget where you are, type \"pwd\" \n\n" +
              "Go ahead, explore. We hope you enjoy what you find. Do ls as your first command.\n"
    };
})();
