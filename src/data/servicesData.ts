import { artistsData } from "./artistsData";
import { getTeamById } from "./teamData";

export type CurrencyCode = "UAH" | "USD" | "EUR";
export type ServicePerformerType = "artist" | "team";

export interface ServiceItemData {
    id: number;
    authorName: string;
    authorAvatar: string;
    performerType: ServicePerformerType;
    serviceImage: string;
    title: string;
    description: string;
    artSubCategory: string;
    location: string;
    price?: number;
    currency?: CurrencyCode;
    priceNegotiable: boolean;
}

const artistById = new Map(artistsData.map((artist) => [artist.id, artist]));

/** Ключі як у колишньому `teamsData` (id 1…5), значення — `TeamProfile.id` у `teamData`. */
const teamServiceLegacyKeyToProfileId: Record<number, string> = {
    1: "3",
    2: "1",
    3: "2",
    5: "4",
};

const getServiceAuthor = (serviceId: number) => {
    const artist = artistById.get(serviceId);

    return {
        authorName: artist?.artistName ?? "",
        authorAvatar: artist?.artistPhoto ?? "",
        performerType: "artist" as const,
    };
};

const getTeamServiceAuthor = (legacyTeamKey: number) => {
    const profileId = teamServiceLegacyKeyToProfileId[legacyTeamKey];
    const team = getTeamById(profileId);

    return {
        authorName: team.name,
        authorAvatar: team.avatar,
        performerType: "team" as const,
    };
};

export const servicesData: ServiceItemData[] = [
    // painting
    {
        id: 1,
        ...getServiceAuthor(1),
        serviceImage: "/services.jpg",
        title: "Живопис на замовлення",
        description: "Створюю авторські картини на замовлення для дому, офісу або подарунка. Працюю з вашою ідеєю, референсами та палітрою інтер'єру, щоб полотно виглядало органічно саме у вашому просторі. Перед фінальним етапом погоджую ескіз і кольорове рішення.",
        artSubCategory: "painting",
        location: "Львів",
        priceNegotiable: true,
    },
    {
        id: 2,
        ...getServiceAuthor(2),
        serviceImage: "/services.jpg",
        title: "Портрети олійними фарбами",
        description: "Пишу портрети олійними фарбами у класичному або сучасному стилі. Можливе виконання за фото, із попереднім узгодженням композиції, фону та настрою роботи. У результаті ви отримуєте живий, деталізований портрет із глибокою передачею характеру.",
        artSubCategory: "painting",
        location: "Київ",
        price: 675000,
        currency: "UAH",
        priceNegotiable: false,
    },
    // sculpture
    {
        id: 3,
        ...getServiceAuthor(3),
        serviceImage: "/services.jpg",
        title: "Скульптура та інсталяції",
        description: "Розробляю скульптурні об'єкти та інсталяції для публічних просторів, виставок і приватних колекцій. Від ідеї до монтажу супроводжую весь процес: концепт, матеріали, технічні рішення та інтеграцію у середовище. Фокусуюся на виразній формі та змісті, що запам'ятовується.",
        artSubCategory: "sculpture",
        location: "Одеса",
        priceNegotiable: true,
    },
    {
        id: 4,
        ...getServiceAuthor(4),
        serviceImage: "/services.jpg",
        title: "Скульптурний портрет",
        description: "Створюю портретні скульптури з глини та гіпсу для інтер'єрів і колекцій. Узгоджую характер пластики, масштаб і матеріал, а також готую варіанти тонування під конкретний простір. Готову роботу можна адаптувати для лиття у бронзі або композиті.",
        artSubCategory: "sculpture",
        location: "Київ",
        price: 444000,
        currency: "USD",
        priceNegotiable: false,
    },
    // graphics
    {
        id: 5,
        ...getServiceAuthor(5),
        serviceImage: "/services.jpg",
        title: "Графічний дизайн",
        description: "Створюю графічний дизайн для брендів, подій та цифрових продуктів: айдентика, афіші, презентації, банери для соцмереж. Працюю системно - від візуальної концепції до готових макетів для друку й онлайн-публікації. Рішення адаптую під вашу аудиторію та задачі бізнесу.",
        artSubCategory: "graphics",
        location: "Харків",
        price: 95000,
        currency: "EUR",
        priceNegotiable: false,
    },
    {
        id: 6,
        ...getServiceAuthor(6),
        serviceImage: "/services.jpg",
        title: "Ілюстрації для видань",
        description: "Розробляю ілюстрації для книжок, журналів і digital-статей у впізнаваному стилі. Працюю з сюжетом і композицією так, щоб зображення підсилювало текст і передавало потрібний настрій. Перед здачею надаю файли у форматах для друку та веб-публікації.",
        artSubCategory: "graphics",
        location: "Чернігів",
        priceNegotiable: true,
    },
    // art-photography
    {
        id: 7,
        ...getServiceAuthor(7),
        serviceImage: "/services.jpg",
        title: "Художня фотографія",
        description: "Проводжу художні фотозйомки для персональних, сімейних і комерційних проєктів. Підбираю локацію, світло та стилістику кадру так, щоб отримати цілісну історію, а не просто набір фото. У вартість входить базова ретуш і підготовка знімків для вебу та друку.",
        artSubCategory: "art-photography",
        location: "Івано-Франківськ",
        price: 140000,
        currency: "USD",
        priceNegotiable: false,
    },
    {
        id: 8,
        ...getServiceAuthor(8),
        serviceImage: "/services.jpg",
        title: "Фотопроєкти для брендів",
        description: "Знімаю креативні фотосерії для брендів, артистів і культурних подій. Формую візуальну концепцію, підбираю команду та контролюю постобробку, щоб матеріал одразу працював у PR і соцмережах. Можлива пакетна зйомка з кількома локаціями за один день.",
        artSubCategory: "art-photography",
        location: "Тернопіль",
        price: 380000,
        currency: "EUR",
        priceNegotiable: false,
    },
    // video-editing
    {
        id: 9,
        ...getServiceAuthor(9),
        serviceImage: "/services.jpg",
        title: "Відеозйомка та монтаж",
        description: "Надаю повний цикл відеопродакшену: зйомка, монтаж, кольорокорекція, титри та адаптація форматів під різні платформи. Працюю з рекламними роликами, репортажами подій і контентом для соцмереж. Важливою частиною є чіткий ритм монтажу та емоційний акцент у кожному кадрі.",
        artSubCategory: "video-editing",
        location: "Луцьк",
        priceNegotiable: true,
    },
    {
        id: 10,
        ...getServiceAuthor(10),
        serviceImage: "/services.jpg",
        title: "Рілси та короткі відео",
        description: "Створюю короткі вертикальні відео для Instagram, TikTok і YouTube Shorts. Беру на себе сценарний каркас, зйомку, монтаж і адаптацію під трендову динаміку платформи. На виході ви отримуєте контент-пакет із кількох роликів для регулярних публікацій.",
        artSubCategory: "video-editing",
        location: "Вінниця",
        price: 290000,
        currency: "USD",
        priceNegotiable: false,
    },
    // music
    {
        id: 11,
        ...getServiceAuthor(11),
        serviceImage: "/services.jpg",
        title: "Музичний супровід заходів",
        description: "Забезпечую музичний супровід заходів будь-якого формату: приватні події, презентації, камерні концерти та корпоративи. Формую програму під сценарій події - від фонового саунду до активного сценічного сету. За потреби допомагаю з технічним райдером і координацією звуку на майданчику.",
        artSubCategory: "music",
        location: "Полтава",
        price: 140,
        currency: "USD",
        priceNegotiable: false,
    },
    {
        id: 12,
        ...getServiceAuthor(12),
        serviceImage: "/services.jpg",
        title: "Авторська музика для відео",
        description: "Пишу оригінальні музичні теми для реклами, документальних роликів і подкастів. Підбираю темп, фактуру та інструментальний склад під драматургію вашого матеріалу. Передаю фінальні треки у потрібних технічних форматах з урахуванням платформи публікації.",
        artSubCategory: "music",
        location: "Ужгород",
        price: 210,
        currency: "EUR",
        priceNegotiable: false,
    },
    // directing
    {
        id: 13,
        ...getServiceAuthor(13),
        serviceImage: "/services.jpg",
        title: "Театральна режисура",
        description: "Пропоную режисерський супровід театральних постановок: від розбору драматургії до фінальних репетицій перед прем'єрою. Працюю з акторами, пластикою сцени, ритмом дії та візуальною структурою вистави. Мета - створити виразну постановку, яка тримає увагу глядача від першої до останньої сцени.",
        artSubCategory: "directing",
        location: "Черкаси",
        priceNegotiable: true,
    },
    {
        id: 14,
        ...getServiceAuthor(14),
        serviceImage: "/services.jpg",
        title: "Режисура подієвих шоу",
        description: "Розробляю режисерську концепцію для культурних і корпоративних подій: від сценарної структури до постановки номерів. Координую взаємодію ведучих, артистів і технічної команди, щоб програма мала цілісний ритм. Працюю як на етапі підготовки, так і в день проведення події.",
        artSubCategory: "directing",
        location: "Суми",
        price: 260,
        currency: "USD",
        priceNegotiable: false,
    },
    // acting
    {
        id: 15,
        ...getServiceAuthor(15),
        serviceImage: "/services.jpg",
        title: "Акторська майстерність для сцени",
        description: "Проводжу індивідуальні заняття з акторської майстерності для театру та публічних виступів. Працюємо над увагою, імпровізацією, мовленням і сценічною присутністю. Програма адаптується під ваш рівень і конкретну творчу мету.",
        artSubCategory: "acting",
        location: "Житомир",
        price: 3000,
        currency: "UAH",
        priceNegotiable: false,
    },
    {
        id: 16,
        ...getServiceAuthor(1),
        serviceImage: "/services.jpg",
        title: "Підготовка акторських self-tape",
        description: "Допомагаю акторам підготувати self-tape для кастингів: розбір сцени, партнерство в кадрі, запис і первинний монтаж. Фокус на точній подачі персонажа та технічно чистій картинці. За потреби можу підготувати кілька версій сцени для різних заявок.",
        artSubCategory: "acting",
        location: "Кропивницький",
        priceNegotiable: true,
    },
    // teams
    {
        id: 17,
        ...getTeamServiceAuthor(1),
        serviceImage: "/services.jpg",
        title: "Комплексна рекламна кампанія для події",
        description: "Команда бере на себе розробку та запуск рекламної кампанії для культурних подій: креатив, банери, відеооголошення та адаптація під соцмережі. Працюємо з єдиною візуальною концепцією і тримаємо фокус на охопленні та конверсії.",
        artSubCategory: "graphics",
        location: "Київ",
        priceNegotiable: true,
    },
    {
        id: 18,
        ...getTeamServiceAuthor(2),
        serviceImage: "/services.jpg",
        title: "Живий музичний сет для фестивалів",
        description: "Гурт готує повноцінний live-сет під формат події: від камерного виступу до великої сцени. У вартість входить узгодження програми, техрайдер та саундчек перед виступом.",
        artSubCategory: "music",
        location: "Львів",
        price: 120000,
        currency: "UAH",
        priceNegotiable: false,
    },
    {
        id: 19,
        ...getTeamServiceAuthor(3),
        serviceImage: "/services.jpg",
        title: "Імерсивна театральна постановка",
        description: "Театральна команда створює постановку під ваш простір і аудиторію: драматургія, режисура, акторський склад і репетиційний процес. Підходить для фестивалів, освітніх програм і корпоративних культурних ініціатив.",
        artSubCategory: "acting",
        location: "Одеса",
        priceNegotiable: true,
    },
    {
        id: 20,
        ...getTeamServiceAuthor(5),
        serviceImage: "/services.jpg",
        title: "Документальний відеопортрет бренду",
        description: "Команда знімає короткий документальний фільм про бренд або проєкт: інтерв'ю, зйомка процесів, монтаж і кольорокорекція. На виході ви отримуєте основну версію та адаптації для соцмереж.",
        artSubCategory: "video-editing",
        location: "Харків",
        price: 3500,
        currency: "USD",
        priceNegotiable: false,
    },
];
