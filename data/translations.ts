import type { LanguageOption, Translations } from "@/types";

export const languages: LanguageOption[] = [
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
];

export const translations: Translations = {
  ru: {
    nav: { home: "Главная", poetry: "Поэзия", prose: "Проза", about: "Обо мне", contact: "Контакты" },
    hero: { greeting: "Добро пожаловать в мир", title: "Натальи Мельхер", subtitle: "Пространство вдохновения, где слова обретают крылья", cta: "Читать поэзию", ctaSecondary: "Открыть прозу" },
    sections: { latestWorks: "Последние произведения", poetry: "Поэзия", prose: "Проза", featured: "Избранное", allWorks: "Все", readMore: "Читать далее", backToHome: "На главную", minuteRead: "мин", views: "просмотров", likes: "нравится", publishedOn: "Опубликовано", tags: "Теги", noWorksFound: "Произведения не найдены", searchPlaceholder: "Искать..." },
    about: { title: "Обо мне", subtitle: "Наталья Мельхер", bio: "Я — Наталья Мельхер, автор, вдохновлённый красотой мира и глубиной человеческой души. Мои строки рождаются из тишины и наблюдения, из моментов, которые другие проходят мимо. Каждое стихотворение — это мост между невысказанным и понятым.", philosophy: "Моя философия", philosophyText: "Слово — это самый мощный инструмент, данный человеку. Оно способно исцелять, вдохновлять, пробуждать." },
    footer: { copyright: "© 2026 Наталья Мельхер", madeWith: "Создано с", inspiration: "и вдохновением", rights: "Все права защищены" },
    common: { loading: "Загрузка...", error: "Ошибка", retry: "Повторить", close: "Закрыть", language: "Язык", share: "Поделиться", copy: "Копировать", copied: "Скопировано!" },
  },
  en: {
    nav: { home: "Home", poetry: "Poetry", prose: "Prose", about: "About", contact: "Contact" },
    hero: { greeting: "Welcome to the world of", title: "Natalia Melkher", subtitle: "A space of inspiration where words find their wings", cta: "Read Poetry", ctaSecondary: "Explore Prose" },
    sections: { latestWorks: "Latest Works", poetry: "Poetry", prose: "Prose", featured: "Featured", allWorks: "All", readMore: "Read More", backToHome: "Back Home", minuteRead: "min", views: "views", likes: "likes", publishedOn: "Published", tags: "Tags", noWorksFound: "No works found", searchPlaceholder: "Search..." },
    about: { title: "About Me", subtitle: "Natalia Melkher", bio: "I am Natalia Melkher, an author inspired by the beauty of the world and the depth of the human soul.", philosophy: "My Philosophy", philosophyText: "The word is the most powerful tool given to humanity. It can heal, inspire, and awaken." },
    footer: { copyright: "© 2026 Natalia Melkher", madeWith: "Made with", inspiration: "and inspiration", rights: "All rights reserved" },
    common: { loading: "Loading...", error: "Error", retry: "Retry", close: "Close", language: "Language", share: "Share", copy: "Copy", copied: "Copied!" },
  },
  de: {
    nav: { home: "Start", poetry: "Poesie", prose: "Prosa", about: "Über mich", contact: "Kontakt" },
    hero: { greeting: "Willkommen in der Welt von", title: "Natalia Melkher", subtitle: "Ein Raum der Inspiration, wo Worte Flügel finden", cta: "Poesie lesen", ctaSecondary: "Prosa entdecken" },
    sections: { latestWorks: "Neueste Werke", poetry: "Poesie", prose: "Prosa", featured: "Empfohlen", allWorks: "Alle", readMore: "Weiterlesen", backToHome: "Startseite", minuteRead: "Min", views: "Aufrufe", likes: "Gefällt", publishedOn: "Veröffentlicht", tags: "Tags", noWorksFound: "Keine Werke gefunden", searchPlaceholder: "Suchen..." },
    about: { title: "Über mich", subtitle: "Natalia Melkher", bio: "Ich bin Natalia Melkher, inspiriert von der Schönheit der Welt.", philosophy: "Meine Philosophie", philosophyText: "Das Wort ist das mächtigste Werkzeug der Menschheit." },
    footer: { copyright: "© 2026 Natalia Melkher", madeWith: "Erstellt mit", inspiration: "und Inspiration", rights: "Alle Rechte vorbehalten" },
    common: { loading: "Laden...", error: "Fehler", retry: "Wiederholen", close: "Schließen", language: "Sprache", share: "Teilen", copy: "Kopieren", copied: "Kopiert!" },
  },
  fr: {
    nav: { home: "Accueil", poetry: "Poésie", prose: "Prose", about: "À propos", contact: "Contact" },
    hero: { greeting: "Bienvenue dans le monde de", title: "Natalia Melkher", subtitle: "Un espace d'inspiration où les mots trouvent leurs ailes", cta: "Lire la poésie", ctaSecondary: "Explorer la prose" },
    sections: { latestWorks: "Dernières œuvres", poetry: "Poésie", prose: "Prose", featured: "En vedette", allWorks: "Tout", readMore: "Lire la suite", backToHome: "Accueil", minuteRead: "min", views: "vues", likes: "j'aime", publishedOn: "Publié", tags: "Tags", noWorksFound: "Aucune œuvre trouvée", searchPlaceholder: "Rechercher..." },
    about: { title: "À propos", subtitle: "Natalia Melkher", bio: "Je suis Natalia Melkher, inspirée par la beauté du monde.", philosophy: "Ma philosophie", philosophyText: "Le mot est l'outil le plus puissant donné à l'humanité." },
    footer: { copyright: "© 2026 Natalia Melkher", madeWith: "Créé avec", inspiration: "et inspiration", rights: "Tous droits réservés" },
    common: { loading: "Chargement...", error: "Erreur", retry: "Réessayer", close: "Fermer", language: "Langue", share: "Partager", copy: "Copier", copied: "Copié !" },
  },
  zh: {
    nav: { home: "首页", poetry: "诗歌", prose: "散文", about: "关于", contact: "联系" },
    hero: { greeting: "欢迎来到", title: "娜塔莉亚·梅尔赫", subtitle: "灵感的空间，文字找到翅膀的地方", cta: "阅读诗歌", ctaSecondary: "探索散文" },
    sections: { latestWorks: "最新作品", poetry: "诗歌", prose: "散文", featured: "精选", allWorks: "全部", readMore: "阅读更多", backToHome: "返回首页", minuteRead: "分钟", views: "浏览", likes: "喜欢", publishedOn: "发布于", tags: "标签", noWorksFound: "未找到作品", searchPlaceholder: "搜索..." },
    about: { title: "关于我", subtitle: "娜塔莉亚·梅尔赫", bio: "我是娜塔莉亚·梅尔赫，被世界之美所启发的作家。", philosophy: "我的哲学", philosophyText: "文字是赋予人类最强大的工具。" },
    footer: { copyright: "© 2026 娜塔莉亚·梅尔赫", madeWith: "用", inspiration: "和灵感创建", rights: "版权所有" },
    common: { loading: "加载中...", error: "错误", retry: "重试", close: "关闭", language: "语言", share: "分享", copy: "复制", copied: "已复制！" },
  },
  ko: {
    nav: { home: "홈", poetry: "시", prose: "산문", about: "소개", contact: "연락처" },
    hero: { greeting: "환영합니다", title: "나탈리아 멜허", subtitle: "영감의 공간, 단어가 날개를 찾는 곳", cta: "시 읽기", ctaSecondary: "산문 탐색" },
    sections: { latestWorks: "최신 작품", poetry: "시", prose: "산문", featured: "추천", allWorks: "전체", readMore: "더 읽기", backToHome: "홈으로", minuteRead: "분", views: "조회", likes: "좋아요", publishedOn: "게시", tags: "태그", noWorksFound: "작품 없음", searchPlaceholder: "검색..." },
    about: { title: "소개", subtitle: "나탈리아 멜허", bio: "저는 세상의 아름다움에 영감을 받은 작가입니다.", philosophy: "나의 철학", philosophyText: "말은 인류에게 주어진 가장 강력한 도구입니다." },
    footer: { copyright: "© 2026 나탈리아 멜허", madeWith: "만든", inspiration: "영감으로", rights: "모든 권리 보유" },
    common: { loading: "로딩...", error: "오류", retry: "다시", close: "닫기", language: "언어", share: "공유", copy: "복사", copied: "복사됨!" },
  },
};
