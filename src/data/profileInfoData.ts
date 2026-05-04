/** Статичні дані вкладки «Інформація» для кожного автора (id як у artistsData / organizationsData). */

const SOCIAL_ICONS = {
  deviantart: "/socials/deviantart_yellow.svg",
  pinterest: "/socials/pinterest_yellow.svg",
  youtube: "/socials/youtube_yellow.svg",
  instagram: "/socials/instagram_yellow.svg",
  facebook: "/socials/facebook_yellow.svg",
  linkedin: "/socials/linked_in_yellow.svg",
  x: "/socials/x_yellow.svg",
} as const;

type SocialKey = keyof typeof SOCIAL_ICONS;

const SOCIAL_ALT: Record<SocialKey, string> = {
  deviantart: "DeviantArt",
  pinterest: "Pinterest",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
};

/** Пари [мережа, url] — у кожного автора свій набір і свої посилання. */
function socialLinks(...pairs: Array<[SocialKey, string]>): AuthorSocialLink[] {
  return pairs.map(([key, url]) => ({
    icon: SOCIAL_ICONS[key],
    alt: SOCIAL_ALT[key],
    url,
  }));
}

export interface AuthorSocialLink {
  icon: string;
  alt: string;
  url: string;
}

export interface AuthorProfileInfoRow {
  authorId: number;
  website: string;
  location: { country: string; city: string };
  description: string[];
  socialLinks: AuthorSocialLink[];
}

export const authorProfileInfoData: AuthorProfileInfoRow[] = [
  {
    authorId: 1,
    website: "olena-kravets.studio",
    location: { country: "Україна", city: "Київ" },
    description: [
      "Олена Кравець — режисерка, яка поєднує класичну драматургію з сучасною сценічною мовою. У фокусі її постановок — людина в моменті вибору, тіло як носій сенсу та точна робота з простором.",
      "Працює з театральними колективами в Україні та на міжнародних резиденціях; репертуар включає камерні й великі формати.",
      "Київ залишається базою, де вона репетирує нові проєкти й веде майстер-класи з постановки.",
      "Зараз готує серію вистав про пам'ять поколінь і публічну відповідальність мистецтва.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/olena.kravets.theatre"],
      ["facebook", "https://facebook.com/olena.kravets.director"],
      ["youtube", "https://youtube.com/@olenakravets_stage"],
    ),
  },
  {
    authorId: 2,
    website: "maksym-shevchenko.studio",
    location: { country: "Україна", city: "Львів" },
    description: [
      "Максим Шевченко — актор сцени й кіно, працює з психологічною глибиною ролі та чіткою пластикою.",
      "У портфоліо — драматичні та комедійні персонажі, участь у фестивальних показах і експериментальних читаннях.",
      "Львів для нього — місто репетиційних майданчиків і тісної співпраці з незалежними театрами.",
      "Цікавиться документальною основою образу та імпровізацією в межах заданої драматургії.",
    ],
    socialLinks: socialLinks(
      ["facebook", "https://facebook.com/maksym.shevchenko.actor"],
      ["instagram", "https://instagram.com/shevchenko.on.stage"],
      ["linkedin", "https://linkedin.com/in/maksym-shevchenko-actor"],
    ),
  },
  {
    authorId: 3,
    website: "iryna-melnyk.studio",
    location: { country: "Україна", city: "Одеса" },
    description: [
      "Ірина Мельник — музикантка та виконавиця, поєднує вокал з аранжуванням для сцени й кіно.",
      "Створює концертні програми від камерних сетів до оркестрових фрагментів; співпрацює з режисерами та хореографами.",
      "Одеса — місце її студійних записів і морського настрою в звучанні ліричних творів.",
      "Досліджує український мелос і сучасні ритмічні форми в одній площині.",
    ],
    socialLinks: socialLinks(
      ["youtube", "https://youtube.com/@iryna_melnyk_music"],
      ["instagram", "https://instagram.com/melnyk.vocal"],
      ["pinterest", "https://pinterest.com/irynamelnykboards"],
    ),
  },
  {
    authorId: 4,
    website: "andriy-sokolenko.studio",
    location: { country: "Україна", city: "Харків" },
    description: [
      "Андрій Соколенко — хореограф, будує партитури руху для театру, відео та публічних подій.",
      "Його постановки поєднують класичну техніку з сучасним танцем і роботою з живим простором глядача.",
      "Харків — місто, де зосереджені його лабораторії з трупою та освітні інтенсиви.",
      "Актуальні теми — колективне тіло, ритм міста та межа між перформансом і виставою.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/sokolenko.choreo"],
      ["x", "https://x.com/andriy_sokolenko"],
      ["youtube", "https://youtube.com/@sokolenko_dance_lab"],
    ),
  },
  {
    authorId: 5,
    website: "nataliia-bondar.studio",
    location: { country: "Україна", city: "Дніпро" },
    description: [
      "Наталія Бондар — перформерка, працює з оригінальним жанром: голос, об'єкт, тривалість дії.",
      "Її матеріали часто народжуються з імпровізації й доводяться до чіткої структури для галерей і сцени.",
      "Дніпро — локація експериментів із промисловими просторами та урбаністичним контекстом.",
      "Цікавиться етикою публічної присутності та тілесною пам'яттю аудиторії.",
    ],
    socialLinks: socialLinks(
      ["pinterest", "https://pinterest.com/nataliabondar_perform"],
      ["deviantart", "https://deviantart.com/nataliia-bondar"],
      ["instagram", "https://instagram.com/bondar.performance"],
    ),
  },
  {
    authorId: 6,
    website: "dmytro-romaniuk.studio",
    location: { country: "Україна", city: "Кривий Ріг" },
    description: [
      "Дмитро Романюк — фотограф, спеціалізується на художньому портреті та серійних проєктах про людину й середовище.",
      "Працює в студії та на локаціях; увага до світла, текстури шкіри й невимушеного жесту.",
      "Кривий Ріг і промислові пейзажі часто стають тлом для його метафоричних серій.",
      "Публікує роботи у каталогах виставок і співпрацює з культурними інституціями.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/romaniuk.photo"],
      ["pinterest", "https://pinterest.com/dmytroromaniuk_lens"],
      ["facebook", "https://facebook.com/dmytro.romaniuk.photo"],
    ),
  },
  {
    authorId: 7,
    website: "sofiia-tkachenko.studio",
    location: { country: "Україна", city: "Запоріжжя" },
    description: [
      "Софія Ткаченко — відеомейкер: зйомка, монтаж, постпродакшн і музичні кліпи.",
      "Будує візуальну історію від сценарного ритму до кольорокорекції; працює з артистами та брендами.",
      "Запоріжжя — точка опори для польових зйомок і документування міських трансформацій.",
      "Цінує чесний кадр і синхрон звуку з емоційною дугою матеріалу.",
    ],
    socialLinks: socialLinks(
      ["youtube", "https://youtube.com/@sofiia_tkachenko_films"],
      ["linkedin", "https://linkedin.com/in/sofiia-tkachenko-video"],
      ["x", "https://x.com/tkachenko_video"],
    ),
  },
  {
    authorId: 8,
    website: "yurii-kovalenko.studio",
    location: { country: "Україна", city: "Вінниця" },
    description: [
      "Юрій Коваленко — кінорежисер, зосереджується на повнометражній та серійній формі, сценарії й постановці акторів.",
      "Його історії часто торкаються родинних зв'язків, мовчання та невидимих соціальних меж.",
      "Вінниця — місто, де він розвиває авторські проєкти й підтримує локальну кіношколу.",
      "Співпрацює з операторами та композиторами як з рівноправними співавторами настрою.",
    ],
    socialLinks: socialLinks(
      ["linkedin", "https://linkedin.com/in/yurii-kovalenko-director"],
      ["facebook", "https://facebook.com/yurii.kovalenko.cinema"],
      ["youtube", "https://youtube.com/@kovalenko_films_vn"],
    ),
  },
  {
    authorId: 9,
    website: "maryna-honchar.studio",
    location: { country: "Україна", city: "Полтава" },
    description: [
      "Марина Гончар — AR-художниця, створює доповнені шари реальності для виставок, освіти та публічного простору.",
      "Поєднує 3D-об'єкти, анімацію та зручні для глядача сценарії взаємодії з телефоном.",
      "Полтава — база для експериментів із локальними історіями в цифровому шарі міста.",
      "Досліджує етику збору даних і доступність мистецтва нових медіа.",
    ],
    socialLinks: socialLinks(
      ["x", "https://x.com/maryna_honchar_ar"],
      ["instagram", "https://instagram.com/honchar.ar.layers"],
      ["linkedin", "https://linkedin.com/in/maryna-honchar-ar"],
    ),
  },
  {
    authorId: 10,
    website: "vitalii-lysenko.studio",
    location: { country: "Україна", city: "Чернігів" },
    description: [
      "Віталій Лисенко — живописець, працює олією з акцентом на колористиці та повітряній перспективі.",
      "Створює пейзажі та фігуративні композиції, де колір несе настрій і час доби.",
      "Чернігів і довкілля дають йому мотиви для циклів про річку, ліс і тихі міські кути.",
      "Бере участь у групових виставках і готує персональний показ нових полотен.",
    ],
    socialLinks: socialLinks(
      ["deviantart", "https://deviantart.com/vitalii-lysenko-paints"],
      ["facebook", "https://facebook.com/vitalii.lysenko.art"],
      ["instagram", "https://instagram.com/lysenko.oil.canvas"],
    ),
  },
  {
    authorId: 11,
    website: "kateryna-doroshenko.studio",
    location: { country: "Україна", city: "Івано-Франківськ" },
    description: [
      "Катерина Дорошенко — скульпторка, працює з бронзою, каменем і змішаними матеріалами.",
      "Її об'єкти балансують між монументальністю та інтимною деталлю; є серії для інтер'єру та скверу.",
      "Івано-Франківськ — місто майстерні, де вона веде повний цикл від моделі до патини.",
      "Цікавиться пластичним натяком і тактильністю поверхні в публічному мистецтві.",
    ],
    socialLinks: socialLinks(
      ["facebook", "https://facebook.com/kateryna.doroshenko.sculpt"],
      ["pinterest", "https://pinterest.com/doroshenko_sculpture"],
      ["linkedin", "https://linkedin.com/in/kateryna-doroshenko"],
    ),
  },
  {
    authorId: 12,
    website: "pavlo-yatsenko.studio",
    location: { country: "Україна", city: "Тернопіль" },
    description: [
      "Павло Яценко — графік: ліногравюра, малюнок, ілюстрація для книг і культурних проєктів.",
      "Любить чітку лінію, контраст і повторюваний орнамент як спосіб наративу.",
      "Тернопіль — місце друкарських експериментів і співпраці з видавництвами.",
      "Веде воркшопи з гравюри та збирає архів ескізів для майбутніх серій.",
    ],
    socialLinks: socialLinks(
      ["pinterest", "https://pinterest.com/pavlo_yatsenko_print"],
      ["deviantart", "https://deviantart.com/yatsenko-graphics"],
      ["youtube", "https://youtube.com/@yatsenko_linocut"],
    ),
  },
  {
    authorId: 13,
    website: "liudmyla-chernenko.studio",
    location: { country: "Україна", city: "Ужгород" },
    description: [
      "Людмила Черненко — поетеса, пише лірику з чітким ритмом і образами кордону, мови, пам'яті.",
      "Читає на фестивалях і в клубах; тексти перекладалися сусідніми мовами регіону.",
      "Ужгород впливає на багатоголосся культурних відсилань у її віршах.",
      "Готує збірку про тіло, дорогу і тихі діалоги з минулим.",
    ],
    socialLinks: socialLinks(
      ["x", "https://x.com/liudmyla_chernenko_poet"],
      ["facebook", "https://facebook.com/liudmyla.chernenko.poetry"],
      ["instagram", "https://instagram.com/chernenko.verses"],
    ),
  },
  {
    authorId: 14,
    website: "taras-omelchuk.studio",
    location: { country: "Україна", city: "Суми" },
    description: [
      "Тарас Омельчук — прозаїк і драматург, працює з оповіданням, романом і текстом для сцени.",
      "Його проза поєднує розмовну пластичність з точним соціальним спостереженням.",
      "Суми — місто, де він пише й тестує матеріали на читаннях перед публікацією.",
      "Цікавиться адаптацією літератури для подкастів і короткого метру кіно.",
    ],
    socialLinks: socialLinks(
      ["facebook", "https://facebook.com/taras.omelchuk.writer"],
      ["x", "https://x.com/omelchuk_prose"],
      ["linkedin", "https://linkedin.com/in/taras-omelchuk"],
    ),
  },
  {
    authorId: 15,
    website: "alina-savchuk.studio",
    location: { country: "Україна", city: "Черкаси" },
    description: [
      "Аліна Савчук — режисерка кіно та сцени, будує вистави й фільми з виразним візуальним кодом.",
      "Співпрацює з операторами та художниками-постановниками як з ключовими партнерами з самого початку ідеї.",
      "Черкаси — точка збору команди для документальних етюдів і авторських короткометражок.",
      "Теми: жіночий погляд на історію, межа між документом і вигадкою.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/alina.savchuk.film"],
      ["youtube", "https://youtube.com/@savchuk_director_channel"],
      ["linkedin", "https://linkedin.com/in/alina-savchuk-director"],
    ),
  },
  {
    authorId: 16,
    website: "serhii-laushkin.studio",
    location: { country: "Україна", city: "Кам'янське" },
    description: [
      "Пан Сергій відомий як майстер графіки, Він створює жанрові символікоалегоричні картини, пейзажі, інсталяції. Для творчості Сергія Павловича характерні узагальнено-символічний характер образів, ліризм, м'яка розкута мальовнича манера.",
      "Нерідко у центрі уваги — людина, її внутрішній світ, складні емоційні переживання та філософські роздуми.",
      "Творчість Сергія Лаушкіна, має за підмурівок напрацьовані традиції багатьох поколінь, творчо переосмислені митцем, та є цілком індивідуальною, тобто справжньою.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/serhii.laushkin.art"],
      ["facebook", "https://facebook.com/laushkin.graphic.painting"],
      ["deviantart", "https://deviantart.com/serhii-laushkin"],
    ),
  },
  {
    authorId: 101,
    website: "kyiv-modern-theatre.org",
    location: { country: "Україна", city: "Київ" },
    description: [
      "Київський модерний театр — колектив, що ставить сучасну драму й класику в оновленій сценічній подачі.",
      "Репертуар поєднує українських авторів і перекладні п'єси; активні гастролі та освітні програми.",
      "Базується в столиці, співпрацює з міжнародними режисерами та музикантами.",
      "Фокус на якості акторської ансамблевої гри та візуальній чистоті вистави.",
    ],
    socialLinks: socialLinks(
      ["facebook", "https://facebook.com/kyivmodernetheatre"],
      ["instagram", "https://instagram.com/kyiv_modern_theatre"],
      ["youtube", "https://youtube.com/@KyivModernTheatreUA"],
    ),
  },
  {
    authorId: 102,
    website: "lviv-chamber-stage.org",
    location: { country: "Україна", city: "Львів" },
    description: [
      "Львівська камерна сцена — театр невеликих форм із акцентом на психологічну драму й поетичний текст.",
      "Зал на обмежену кількість глядачів дозволяє інтимну близькість до гри акторів.",
      "Регулярні прем'єри, читання п'єс і зустрічі з авторами.",
      "Пріоритет — глибина режисури та музичні вставки в камерних виставах.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/lvov.chamber.stage"],
      ["facebook", "https://facebook.com/LvivChamberStage"],
    ),
  },
  {
    authorId: 103,
    website: "odesa-opera-lab.org",
    location: { country: "Україна", city: "Одеса" },
    description: [
      "Одеська опера LAB — експериментальний майданчик, де класичний вокал зустрічається з сучасною сценографією.",
      "Проводить лабораторії для молодих композиторів і виконавців, фестивальні покази.",
      "Одеса як портове місто впливає на міжжанрові колаборації та морські метафори в постановках.",
      "Місія — оновити сприйняття оперної форми без втрати академічної якості.",
    ],
    socialLinks: socialLinks(
      ["youtube", "https://youtube.com/@OdesaOperaLab"],
      ["facebook", "https://facebook.com/odesaoperalab"],
      ["instagram", "https://instagram.com/odesa_opera_lab"],
    ),
  },
  {
    authorId: 104,
    website: "kharkiv-dance-center.org",
    location: { country: "Україна", city: "Харків" },
    description: [
      "Харківський центр танцю — освітня та виставкова платформа для сучасної хореографії.",
      "Майстер-класи, резиденції хореографів і публічні покази в неконвенційних просторах.",
      "Підтримує молоді трупи та крос-дисциплінарні проєкти з музикою та візуальним мистецтвом.",
      "Харків залишається одним із ключових вузлів розвитку українського танцю.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/kharkiv_dance_center"],
      ["x", "https://x.com/kharkivdancectr"],
      ["youtube", "https://youtube.com/@KharkivDanceCenter"],
    ),
  },
  {
    authorId: 105,
    website: "dnipro-visual-hub.org",
    location: { country: "Україна", city: "Дніпро" },
    description: [
      "Dnipro Visual Hub — галерейний та кураторський хаб навколо живопису, графіки та мультимедіа.",
      "Організовує виставки, лекції та резиденції для художників з усієї України.",
      "Дніпро як індустріальний контекст відображається у виборі локацій і тем циклів.",
      "Співпрацює з колекціонерами та містом для публічних арт-інтервенцій.",
    ],
    socialLinks: socialLinks(
      ["pinterest", "https://pinterest.com/dniprovisualhub"],
      ["instagram", "https://instagram.com/dnipro_visual_hub"],
      ["linkedin", "https://linkedin.com/company/dnipro-visual-hub"],
    ),
  },
  {
    authorId: 106,
    website: "vinnytsia-photo-club.org",
    location: { country: "Україна", city: "Вінниця" },
    description: [
      "Вінницький фотоклуб — спільнота авторів і викладачів, що розвиває документальну та художню фотографію.",
      "Курси, критичні вечори та колективні проєкти про місто і його мешканців.",
      "Щорічні експозиції клубу подорожують регіоном.",
      "Акцент на етику зображення та підтримку початківців.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/vinnytsia_photo_club"],
      ["facebook", "https://facebook.com/vinnytsiaphotoclub"],
      ["pinterest", "https://pinterest.com/vinnytsiaphoto"],
    ),
  },
  {
    authorId: 107,
    website: "poltava-cinema-platform.org",
    location: { country: "Україна", city: "Полтава" },
    description: [
      "Полтавська кіно-платформа — покази незалежного кіно, кіноклуби та дискусії з режисерами.",
      "Підтримує локальних авторів і фестивальні короткометражки з усієї країни.",
      "Полтава як культурний центр Полтавщини збирає глядачів і професіоналів галузі.",
      "Пріоритет — доступ до якісного кіномовлення та освітні події для школярів.",
    ],
    socialLinks: socialLinks(
      ["youtube", "https://youtube.com/@PoltavaCinemaPlatform"],
      ["facebook", "https://facebook.com/poltavacinema"],
      ["x", "https://x.com/poltava_cinema"],
    ),
  },
  {
    authorId: 108,
    website: "chernihiv-art-space.org",
    location: { country: "Україна", city: "Чернігів" },
    description: [
      "Чернігівський арт-простір — майданчик для графіки, ілюстрації та лекторіїв про візуальну культуру.",
      "Резиденції ілюстраторів, групові виставки та співпраця з бібліотеками й школами.",
      "Історичне місто надихає цикли про архів, легенду та сучасну ідентичність.",
      "Відкритий до міждисциплінарних форматів і громадських обговорень.",
    ],
    socialLinks: socialLinks(
      ["deviantart", "https://deviantart.com/chernihivartspace"],
      ["pinterest", "https://pinterest.com/chernihiv_art_space"],
      ["instagram", "https://instagram.com/chernihiv_art_space"],
    ),
  },
  {
    authorId: 109,
    website: "ivano-frankivsk-prose-club.org",
    location: { country: "Україна", city: "Івано-Франківськ" },
    description: [
      "Клуб сучасної прози ІФ — літературні зустрічі, читання рукописів і дискусії з авторами.",
      "Фокус на українській прозі, перекладах і експериментальних жанрах.",
      "Івано-Франківськ як місто фестивалів підсилює міжнародні зв'язки клубу.",
      "Підтримує молодих письменників через менторство та публікації в антологіях.",
    ],
    socialLinks: socialLinks(
      ["facebook", "https://facebook.com/ifproseclub"],
      ["linkedin", "https://linkedin.com/company/if-prose-club"],
      ["x", "https://x.com/if_prose_club"],
    ),
  },
  {
    authorId: 110,
    website: "ternopil-poetry-lab.org",
    location: { country: "Україна", city: "Тернопіль" },
    description: [
      "Тернопільська поетична LAB — події для поезії: слеми, воркшопи, співпраця з музикантами.",
      "Платформа для експерименту з голосом, текстом на сцені та мультимедійним супроводом.",
      "Тернопільська аудиторія залучається до відкритих мікрофонів і кураторських вечорів.",
      "Мета — зберегти живу усну традицію й оновити поетичну мову.",
    ],
    socialLinks: socialLinks(
      ["x", "https://x.com/ternopil_poetry_lab"],
      ["instagram", "https://instagram.com/ternopil_poetry_lab"],
      ["youtube", "https://youtube.com/@TernopilPoetryLab"],
    ),
  },
  {
    authorId: 111,
    website: "uzhhorod-media-art-center.org",
    location: { country: "Україна", city: "Ужгород" },
    description: [
      "Uzhhorod Media Art Center — інституція медіамистецтва: відеоарт, інсталяції, резиденції та монтажні лабораторії.",
      "Співпраця з європейськими фестивалями та локальними авторами транскордонних проєктів.",
      "Ужгород як точка перетину культур впливає на тематику кордону й міграції в роботах.",
      "Освітні програми для студентів і відкриті студії художників.",
    ],
    socialLinks: socialLinks(
      ["youtube", "https://youtube.com/@UzhhorodMediaArt"],
      ["linkedin", "https://linkedin.com/company/uzhhorod-media-art-center"],
      ["instagram", "https://instagram.com/uzhhorod_media_art"],
    ),
  },
  {
    authorId: 112,
    website: "sumy-immersive-stage.org",
    location: { country: "Україна", city: "Суми" },
    description: [
      "Сумська імерсивна сцена — колектив, що створює імерсивні перформанси та експериментальні театральні маршрути.",
      "Глядач стає учасником дії; простір міста перетворюється на декорацію.",
      "Суми — поле для локальних історій і міжрегіональних гастролей формату.",
      "Безпека учасників і драматургія довіри — у центрі кожного проєкту.",
    ],
    socialLinks: socialLinks(
      ["instagram", "https://instagram.com/sumy_immersive_stage"],
      ["facebook", "https://facebook.com/sumyimmersive"],
      ["youtube", "https://youtube.com/@SumyImmersiveStage"],
    ),
  },
  {
    authorId: 113,
    website: "cherkasy-ar-foundation.org",
    location: { country: "Україна", city: "Черкаси" },
    description: [
      "Cherkasy AR Foundation — фундація доповненої реальності: освітні курси, виставки та міські активації.",
      "Розробляє AR-шари для музеїв, шкіл і культурних подій.",
      "Черкаси як база для пілотних проєктів із залученням ІТ-спільноти та митців.",
      "Популяризує етичні стандарти цифрового досвіду в публічному просторі.",
    ],
    socialLinks: socialLinks(
      ["linkedin", "https://linkedin.com/company/cherkasy-ar-foundation"],
      ["x", "https://x.com/cherkasy_ar_found"],
      ["youtube", "https://youtube.com/@CherkasyARFoundation"],
    ),
  },
  {
    authorId: 114,
    website: "zaporizhzhia-sculpture-yard.org",
    location: { country: "Україна", city: "Запоріжжя" },
    description: [
      "Запорізький скульптурний двір — об'єднання скульпторів і майстрів металу для публічних об'єктів і резиденцій.",
      "Майстерні відкриті для екскурсій; співпраця з містом щодо пам'ятників і паркових форм.",
      "Запоріжжя дає промисловий контекст для великих матеріалів і логістики.",
      "Освітні інтенсиви для студентів мистецьких закладів.",
    ],
    socialLinks: socialLinks(
      ["facebook", "https://facebook.com/zaporizhzhiasculptureyard"],
      ["instagram", "https://instagram.com/zaporizhzhia_sculpture_yard"],
      ["pinterest", "https://pinterest.com/zaporizhzhiasculpt"],
    ),
  },
  {
    authorId: 115,
    website: "kryvyi-rih-cultural-theatre.org",
    location: { country: "Україна", city: "Кривий Ріг" },
    description: [
      "Криворізький культурний театр — муніципальна та громадська програма вистав, гастролей і культурних центрів.",
      "Поєднує класичний репертуар із сучасними українськими п'єсами.",
      "Кривий Ріг як густонаселений індустріальний центр потребує сильної театральної присутності.",
      "Розвиває дитячі студії та волонтерські ініціативи для глядачів.",
    ],
    socialLinks: socialLinks(
      ["youtube", "https://youtube.com/@KryvyiRihCulturalTheatre"],
      ["instagram", "https://instagram.com/kryvyi_rih_culture_theatre"],
      ["facebook", "https://facebook.com/kryvyirihculturaltheatre"],
    ),
  },
];
