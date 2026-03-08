import type { TranslatedWork } from "@/types";

export const works: TranslatedWork[] = [
  // ============ POETRY ============
  {
    id: "poem-001",
    title: "Тишина рассвета",
    content: "Когда мир ещё спит в объятьях ночи,\nИ звёзды гаснут тихо, одна за одной,\nРождается строка — нежнее, чем прочие,\nКак первый луч рассвета золотой.\n\nВ той тишине я слышу голос вечности,\nОн шепчет мне о том, что всё пройдёт,\nНо красота останется в сердечности,\nИ слово — словно птица — запоёт.\n\nИ я пишу — не ради славы тленной,\nА чтобы в мире стало чуть светлей,\nЧтоб каждый, кто устал от жизни бренной,\nНашёл покой среди моих строчек и идей.",
    excerpt: "Когда мир ещё спит в объятьях ночи, и звёзды гаснут тихо, одна за одной...",
    category: "poetry", tags: ["рассвет", "тишина", "природа", "вдохновение"],
    createdAt: "2026-01-15T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 342, likes: 89,
    translations: {
      en: { title: "The Silence of Dawn", content: "When the world still sleeps in the embrace of night,\nAnd stars fade quietly, one by one,\nA line is born — more tender than the light,\nLike the first golden ray of morning sun.\n\nIn that silence I hear eternity's voice,\nIt whispers that all things shall pass away,\nBut beauty remains in the heart's own choice,\nAnd words — like birds — begin to play.", excerpt: "When the world still sleeps in the embrace of night..." },
      de: { title: "Die Stille der Morgendämmerung", content: "Wenn die Welt noch schläft in der Umarmung der Nacht,\nUnd Sterne leise verlöschen, einer nach dem anderen,\nEntsteht eine Zeile — zarter als gedacht,\nWie der erste goldene Strahl des Morgens.", excerpt: "Wenn die Welt noch schläft..." },
      fr: { title: "Le Silence de l'Aube", content: "Quand le monde dort encore dans les bras de la nuit,\nEt que les étoiles s'éteignent doucement, une à une,\nUne ligne naît — plus tendre que la lumière qui luit,\nComme le premier rayon doré de la lune.", excerpt: "Quand le monde dort encore..." },
      zh: { title: "黎明的寂静", content: "当世界仍在夜的怀抱中沉睡，\n星星一颗接一颗地静静熄灭，\n一行诗句诞生——比其他都温柔，\n如同黎明的第一缕金色光芒。", excerpt: "当世界仍在夜的怀抱中沉睡..." },
      ko: { title: "새벽의 고요", content: "세상이 아직 밤의 품에서 잠들어 있을 때,\n별들이 하나둘 조용히 꺼져갈 때,\n시구가 태어난다 — 다른 어떤 것보다 부드럽게,\n새벽의 첫 황금빛 광선처럼.", excerpt: "세상이 아직 밤의 품에서..." },
    },
  },
  {
    id: "poem-002",
    title: "Осенние строки",
    content: "Листья падают — как слова,\nЧто не сказаны вовремя.\nВетер пишет на земле\nПисьма будущей весне.\n\nЗолотая тишина\nРасстилается повсюду,\nКаждый лист — как строчка та,\nЧто хранить я вечно буду.\n\nВ этом танце увяданья\nЕсть особая краса —\nМудрость тихого прощанья,\nЧто даёт земля и небеса.",
    excerpt: "Листья падают — как слова, что не сказаны вовремя...",
    category: "poetry", tags: ["осень", "природа", "мудрость"],
    createdAt: "2026-02-03T10:30:00Z", updatedAt: "2026-02-03T10:30:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 278, likes: 67,
    translations: {
      en: { title: "Autumn Lines", content: "Leaves fall — like words\nThat were never said in time.\nThe wind writes on the earth\nLetters to the coming spring.\n\nGolden silence\nSpreads everywhere,\nEach leaf — like a line\nI will keep forever.", excerpt: "Leaves fall — like words that were never said in time..." },
      de: { title: "Herbstzeilen", content: "Blätter fallen — wie Worte,\nDie nicht rechtzeitig gesagt wurden.", excerpt: "Blätter fallen — wie Worte..." },
      fr: { title: "Lignes d'automne", content: "Les feuilles tombent — comme des mots\nQui n'ont pas été dits à temps.", excerpt: "Les feuilles tombent..." },
      zh: { title: "秋日诗行", content: "落叶——如同未曾及时说出的话语。\n风在大地上书写\n给未来春天的信。", excerpt: "落叶——如同未曾及时说出的话语..." },
      ko: { title: "가을의 시구", content: "낙엽이 진다 — 마치 제때 하지 못한 말처럼.\n바람이 땅 위에 쓴다\n다가올 봄에게 보내는 편지를.", excerpt: "낙엽이 진다 — 마치..." },
    },
  },
  {
    id: "poem-003",
    title: "Колыбельная для звёзд",
    content: "Спите, звёзды, спите тихо,\nНочь укроет вас собой,\nПусть луна споёт вам лихо\nПесню нежности ночной.\n\nВы мерцаете устало,\nДень был долог и тяжёл,\nНо рассвет придёт сначала,\nИ разбудит вас, как пчёл.\n\nА пока — плывите в небе,\nКак слова в моей строке,\nКаждый лучик — словно жребий\nНа серебряной реке.",
    excerpt: "Спите, звёзды, спите тихо, ночь укроет вас собой...",
    category: "poetry", tags: ["звёзды", "ночь", "космос", "нежность"],
    createdAt: "2026-02-14T22:00:00Z", updatedAt: "2026-02-14T22:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 415, likes: 112,
    translations: {
      en: { title: "Lullaby for the Stars", content: "Sleep, dear stars, sleep so still,\nNight will cover you with care,\nLet the moon sing with a thrill\nA tender song upon the air.\n\nYou twinkle with a weary glow,\nThe day was long and hard to bear,\nBut dawn will come, and you will know\nIts warmth that fills the morning air.", excerpt: "Sleep, dear stars, sleep so still..." },
      de: { title: "Schlaflied für die Sterne", content: "Schlaft, ihr Sterne, schlaft ganz leise,\nDie Nacht wird euch bedecken...", excerpt: "Schlaft, ihr Sterne..." },
      fr: { title: "Berceuse pour les étoiles", content: "Dormez, étoiles, dormez doucement,\nLa nuit vous couvrira tendrement...", excerpt: "Dormez, étoiles..." },
      zh: { title: "星星的摇篮曲", content: "安睡吧，星星们，静静地安睡，\n夜会用自己将你们覆盖...", excerpt: "安睡吧，星星们..." },
      ko: { title: "별들을 위한 자장가", content: "잠들어라, 별들아, 조용히 잠들어라,\n밤이 너희를 감싸줄 거야...", excerpt: "잠들어라, 별들아..." },
    },
  },
  {
    id: "poem-004",
    title: "Танец дождя",
    content: "Дождь танцует на стекле,\nКаждой каплей — нота в песне,\nМир становится светлей,\nКогда небо плачет вместе.\n\nКапли — ноты на стекле,\nМузыка без партитуры,\nМир танцует в полумгле,\nИ рисует акварели бурый\nЦвет земли, зелёный — трав,\nГолубой — небесной дали,\nДождь — художник, он устав,\nДарит миру без печали.",
    excerpt: "Дождь танцует на стекле, каждой каплей — нота в песне...",
    category: "poetry", tags: ["дождь", "танец", "весна", "музыка"],
    createdAt: "2026-03-01T14:00:00Z", updatedAt: "2026-03-01T14:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 156, likes: 43,
    translations: {
      en: { title: "Dance of the Rain", content: "The rain is dancing on the glass,\nEach drop — a note within a song,\nThe world grows brighter as they pass,\nWhen heaven weeps, we sing along.", excerpt: "The rain is dancing on the glass..." },
      de: { title: "Tanz des Regens", content: "Der Regen tanzt auf dem Glas,\nJeder Tropfen — eine Note im Lied...", excerpt: "Der Regen tanzt..." },
      fr: { title: "La Danse de la Pluie", content: "La pluie danse sur la vitre,\nChaque goutte — une note dans la chanson...", excerpt: "La pluie danse sur la vitre..." },
      zh: { title: "雨之舞", content: "雨在玻璃上跳舞，\n每一滴——歌曲中的一个音符...", excerpt: "雨在玻璃上跳舞..." },
      ko: { title: "비의 춤", content: "비가 유리 위에서 춤춘다,\n한 방울마다 — 노래 속의 한 음표...", excerpt: "비가 유리 위에서 춤춘다..." },
    },
  },
  {
    id: "poem-005",
    title: "Зимний сонет",
    content: "Снежинки кружат в вальсе ледяном,\nЛожатся на ладони, как мечты,\nЗима рисует серебром и сном\nСвои нерукотворные холсты.\n\nМолчит земля под белым покрывалом,\nИ дремлет лес в хрустальной тишине,\nА я стою с раскрытым одеялом\nДуши — навстречу вечности и мне.\n\nЕсть в зимнем дне такая красота,\nЧто сердце замирает на мгновенье,\nИ кажется — вот-вот начнётся та\nПора чудес, надежды, обновленья.",
    excerpt: "Снежинки кружат в вальсе ледяном, ложатся на ладони, как мечты...",
    category: "poetry", tags: ["зима", "снег", "тишина", "красота"],
    createdAt: "2026-01-28T16:00:00Z", updatedAt: "2026-01-28T16:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 289, likes: 78,
    translations: {
      en: { title: "Winter Sonnet", content: "Snowflakes are waltzing in their icy dance,\nThey land on palms like dreams upon the snow,\nWinter paints with silver in a trance\nIts canvases that only nature knows.", excerpt: "Snowflakes are waltzing in their icy dance..." },
      de: { title: "Winter-Sonett", content: "Schneeflocken tanzen Walzer im eisigen Reigen...", excerpt: "Schneeflocken tanzen..." },
      fr: { title: "Sonnet d'hiver", content: "Les flocons valsent dans une danse glacée...", excerpt: "Les flocons valsent..." },
      zh: { title: "冬日十四行", content: "雪花在冰冷的华尔兹中旋转...", excerpt: "雪花在冰冷的华尔兹中旋转..." },
      ko: { title: "겨울 소네트", content: "눈송이가 얼음의 왈츠를 추며...", excerpt: "눈송이가 얼음의 왈츠를..." },
    },
  },
  {
    id: "poem-006",
    title: "Мосты",
    content: "Между мною и тобой — слова,\nКак мосты через молчанья реку.\nКаждый слог — опора, не трава,\nКаждый звук — дарован человеку.\n\nМы возводим их неспешно, тихо,\nСлово к слову — камень к камню в ряд,\nИ мосты стоят надёжно, лихо\nДаже если бури дни летят.\n\nМежду мною и тобой — стихи.\nОни крепче стали и бетона.\nВ них — ни капли фальши, ни тоски,\nТолько свет из сердца, из бездонного.",
    excerpt: "Между мною и тобой — слова, как мосты через молчанья реку...",
    category: "poetry", tags: ["любовь", "слова", "мосты", "связь"],
    createdAt: "2026-02-20T11:00:00Z", updatedAt: "2026-02-20T11:00:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 367, likes: 95,
    translations: {
      en: { title: "Bridges", content: "Between you and me — are words,\nLike bridges across a river of silence.\nEach syllable — a pillar, firm,\nEach sound — a gift to human science.\n\nWe build them slowly, without haste,\nWord upon word — like stone on stone,\nAnd bridges stand through storm and waste,\nEven when the winds have blown.", excerpt: "Between you and me — are words, like bridges across a river of silence..." },
      de: { title: "Brücken", content: "Zwischen mir und dir — sind Worte,\nWie Brücken über einen Fluss des Schweigens...", excerpt: "Zwischen mir und dir — sind Worte..." },
      fr: { title: "Les Ponts", content: "Entre toi et moi — des mots,\nComme des ponts sur une rivière de silence...", excerpt: "Entre toi et moi — des mots..." },
      zh: { title: "桥", content: "你和我之间——是话语，\n如同跨越沉默之河的桥梁...", excerpt: "你和我之间——是话语..." },
      ko: { title: "다리", content: "너와 나 사이에 — 말이 있다,\n침묵의 강을 건너는 다리처럼...", excerpt: "너와 나 사이에 — 말이 있다..." },
    },
  },
  {
    id: "poem-007",
    title: "Чашка утреннего кофе",
    content: "В чашке кофе — целый мир:\nАромат далёких стран,\nГорький привкус, сладкий мир,\nВсё — как маленький роман.\n\nПервый глоток — пробуждение,\nВторой — уже мечта,\nТретий — тихое прозрение,\nЧто жизнь — она проста.\n\nИ пока дымок струится\nНад фарфоровым теплом,\nСердце учится молиться\nЗа обычный добрый дом.",
    excerpt: "В чашке кофе — целый мир: аромат далёких стран...",
    category: "poetry", tags: ["утро", "кофе", "простота", "жизнь"],
    createdAt: "2026-03-05T07:30:00Z", updatedAt: "2026-03-05T07:30:00Z",
    isPublished: true, language: "ru", readingTime: 2, views: 198, likes: 54,
    translations: {
      en: { title: "A Cup of Morning Coffee", content: "In a coffee cup — an entire world:\nThe aroma of faraway lands,\nA bitter taste, a gentle world unfurled,\nAll — like a novel in your hands.\n\nFirst sip — awakening,\nSecond — already a dream,\nThird — a quiet reckoning\nThat life is simpler than it seems.", excerpt: "In a coffee cup — an entire world..." },
      de: { title: "Eine Tasse Morgenkaffee", content: "In einer Tasse Kaffee — eine ganze Welt...", excerpt: "In einer Tasse Kaffee..." },
      fr: { title: "Une Tasse de Café du Matin", content: "Dans une tasse de café — un monde entier...", excerpt: "Dans une tasse de café..." },
      zh: { title: "一杯晨间咖啡", content: "咖啡杯中——一个完整的世界...", excerpt: "咖啡杯中——一个完整的世界..." },
      ko: { title: "아침 커피 한 잔", content: "커피 한 잔에 — 온 세상이 담겨있다...", excerpt: "커피 한 잔에 — 온 세상이..." },
    },
  },
  {
    id: "poem-008",
    title: "Горизонт",
    content: "Там, где небо обнимает землю,\nГде граница — только миф,\nЯ стою и тихо внемлю\nГолосу, что вечен, жив.\n\nГоризонт — не край, а обещанье,\nЧто за ним — ещё один рассвет,\nЧто за каждым тихим расставаньем\nЕсть начало — и ответ.",
    excerpt: "Там, где небо обнимает землю, где граница — только миф...",
    category: "poetry", tags: ["горизонт", "надежда", "вечность"],
    createdAt: "2026-03-08T09:00:00Z", updatedAt: "2026-03-08T09:00:00Z",
    isPublished: true, language: "ru", readingTime: 1, views: 134, likes: 38,
    translations: {
      en: { title: "The Horizon", content: "Where the sky embraces the earth,\nWhere borders are only myth,\nI stand and quietly hear the birth\nOf a voice eternal, full of pith.\n\nThe horizon — not an edge, but a vow\nThat beyond it — another dawn awaits,\nThat after every quiet farewell bow\nThere is a new beginning at the gates.", excerpt: "Where the sky embraces the earth..." },
      de: { title: "Der Horizont", content: "Dort, wo der Himmel die Erde umarmt...", excerpt: "Dort, wo der Himmel..." },
      fr: { title: "L'Horizon", content: "Là où le ciel embrasse la terre...", excerpt: "Là où le ciel embrasse la terre..." },
      zh: { title: "地平线", content: "在天空拥抱大地的地方...", excerpt: "在天空拥抱大地的地方..." },
      ko: { title: "수평선", content: "하늘이 땅을 안는 곳에서...", excerpt: "하늘이 땅을 안는 곳에서..." },
    },
  },

  // ============ PROSE ============
  {
    id: "prose-001",
    title: "Дорога к себе",
    content: "Есть пути, которые ведут через весь мир, и есть дорога, которая начинается в тишине собственного сердца.\n\nОна проснулась тем утром с ощущением, что что-то изменилось. Не снаружи — город был тем же, солнце светило как обычно, кофе пах так же, как вчера. Изменилось что-то внутри, словно невидимая стрелка компаса наконец-то нашла свой север.\n\n«Сколько лет я искала себя в чужих историях, — подумала она, глядя в окно. — Сколько лет читала чужие карты, надеясь найти свой путь.»\n\nОна открыла тетрадь. Страницы были пусты — белые, как снег, как чистый лист обещаний. И она написала первое слово. Потом второе. Потом целое предложение.\n\n«Дорога к себе — это не путешествие куда-то. Это возвращение.»\n\nПальцы дрожали, но строки ложились ровно. Как будто кто-то диктовал ей изнутри — тот голос, который она так долго заглушала шумом мира.\n\nОна закрыла тетрадь, улыбнулась солнцу и пошла дальше. Не в мир. К себе.",
    excerpt: "Есть пути, которые ведут через весь мир, и есть дорога, которая начинается в тишине собственного сердца...",
    category: "prose", tags: ["самопознание", "путь", "мудрость", "тишина"],
    createdAt: "2026-01-20T12:00:00Z", updatedAt: "2026-01-20T12:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 523, likes: 147,
    translations: {
      en: { title: "The Road to Yourself", content: "There are paths that lead across the entire world, and there is a road that begins in the silence of your own heart.\n\nShe woke that morning with the feeling that something had changed. Not outside — the city was the same, the sun shone as usual, the coffee smelled just as it did yesterday. Something changed inside, as if an invisible compass needle had finally found its north.\n\n'How many years I searched for myself in other people\'s stories,' she thought, looking out the window. 'How many years I read other people\'s maps, hoping to find my own path.'\n\nShe opened her notebook. The pages were empty — white as snow, like a clean sheet of promises. And she wrote the first word. Then the second. Then an entire sentence.\n\n'The road to yourself is not a journey to somewhere. It is a return.'", excerpt: "There are paths that lead across the entire world..." },
      de: { title: "Der Weg zu sich selbst", content: "Es gibt Wege, die durch die ganze Welt führen, und es gibt einen Weg, der in der Stille des eigenen Herzens beginnt.", excerpt: "Es gibt Wege, die durch die ganze Welt führen..." },
      fr: { title: "Le Chemin vers soi", content: "Il y a des chemins qui traversent le monde entier, et il y a un chemin qui commence dans le silence de son propre cœur.", excerpt: "Il y a des chemins qui traversent le monde entier..." },
      zh: { title: "通往自我的路", content: "有些路穿越整个世界，还有一条路从自己内心的寂静开始。", excerpt: "有些路穿越整个世界..." },
      ko: { title: "자신에게로 가는 길", content: "온 세상을 가로지르는 길이 있고, 자신의 마음의 고요 속에서 시작되는 길이 있다.", excerpt: "온 세상을 가로지르는 길이 있고..." },
    },
  },
  {
    id: "prose-002",
    title: "Письмо из будущего",
    content: "Дорогая я из прошлого,\n\nЯ пишу тебе из будущего — не далёкого, но достаточно далёкого, чтобы увидеть то, что ты пока не можешь.\n\nПерестань торопиться. Ты уже здесь.\n\nВсе те вещи, которые не дают тебе спать по ночам — они разрешатся. Не так, как ты ожидаешь, но именно так, как нужно. Жизнь мудрее наших планов.\n\nТы спрашиваешь, стоит ли это всё того? Да. Тысячу раз да. Каждая слеза, каждый страх, каждый момент сомнения — всё это кирпичики моста, по которому ты однажды перейдёшь к своей настоящей жизни.\n\nНе бойся ошибок. Они — лучшие учителя. Не бойся тишины. В ней рождаются лучшие идеи. Не бойся одиночества. Оно научит тебя самому важному — быть с собой.\n\nС любовью из твоего будущего,\nТы.\n\nP.S. Та тетрадь, которую ты хочешь выбросить — не выбрасывай. В ней — начало всего.",
    excerpt: "Дорогая я из прошлого, я пишу тебе из будущего — не далёкого, но достаточно далёкого...",
    category: "prose", tags: ["письмо", "будущее", "надежда", "мудрость"],
    createdAt: "2026-02-10T18:00:00Z", updatedAt: "2026-02-10T18:00:00Z",
    isPublished: true, language: "ru", readingTime: 4, views: 687, likes: 203,
    translations: {
      en: { title: "A Letter from the Future", content: "Dear me from the past,\n\nI am writing from the future — not a distant one, but far enough to see what you cannot yet.\n\nStop rushing. You are already here.\n\nAll those things that keep you awake at night — they will resolve. Not as you expect, but exactly as they should. Life is wiser than our plans.\n\nYou ask if it's all worth it? Yes. A thousand times yes.\n\nWith love from your future,\nYou.\n\nP.S. That notebook you want to throw away — don't. It holds the beginning of everything.", excerpt: "Dear me from the past..." },
      de: { title: "Ein Brief aus der Zukunft", content: "Liebes Ich aus der Vergangenheit,\n\nIch schreibe dir aus der Zukunft...", excerpt: "Liebes Ich aus der Vergangenheit..." },
      fr: { title: "Une lettre du futur", content: "Chère moi du passé,\n\nJe t'écris du futur...", excerpt: "Chère moi du passé..." },
      zh: { title: "来自未来的信", content: "亲爱的过去的我，\n\n我从未来写信给你...", excerpt: "亲爱的过去的我..." },
      ko: { title: "미래에서 온 편지", content: "과거의 나에게,\n\n미래에서 편지를 쓴다...", excerpt: "과거의 나에게..." },
    },
  },
  {
    id: "prose-003",
    title: "Хранительница слов",
    content: "В маленьком городе на берегу моря жила женщина, которую все называли Хранительницей Слов.\n\nЕё дом был полон книг — они стояли на полках, лежали стопками на полу, заполняли подоконники и даже ванную комнату. Но самые важные слова хранились не в книгах.\n\nОни жили в маленькой деревянной шкатулке на её столе.\n\nКаждый вечер она открывала шкатулку и записывала одно слово — самое важное слово дня. Иногда это было «надежда». Иногда — «тишина». Иногда — просто чьё-то имя.\n\n«Слова — как семена, — говорила она соседским детям, которые приходили слушать её истории. — Ты бросаешь их в мир, и они прорастают. Иногда — цветами, иногда — деревьями. Но всегда — чем-то живым.»\n\nОднажды маленькая девочка спросила: «А что будет, если слова закончатся?»\n\nХранительница улыбнулась: «Слова никогда не заканчиваются, милая. Заканчивается только наша готовность их слышать.»\n\nВ ту ночь она написала в своей шкатулке: «Бесконечность».",
    excerpt: "В маленьком городе на берегу моря жила женщина, которую все называли Хранительницей Слов...",
    category: "prose", tags: ["слова", "мудрость", "сказка", "море"],
    createdAt: "2026-02-25T15:00:00Z", updatedAt: "2026-02-25T15:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 445, likes: 178,
    translations: {
      en: { title: "The Keeper of Words", content: "In a small town by the sea lived a woman everyone called the Keeper of Words.\n\nHer home was full of books — they stood on shelves, lay in stacks on the floor, filled windowsills and even the bathroom. But the most important words weren't kept in books.\n\nThey lived in a small wooden box on her desk.\n\nEvery evening she opened the box and wrote one word — the most important word of the day.\n\n'Words are like seeds,' she told the neighbor children. 'You throw them into the world, and they sprout.'\n\nOne day a little girl asked: 'What if the words run out?'\n\nThe Keeper smiled: 'Words never run out, dear. Only our willingness to hear them does.'", excerpt: "In a small town by the sea lived a woman everyone called the Keeper of Words..." },
      de: { title: "Die Hüterin der Worte", content: "In einer kleinen Stadt am Meer lebte eine Frau, die alle die Hüterin der Worte nannten...", excerpt: "In einer kleinen Stadt am Meer..." },
      fr: { title: "La Gardienne des Mots", content: "Dans une petite ville au bord de la mer vivait une femme que tous appelaient la Gardienne des Mots...", excerpt: "Dans une petite ville au bord de la mer..." },
      zh: { title: "文字守护者", content: "在海边的一个小镇上，住着一个人人称为文字守护者的女人...", excerpt: "在海边的一个小镇上..." },
      ko: { title: "말의 수호자", content: "바닷가의 작은 마을에 모두가 말의 수호자라고 부르는 여인이 살았다...", excerpt: "바닷가의 작은 마을에..." },
    },
  },
  {
    id: "prose-004",
    title: "Окно в четвёртом этаже",
    content: "Каждый вечер в окне четвёртого этажа загорался свет.\n\nНе обычный электрический свет, а мягкий, золотистый — как будто кто-то зажигал десятки свечей. Прохожие иногда останавливались, поднимали головы и улыбались, сами не зная почему.\n\nВ той квартире жил старый поэт. Его имя давно забыли, его книги пылились на полках букинистических магазинов, его стихи не публиковали уже двадцать лет.\n\nНо каждый вечер он садился у окна, брал перо (да, настоящее перо, он не признавал шариковых ручек) и писал.\n\nОн писал не для читателей — их у него больше не было.\nОн писал не для славы — она давно прошла.\nОн писал, потому что слова просили быть записанными.\n\n«Творчество — это не профессия, — говорил он кошке, которая всегда сидела рядом на подоконнике. — Это способ дышать.»\n\nИ кошка, кажется, понимала. Она мурлыкала в такт его строчкам, и свет в окне горел ещё теплее.",
    excerpt: "Каждый вечер в окне четвёртого этажа загорался свет — не обычный электрический...",
    category: "prose", tags: ["поэт", "творчество", "одиночество", "свет"],
    createdAt: "2026-03-03T20:00:00Z", updatedAt: "2026-03-03T20:00:00Z",
    isPublished: true, language: "ru", readingTime: 5, views: 312, likes: 134,
    translations: {
      en: { title: "The Window on the Fourth Floor", content: "Every evening, a light came on in the window of the fourth floor.\n\nNot an ordinary electric light, but a soft, golden one — as if someone were lighting dozens of candles. Passersby sometimes stopped, looked up, and smiled, not knowing why.\n\nIn that apartment lived an old poet. His name had long been forgotten, his books gathered dust in secondhand shops, his poems hadn't been published in twenty years.\n\nBut every evening he sat by the window, took his pen (yes, a real pen — he didn't believe in ballpoint pens) and wrote.\n\nHe wrote not for readers — he had none.\nHe wrote not for fame — it had long passed.\nHe wrote because the words asked to be written.\n\n'Creativity is not a profession,' he told the cat. 'It is a way of breathing.'", excerpt: "Every evening, a light came on in the window of the fourth floor..." },
      de: { title: "Das Fenster im vierten Stock", content: "Jeden Abend ging im Fenster des vierten Stocks ein Licht an...", excerpt: "Jeden Abend ging im Fenster..." },
      fr: { title: "La Fenêtre du quatrième étage", content: "Chaque soir, une lumière s'allumait à la fenêtre du quatrième étage...", excerpt: "Chaque soir, une lumière..." },
      zh: { title: "四楼的窗", content: "每天傍晚，四楼的窗户都会亮起灯光...", excerpt: "每天傍晚，四楼的窗户..." },
      ko: { title: "4층의 창문", content: "매일 저녁, 4층 창문에 불이 켜졌다...", excerpt: "매일 저녁, 4층 창문에..." },
    },
  },
];

export function getWorksByCategory(category: string): TranslatedWork[] {
  return works.filter((w) => w.category === category && w.isPublished);
}
export function getWorkById(id: string): TranslatedWork | undefined {
  return works.find((w) => w.id === id);
}
export function getAllPublishedWorks(): TranslatedWork[] {
  return works.filter((w) => w.isPublished);
}
export function searchWorks(query: string): TranslatedWork[] {
  const q = query.toLowerCase();
  return works.filter((w) => w.isPublished && (w.title.toLowerCase().includes(q) || w.content.toLowerCase().includes(q) || w.tags.some(t => t.toLowerCase().includes(q))));
}
